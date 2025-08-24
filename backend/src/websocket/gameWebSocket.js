import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { supabase, CHANNELS } from '../config/supabase.js';
import { redisClient, CACHE_KEYS } from '../config/redis.js';

// WebSocket server for real-time game updates
export class GameWebSocket {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map(); // Map of wallet address to WebSocket connection
    this.setupWebSocket();
    this.setupSupabaseRealtime();
  }

  // Setup WebSocket server
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');

      // Handle authentication
      ws.on('message', async message => {
        try {
          const data = JSON.parse(message);

          if (data.type === 'authenticate') {
            await this.handleAuthentication(ws, data.token);
          } else if (data.type === 'subscribe') {
            await this.handleSubscription(ws, data);
          } else if (data.type === 'unsubscribe') {
            await this.handleUnsubscription(ws, data);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
            })
          );
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      // Handle errors
      ws.on('error', error => {
        console.error('WebSocket error:', error);
        this.handleDisconnect(ws);
      });

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'Connected to Aqua Stark WebSocket server',
        })
      );
    });
  }

  // Handle client authentication
  async handleAuthentication(ws, token) {
    try {
      if (!token) {
        ws.send(
          JSON.stringify({
            type: 'auth_error',
            message: 'Authentication token required',
          })
        );
        return;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const walletAddress = decoded.walletAddress;

      if (!walletAddress) {
        ws.send(
          JSON.stringify({
            type: 'auth_error',
            message: 'Invalid token payload',
          })
        );
        return;
      }

      // Store client connection
      this.clients.set(walletAddress, ws);
      ws.walletAddress = walletAddress;

      // Update active players in Redis
      await this.updateActivePlayers(walletAddress, true);

      ws.send(
        JSON.stringify({
          type: 'authenticated',
          walletAddress: walletAddress,
        })
      );

      console.log(`Client authenticated: ${walletAddress}`);
    } catch (error) {
      console.error('Authentication error:', error);
      ws.send(
        JSON.stringify({
          type: 'auth_error',
          message: 'Authentication failed',
        })
      );
    }
  }

  // Handle subscription to game events
  async handleSubscription(ws, data) {
    if (!ws.walletAddress) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Authentication required for subscription',
        })
      );
      return;
    }

    const { channel, resourceId } = data;

    if (!channel) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Channel required for subscription',
        })
      );
      return;
    }

    // Store subscription info
    if (!ws.subscriptions) {
      ws.subscriptions = new Set();
    }
    ws.subscriptions.add(`${channel}:${resourceId || 'all'}`);

    ws.send(
      JSON.stringify({
        type: 'subscribed',
        channel: channel,
        resourceId: resourceId,
      })
    );
  }

  // Handle unsubscription from game events
  async handleUnsubscription(ws, data) {
    const { channel, resourceId } = data;

    if (ws.subscriptions) {
      ws.subscriptions.delete(`${channel}:${resourceId || 'all'}`);
    }

    ws.send(
      JSON.stringify({
        type: 'unsubscribed',
        channel: channel,
        resourceId: resourceId,
      })
    );
  }

  // Handle client disconnect
  async handleDisconnect(ws) {
    if (ws.walletAddress) {
      this.clients.delete(ws.walletAddress);

      // Update active players in Redis
      await this.updateActivePlayers(ws.walletAddress, false);

      console.log(`Client disconnected: ${ws.walletAddress}`);
    }
  }

  // Setup Supabase real-time subscriptions
  setupSupabaseRealtime() {
    // Subscribe to fish updates
    supabase
      .channel(CHANNELS.FISH_UPDATES)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fish_states',
        },
        payload => {
          this.broadcastToSubscribers('fish_updates', payload.new.fish_id, {
            type: 'fish_update',
            fishId: payload.new.fish_id,
            data: payload.new,
            event: payload.eventType,
          });
        }
      )
      .subscribe();

    // Subscribe to aquarium updates
    supabase
      .channel(CHANNELS.AQUARIUM_UPDATES)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'aquarium_states',
        },
        payload => {
          this.broadcastToSubscribers(
            'aquarium_updates',
            payload.new.aquarium_id,
            {
              type: 'aquarium_update',
              aquariumId: payload.new.aquarium_id,
              data: payload.new,
              event: payload.eventType,
            }
          );
        }
      )
      .subscribe();

    // Subscribe to game events
    supabase
      .channel(CHANNELS.GAME_EVENTS)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'minigame_sessions',
        },
        payload => {
          this.broadcastToSubscribers(
            'game_events',
            payload.new.player_wallet,
            {
              type: 'game_event',
              playerWallet: payload.new.player_wallet,
              data: payload.new,
              event: payload.eventType,
            }
          );
        }
      )
      .subscribe();
  }

  // Broadcast message to subscribers
  broadcastToSubscribers(channel, resourceId, message) {
    this.clients.forEach((ws, walletAddress) => {
      if (
        ws.subscriptions &&
        ws.subscriptions.has(`${channel}:${resourceId}`)
      ) {
        ws.send(JSON.stringify(message));
      } else if (ws.subscriptions && ws.subscriptions.has(`${channel}:all`)) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Send message to specific client
  sendToClient(walletAddress, message) {
    const ws = this.clients.get(walletAddress);
    if (ws && ws.readyState === 1) {
      // WebSocket.OPEN
      ws.send(JSON.stringify(message));
    }
  }

  // Broadcast to all connected clients
  broadcast(message) {
    this.clients.forEach(ws => {
      if (ws.readyState === 1) {
        // WebSocket.OPEN
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Update active players in Redis
  async updateActivePlayers(walletAddress, isActive) {
    try {
      if (isActive) {
        await redisClient.sAdd(CACHE_KEYS.ACTIVE_PLAYERS, walletAddress);
      } else {
        await redisClient.sRem(CACHE_KEYS.ACTIVE_PLAYERS, walletAddress);
      }
    } catch (error) {
      console.error('Error updating active players:', error);
    }
  }

  // Get active players count
  async getActivePlayersCount() {
    try {
      return await redisClient.sCard(CACHE_KEYS.ACTIVE_PLAYERS);
    } catch (error) {
      console.error('Error getting active players count:', error);
      return 0;
    }
  }

  // Send fish happiness update
  sendFishHappinessUpdate(fishId, happinessLevel, ownerWallet) {
    this.sendToClient(ownerWallet, {
      type: 'fish_happiness_update',
      fishId: fishId,
      happinessLevel: happinessLevel,
      timestamp: new Date().toISOString(),
    });
  }

  // Send aquarium state update
  sendAquariumStateUpdate(aquariumId, state, ownerWallet) {
    this.sendToClient(ownerWallet, {
      type: 'aquarium_state_update',
      aquariumId: aquariumId,
      state: state,
      timestamp: new Date().toISOString(),
    });
  }

  // Send game event
  sendGameEvent(playerWallet, eventType, data) {
    this.sendToClient(playerWallet, {
      type: 'game_event',
      eventType: eventType,
      data: data,
      timestamp: new Date().toISOString(),
    });
  }
}

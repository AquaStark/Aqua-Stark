# 🎮 Controllers Documentation

This directory contains all the HTTP request handlers for the Aqua Stark backend API. Controllers act as the interface between HTTP requests and business logic, handling request validation, authentication, and response formatting.

## 📁 Controllers Overview

### 🐟 FishController (`fishController.js`)
Handles all operations related to fish management including states, happiness, feeding, and statistics.

**Purpose**: Manages fish lifecycle, health states, and player interactions with their aquatic pets.

**Key Features**:
- Fish state retrieval and updates
- Happiness level management
- Feeding system with different food types
- Fish statistics and breeding (future feature)
- Player fish collection management

### 👤 PlayerController (`playerController.js`)
Manages player profiles, experience, currency, preferences, and dashboard data.

**Purpose**: Handles player account management, progression tracking, and personalization features.

**Key Features**:
- Player profile creation and retrieval
- Experience and level progression
- Currency management
- Player preferences and settings
- Dashboard data aggregation
- Wallet address integration

### 🎯 MinigameController (`minigameController.js`)
Controls minigame sessions, scoring, leaderboards, and XP rewards.

**Purpose**: Manages all minigame-related functionality including session lifecycle and competitive features.

**Key Features**:
- Game session creation and management
- Score tracking and XP calculation
- Leaderboards (game-specific and global)
- Achievement bonus XP
- Game type information and metadata

### 🏠 DecorationController (`decorationController.js`)
Handles aquarium decoration placement, positioning, and management.

**Purpose**: Manages decorative items within player aquariums, including positioning and visibility controls.

**Key Features**:
- Decoration placement and removal
- Position and rotation updates
- Visibility toggling
- Bulk position updates (drag & drop)
- Inter-aquarium decoration movement
- Player decoration statistics

## 🛠️ Usage Examples

### FishController Examples

#### Get Fish State
```http
GET /api/v1/fish/fish-123
Authorization: Bearer <jwt-token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "fish_id": "fish-123",
    "player_id": "player-456",
    "happiness_level": 85,
    "hunger_level": 30,
    "health": 100,
    "mood": "happy",
    "last_fed_timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Feed Fish
```http
POST /api/v1/fish/fish-123/feed
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "foodType": "premium"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "fish_id": "fish-123",
    "hunger_level": 10,
    "happiness_level": 90,
    "last_fed_timestamp": "2024-01-15T14:45:00Z"
  },
  "message": "Fish fed with premium food"
}
```

### PlayerController Examples

#### Create Player
```http
POST /api/v1/players/create
Content-Type: application/json

{
  "playerId": "player-456",
  "walletAddress": "0x1234567890abcdef",
  "username": "AquaMaster"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "player_id": "player-456",
    "wallet_address": "0x1234567890abcdef",
    "username": "AquaMaster",
    "level": 1,
    "experience_current": 0,
    "experience_total": 100,
    "currency": 1000,
    "created_at": "2024-01-15T10:00:00Z"
  },
  "message": "Player created successfully"
}
```

#### Update Player Experience
```http
PUT /api/v1/players/player-456/experience
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "experienceGained": 50
}
```

### MinigameController Examples

#### Create Game Session
```http
POST /api/v1/minigames/sessions
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "gameType": "flappy_fish"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "session-789",
    "gameType": "flappy_fish",
    "playerId": "player-456",
    "startTime": "2024-01-15T15:00:00Z",
    "status": "active"
  },
  "message": "Game session created for flappy_fish"
}
```

#### End Game Session
```http
PUT /api/v1/minigames/sessions/session-789
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "finalScore": 1250,
  "gameType": "flappy_fish"
}
```

### DecorationController Examples

#### Place Decoration
```http
POST /api/v1/decorations/decoration-101/place
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "aquariumId": "aquarium-202",
  "positionX": 150,
  "positionY": 200,
  "rotationDegrees": 45
}
```

#### Bulk Update Positions
```http
PUT /api/v1/decorations/bulk-update
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "decorations": [
    {
      "decorationId": "decoration-101",
      "positionX": 100,
      "positionY": 150,
      "rotationDegrees": 30
    },
    {
      "decorationId": "decoration-102",
      "positionX": 200,
      "positionY": 250,
      "rotationDegrees": 0
    }
  ]
}
```

## 🛣️ Routes and Methods

### Fish Routes (`/api/v1/fish`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:fishId` | ✅ | Get fish state |
| GET | `/:fishId/stats` | ❌ | Get fish statistics |
| PUT | `/:fishId/happiness` | ✅ | Update fish happiness |
| POST | `/:fishId/feed` | ✅ | Feed fish |
| POST | `/breed` | ❌ | Breed fish (future feature) |
| GET | `/player/:playerId` | ✅ | Get player's fish collection |

### Player Routes (`/api/v1/players`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/profile/:playerId` | ✅ | Get player profile |
| GET | `/wallet/:walletAddress` | ❌ | Get player by wallet |
| POST | `/create` | ❌ | Create new player |
| PUT | `/:playerId/experience` | ✅ | Update player experience |
| PUT | `/:playerId/currency` | ✅ | Update player currency |
| PUT | `/:playerId/stats` | ✅ | Update player statistics |
| PUT | `/:playerId/login` | ✅ | Update last login |
| GET | `/:playerId/preferences` | ✅ | Get player preferences |
| PUT | `/:playerId/preferences` | ✅ | Update player preferences |
| GET | `/:playerId/dashboard` | ✅ | Get player dashboard |

### Minigame Routes (`/api/v1/minigames`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/sessions` | ✅ | Create game session |
| PUT | `/sessions/:sessionId` | ✅ | End game session |
| GET | `/stats` | ✅ | Get player minigame stats |
| GET | `/leaderboard/:gameType` | ❌ | Get game-specific leaderboard |
| GET | `/leaderboard` | ❌ | Get global leaderboard |
| POST | `/bonus-xp` | ✅ | Award bonus XP |
| GET | `/game-types` | ❌ | Get available game types |

### Decoration Routes (`/api/v1/decorations`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:decorationId` | ✅ | Get decoration state |
| POST | `/create` | ✅ | Create decoration state |
| GET | `/player/:playerId` | ✅ | Get player decorations |
| GET | `/aquarium/:aquariumId` | ❌ | Get aquarium decorations |
| POST | `/:decorationId/place` | ✅ | Place decoration in aquarium |
| DELETE | `/:decorationId` | ✅ | Remove decoration |
| PUT | `/:decorationId/position` | ✅ | Update decoration position |
| PUT | `/:decorationId/visibility` | ✅ | Toggle decoration visibility |
| PUT | `/:decorationId/move` | ✅ | Move decoration between aquariums |
| GET | `/player/:playerId/stats` | ✅ | Get player decoration stats |
| PUT | `/bulk-update` | ✅ | Bulk update decoration positions |

## 🤝 Contribution Guide

### Adding New Controllers

1. **Create Controller File**: Follow naming convention `{entity}Controller.js`
2. **Export Controller Class**: Use named export with descriptive class name
3. **Implement Static Methods**: All controller methods should be static
4. **Add Error Handling**: Wrap all methods in try-catch blocks
5. **Validate Input**: Check required parameters and data types
6. **Use Services**: Delegate business logic to service layer
7. **Return Consistent Responses**: Use standardized response format

### Controller Structure Template

```javascript
import { EntityService } from '../services/entityService.js';

export class EntityController {
  // Method for getting entity data
  static async getEntity(req, res) {
    try {
      const { entityId } = req.params;
      
      // Validation
      if (!entityId) {
        return res.status(400).json({ error: 'Entity ID is required' });
      }
      
      // Business logic via service
      const entity = await EntityService.getEntity(entityId);
      
      // Response
      res.json({ 
        success: true, 
        data: entity 
      });
    } catch (error) {
      console.error('Error in getEntity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### Coding Standards

- **Comments**: All comments in English
- **Error Messages**: Consistent error response format
- **Validation**: Input validation for all parameters
- **Authentication**: Use middleware for protected routes
- **Response Format**: Standardized JSON response structure
- **Logging**: Console.error for all caught exceptions

### Response Format Standards

```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}

// Error Response
{
  "error": "Error message",
  "details": "Optional additional details"
}
```

## ✅ Verification Steps

### Testing Controllers

1. **Start the Server**:
   ```bash
   cd backend
   pnpm dev
   ```

2. **Test Fish Controller**:
   ```bash
   # Get fish state (requires auth)
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3001/api/v1/fish/fish-123
   
   # Feed fish
   curl -X POST \
        -H "Authorization: Bearer <token>" \
        -H "Content-Type: application/json" \
        -d '{"foodType": "regular"}' \
        http://localhost:3001/api/v1/fish/fish-123/feed
   ```

3. **Test Player Controller**:
   ```bash
   # Create player (no auth required)
   curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"playerId": "test-123", "walletAddress": "0x123", "username": "TestUser"}' \
        http://localhost:3001/api/v1/players/create
   
   # Get player profile (requires auth)
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3001/api/v1/players/profile/test-123
   ```

4. **Test Minigame Controller**:
   ```bash
   # Get available game types (no auth required)
   curl http://localhost:3001/api/v1/minigames/game-types
   
   # Create game session (requires auth)
   curl -X POST \
        -H "Authorization: Bearer <token>" \
        -H "Content-Type: application/json" \
        -d '{"gameType": "flappy_fish"}' \
        http://localhost:3001/api/v1/minigames/sessions
   ```

5. **Test Decoration Controller**:
   ```bash
   # Get player decorations (requires auth)
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3001/api/v1/decorations/player/test-123
   
   # Place decoration (requires auth)
   curl -X POST \
        -H "Authorization: Bearer <token>" \
        -H "Content-Type: application/json" \
        -d '{"aquariumId": "aquarium-123", "positionX": 100, "positionY": 200}' \
        http://localhost:3001/api/v1/decorations/decoration-123/place
   ```

### Health Check

```bash
# Verify server is running
curl http://localhost:3001/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T15:30:00Z",
  "uptime": 12345
}
```

## 📚 Related Documentation

- **[Backend README](../README.md)** - Main backend documentation
- **[Services Documentation](../services/README.md)** - Business logic layer
- **[Routes Documentation](../routes/README.md)** - API endpoint definitions
- **[Middleware Documentation](../middleware/README.md)** - Authentication and validation
- **[Database Schema](../../supabase-schema.sql)** - Database structure
- **[API Endpoints](../README.md#-endpoints-api)** - Complete API reference

## 🔍 Documentation Validation

### Checklist for New Controllers

- [ ] Controller file follows naming convention
- [ ] All public methods are documented with examples
- [ ] Routes table includes all endpoints
- [ ] Authentication requirements are specified
- [ ] Request/response examples are provided
- [ ] Error handling is documented
- [ ] Service dependencies are listed
- [ ] Testing steps are included

### Validation Commands

```bash
# Verify all controllers are properly exported
node -e "console.log(Object.keys(require('./fishController.js')))"

# Check for missing documentation
grep -r "static async" . --include="*.js" | wc -l

# Validate response format consistency
grep -r "success: true" . --include="*.js"
```

---

*This documentation is automatically maintained. Please update when adding new controllers or modifying existing ones.*

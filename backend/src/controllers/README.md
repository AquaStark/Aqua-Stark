# 🎮 Controllers Documentation

This directory contains all the HTTP request controllers for the Aqua Stark backend API. Each controller handles specific business logic and communicates with the corresponding service layer.

## 📁 Structure Overview

```
controllers/
├── decorationController.js    # Decoration management operations
├── fishController.js         # Fish state and care operations  
├── minigameController.js     # Minigame sessions and leaderboards
├── playerController.js       # Player profile and preferences
└── README.md                # This documentation file
```

## 🎯 Controller Responsibilities

### **DecorationController** (`decorationController.js`)
Manages decoration placement, positioning, and visibility within aquariums.

**Key Features:**
- Decoration state management
- Position and rotation updates
- Bulk operations for drag & drop
- Aquarium decoration organization
- Player decoration statistics

**Main Methods:**
- `getDecorationState()` - Retrieve decoration details
- `createDecorationState()` - Create new decoration instance
- `placeDecoration()` - Position decoration in aquarium
- `updateDecorationPosition()` - Modify decoration coordinates
- `bulkUpdatePositions()` - Update multiple decorations at once

### **FishController** (`fishController.js`)
Handles fish care, feeding, and state management operations.

**Key Features:**
- Fish happiness and health tracking
- Feeding mechanics
- Fish statistics and breeding (future)
- Player fish collection management

**Main Methods:**
- `getFishState()` - Get current fish status
- `updateFishHappiness()` - Modify fish happiness level
- `feedFish()` - Feed fish with different food types
- `getPlayerFish()` - Retrieve all player's fish
- `breedFish()` - Fish breeding (placeholder for future)

### **MinigameController** (`minigameController.js`)
Manages minigame sessions, scoring, and leaderboard functionality.

**Key Features:**
- Game session lifecycle management
- Score tracking and XP calculation
- Leaderboard generation
- Achievement bonus system
- Multiple game type support

**Main Methods:**
- `createGameSession()` - Start new game session
- `endGameSession()` - Complete session with final score
- `getGameLeaderboard()` - Get game-specific rankings
- `getGlobalLeaderboard()` - Get overall player rankings
- `awardBonusXP()` - Grant achievement bonuses

### **PlayerController** (`playerController.js`)
Manages player profiles, preferences, and account operations.

**Key Features:**
- Player profile management
- Experience and currency tracking
- User preferences storage
- Dashboard data aggregation
- Authentication and authorization

**Main Methods:**
- `getPlayerProfile()` - Retrieve player information
- `createPlayer()` - Register new player account
- `updatePlayerExperience()` - Modify player XP
- `updatePlayerCurrency()` - Update player currency
- `getPlayerDashboard()` - Get comprehensive player data

## 🛣️ Route Mapping

### Decoration Routes (`/api/v1/decorations`)
```javascript
GET    /:decorationId                    # Get decoration state
POST   /create                          # Create decoration state
GET    /player/:playerId                # Get player decorations
GET    /player/:playerId/stats          # Get decoration statistics
GET    /aquarium/:aquariumId            # Get aquarium decorations
POST   /:decorationId/place             # Place decoration
DELETE /:decorationId/remove            # Remove decoration
PUT    /:decorationId/position          # Update position
PUT    /:decorationId/visibility        # Toggle visibility
PUT    /:decorationId/move              # Move between aquariums
PUT    /bulk/positions                  # Bulk position updates
```

### Fish Routes (`/api/v1/fish`)
```javascript
GET    /:fishId                         # Get fish state
GET    /:fishId/stats                   # Get fish statistics
PUT    /:fishId/happiness               # Update happiness
POST   /:fishId/feed                    # Feed fish
POST   /breed                           # Breed fish (future)
GET    /player/:playerId                # Get player fish collection
```

### Minigame Routes (`/api/v1/minigames`)
```javascript
POST   /sessions                        # Create game session
GET    /sessions/:sessionId             # Get session details
PUT    /sessions/:sessionId/end         # End game session
GET    /player/stats                    # Get player statistics
GET    /leaderboard/:gameType           # Get game leaderboard
GET    /leaderboard/global              # Get global leaderboard
POST   /achievements/bonus-xp           # Award bonus XP
GET    /types                           # Get available game types
```

### Player Routes (`/api/v1/players`)
```javascript
GET    /profile/:playerId               # Get player profile
GET    /wallet/:walletAddress           # Get player by wallet
POST   /create                          # Create new player
PUT    /:playerId/experience            # Update experience
PUT    /:playerId/currency              # Update currency
PUT    /:playerId/stats                 # Update statistics
PUT    /:playerId/login                 # Update last login
GET    /:playerId/preferences           # Get preferences
PUT    /:playerId/preferences           # Update preferences
GET    /:playerId/dashboard             # Get dashboard data
```

## 🔐 Authentication & Authorization

### Middleware Usage
- **`simpleAuth`** - Basic JWT token validation
- **`validateOwnership`** - Ensures resource ownership
- **`AuthMiddleware.verifyToken`** - Full token verification
- **`AuthMiddleware.rateLimit`** - Request rate limiting

### Security Features
- JWT-based authentication
- Resource ownership validation
- Rate limiting protection
- Input validation and sanitization
- Error handling without information leakage

## 📝 Usage Examples

### Creating a New Decoration
```javascript
// POST /api/v1/decorations/create
{
  "decorationId": "dec_123",
  "aquariumId": "aq_456"
}
```

### Feeding a Fish
```javascript
// POST /api/v1/fish/fish_789/feed
{
  "foodType": "premium"
}
```

### Starting a Minigame Session
```javascript
// POST /api/v1/minigames/sessions
{
  "gameType": "flappy_fish"
}
```

### Updating Player Experience
```javascript
// PUT /api/v1/players/player_123/experience
{
  "experienceGained": 150
}
```

## 🧪 Verification Steps

### Testing Controller Functionality

1. **Authentication Test**
   ```bash
   # Test without token (should fail)
   curl -X GET http://localhost:3001/api/v1/players/profile/player_123
   
   # Test with valid token (should succeed)
   curl -X GET http://localhost:3001/api/v1/players/profile/player_123 \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Ownership Validation Test**
   ```bash
   # Test accessing another player's resource (should fail)
   curl -X GET http://localhost:3001/api/v1/fish/fish_456 \
        -H "Authorization: Bearer TOKEN_FOR_DIFFERENT_PLAYER"
   ```

3. **Input Validation Test**
   ```bash
   # Test with invalid happiness level (should fail)
   curl -X PUT http://localhost:3001/api/v1/fish/fish_123/happiness \
        -H "Authorization: Bearer YOUR_JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"happinessLevel": 150}'
   ```

4. **Rate Limiting Test**
   ```bash
   # Make multiple rapid requests (should eventually be rate limited)
   for i in {1..10}; do
     curl -X GET http://localhost:3001/api/v1/minigames/types
   done
   ```

## 🤝 Contributing to Controllers

### Adding New Controllers

1. **Create Controller File**
   ```javascript
   // controllers/newController.js
   import { NewService } from '../services/newService.js';
   
   export class NewController {
     static async newMethod(req, res) {
       try {
         // Implementation here
         res.json({ success: true, data: result });
       } catch (error) {
         console.error('Error in newMethod:', error);
         res.status(500).json({ error: 'Internal server error' });
       }
     }
   }
   ```

2. **Create Corresponding Routes**
   ```javascript
   // routes/newRoutes.js
   import express from 'express';
   import { NewController } from '../controllers/newController.js';
   import { simpleAuth } from '../middleware/auth.js';
   
   const router = express.Router();
   router.get('/endpoint', simpleAuth, NewController.newMethod);
   export default router;
   ```

3. **Update Main Router**
   ```javascript
   // index.js
   import newRoutes from './routes/newRoutes.js';
   app.use('/api/v1/new', newRoutes);
   ```

### Controller Development Guidelines

- **Single Responsibility**: Each controller should handle one specific domain
- **Error Handling**: Always wrap logic in try-catch blocks
- **Input Validation**: Validate all incoming data
- **Authentication**: Use appropriate middleware for security
- **Documentation**: Add JSDoc comments for complex methods
- **Testing**: Write unit tests for all controller methods

### Code Style Requirements

- Use **camelCase** for method names
- Use **descriptive** method names that indicate the action
- Include **error logging** with console.error
- Return **consistent** response format: `{ success: boolean, data: any, message?: string }`
- Use **async/await** for asynchronous operations
- Follow **ES6+** syntax standards

## 🔗 Related Documentation

- [Backend README](../README.md) - Main backend documentation
- [Services Documentation](../services/README.md) - Service layer documentation
- [Routes Documentation](../routes/README.md) - Route configuration
- [Middleware Documentation](../middleware/README.md) - Authentication and validation
- [API Documentation](../../docs/api.md) - Complete API reference

## 📊 Performance Considerations

- **Caching**: Controllers use Redis for frequently accessed data
- **Rate Limiting**: Applied to prevent abuse
- **Input Validation**: Early validation to prevent unnecessary processing
- **Error Handling**: Graceful error responses without system information
- **Async Operations**: Non-blocking I/O for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify JWT token is valid and not expired
   - Check token format: `Bearer <token>`
   - Ensure user has proper permissions

2. **Ownership Validation Failures**
   - Verify the resource belongs to the authenticated user
   - Check if the resource exists in the database
   - Ensure proper middleware is applied

3. **Input Validation Errors**
   - Check required fields are provided
   - Verify data types match expected format
   - Ensure numeric values are within valid ranges

4. **Rate Limiting**
   - Implement exponential backoff for retries
   - Consider caching frequently requested data
   - Monitor request patterns for optimization

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=controllers:* npm run dev
```

This will provide detailed logging for all controller operations.

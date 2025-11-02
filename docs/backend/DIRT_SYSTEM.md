# 🧹 Dirt System Documentation

## Overview

The Dirt System is a realistic aquarium cleanliness management system that simulates how aquariums get dirty over time when players are away. It uses logarithmic calculations based on real-time to create a natural and engaging cleaning experience.

## 🎯 Key Features

- **Realistic Time-Based Dirt Accumulation**: Aquariums get dirty based on actual time elapsed since last cleaning
- **Grace Period**: 4-hour grace period where no dirt accumulates
- **Logarithmic Growth**: Dirt accumulates slowly at first, then accelerates
- **Partial vs Complete Cleaning**: Two cleaning modes with different effects
- **Backend Integration**: Full API support with caching and real-time updates
- **Visual Feedback**: Rich UI components with animations and notifications

## 📊 Dirt Level Calculation

### Formula
```
If hours <= 4: dirt_level = 0 (grace period)
If hours > 4: dirt_level = min(95, 30 * log10((hours-4)/2 + 1))
```

### Dirt Level Ranges
- **0-10%**: Clean (green)
- **10-30%**: Slightly Dirty (light yellow)
- **30-50%**: Needs Attention (yellow)
- **50-70%**: Dirty (orange)
- **70-90%**: Very Dirty (red)
- **90-95%**: Critical (dark red)

## 🗄️ Database Schema

### New Fields in `aquarium_states` Table

```sql
-- Core dirt system fields
last_cleaning_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
dirt_level DECIMAL(5,2) DEFAULT 0.0 CHECK (dirt_level >= 0.0 AND dirt_level <= 100.0)
partial_dirt_level DECIMAL(5,2) DEFAULT 0.0 CHECK (partial_dirt_level >= 0.0 AND partial_dirt_level <= 100.0)
cleaning_streak INTEGER DEFAULT 0
total_cleanings INTEGER DEFAULT 0

-- Configuration
dirt_config JSONB DEFAULT '{
  "grace_period_hours": 4,
  "dirt_multiplier": 30,
  "max_dirt_level": 95,
  "log_base": 10,
  "cleaning_threshold": 10
}'::jsonb
```

### Database Functions

- `calculate_dirt_level()` - Calculates current dirt level based on time
- `update_aquarium_dirt_level()` - Updates aquarium dirt level
- `clean_aquarium()` - Handles cleaning operations

## 🔌 API Endpoints

### Get Aquarium Dirt Status
```http
GET /api/v1/dirt/aquarium/:aquariumId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "aquarium_id": "123",
    "current_dirt_level": 45.2,
    "partial_dirt_level": 45.2,
    "last_cleaning_time": "2025-01-15T10:00:00Z",
    "cleaning_streak": 3,
    "total_cleanings": 15,
    "hours_since_cleaning": 12.5,
    "is_dirty": true,
    "needs_cleaning": true,
    "cleanliness_status": {
      "level": "moderate",
      "label": "Needs Attention",
      "color": "yellow"
    }
  }
}
```

### Clean Aquarium
```http
POST /api/v1/dirt/aquarium/:aquariumId/clean
Authorization: Bearer <token>
Content-Type: application/json

{
  "cleaning_type": "partial" // or "complete"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "old_dirt_level": 45.2,
    "new_dirt_level": 33.9,
    "is_complete_cleaning": false,
    "cleaning_streak": 3,
    "aquarium_id": "123",
    "player_id": "player123",
    "cleaning_type": "partial",
    "timestamp": "2025-01-15T22:30:00Z"
  }
}
```

### Get Player Aquarium Dirt Statuses
```http
GET /api/v1/dirt/player/:playerId/aquariums
Authorization: Bearer <token>
```

### Initialize Dirt System
```http
POST /api/v1/dirt/aquarium/:aquariumId/initialize
Authorization: Bearer <token>
Content-Type: application/json

{
  "config": {
    "grace_period_hours": 4,
    "dirt_multiplier": 30,
    "max_dirt_level": 95
  }
}
```

## 🎮 Frontend Integration

### Hook Usage
```typescript
import { useDirtSystemRealistic } from '@/hooks';

const dirtSystem = useDirtSystemRealistic({
  aquariumId: '123',
  playerId: 'player123',
  authToken: 'jwt-token',
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
});

// Access dirt data
const { dirtLevel, isDirty, needsCleaning, spots } = dirtSystem;

// Clean aquarium
await dirtSystem.cleanAquarium('partial');
```

### Components
- `CleanButton` - Interactive cleaning button with modal
- `CleaningModeNotification` - Notification during cleaning
- `DirtOverlay` - Visual dirt spots overlay
- `DirtDebugger` - Development debugging panel

## ⚙️ Configuration

### Default Configuration
```json
{
  "grace_period_hours": 4,
  "dirt_multiplier": 30,
  "max_dirt_level": 95,
  "log_base": 10,
  "cleaning_threshold": 10
}
```

### Customization
- **Grace Period**: Time before dirt starts accumulating
- **Dirt Multiplier**: Speed of dirt accumulation
- **Max Dirt Level**: Maximum dirt level (never 100%)
- **Log Base**: Logarithmic base for calculation
- **Cleaning Threshold**: Level below which cleaning is considered complete

## 🚀 Setup Instructions

### 1. Run Migration
```bash
cd backend
node scripts/run-dirt-migration.js
```

### 2. Initialize Existing Aquariums
```javascript
// For each existing aquarium
await DirtService.initializeAquariumDirtSystem(aquariumId, playerId);
```

### 3. Frontend Integration
```typescript
// Replace old dirt system with realistic one
import { useDirtSystemRealistic } from '@/hooks';

const dirtSystem = useDirtSystemRealistic({
  aquariumId: 'your-aquarium-id',
  playerId: 'your-player-id',
  authToken: 'your-auth-token',
});
```

## 🧪 Testing

### Manual Testing
1. Create an aquarium
2. Wait for dirt to accumulate (or modify `last_cleaning_time` in DB)
3. Test partial and complete cleaning
4. Verify dirt level calculations

### API Testing
```bash
# Get dirt status
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/v1/dirt/aquarium/123

# Clean aquarium
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"cleaning_type": "partial"}' \
  http://localhost:3001/api/v1/dirt/aquarium/123/clean
```

## 📈 Performance Considerations

- **Caching**: Dirt status cached for 5 minutes
- **Database Functions**: Calculations done at database level
- **Auto-refresh**: Configurable refresh intervals
- **Efficient Queries**: Indexed fields for fast lookups

## 🔮 Future Enhancements

- **Fish Impact**: Different fish types affect dirt accumulation
- **Equipment Effects**: Filters and decorations reduce dirt
- **Seasonal Events**: Special events that affect dirt levels
- **Achievements**: Cleaning streaks and maintenance rewards
- **Analytics**: Player cleaning patterns and behavior

## 🐛 Troubleshooting

### Common Issues

1. **Dirt not accumulating**: Check `last_cleaning_time` is not in the future
2. **API errors**: Verify authentication and aquarium ownership
3. **Frontend not updating**: Check auto-refresh settings and network
4. **Migration fails**: Ensure database permissions and connection

### Debug Mode
Enable debug mode in development to see detailed dirt system information:
```typescript
// In development, debug panel is automatically shown
{process.env.NODE_ENV === 'development' && (
  <DirtDebugger dirtSystem={dirtSystem} />
)}
```

## 📝 Changelog

### v1.0.0 (2025-01-15)
- Initial implementation of realistic dirt system
- Backend API with full CRUD operations
- Frontend components with animations
- Database migration and functions
- Comprehensive documentation

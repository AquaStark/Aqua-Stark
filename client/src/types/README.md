# Types Documentation

This folder contains TypeScript type definitions for the Aqua-Stark game client. These types ensure type safety across the application and provide clear contracts for data structures, API interfaces, and component props.

## 📁 File Overview

### Core Game Types

#### `game.ts`
**Purpose**: Core game entities and contract interfaces for fish, aquariums, and blockchain integration.

**Key Types**:
- `FishType` - Frontend fish representation with position, stats, and metadata
- `AquariumData` - Aquarium container with fish collection
- `ContractFish` - Blockchain fish entity with Cairo-compatible types
- `ContractAquarium` - On-chain aquarium state
- `FishSpecies` - Enum for fish species (`AngelFish`, `GoldFish`, `Betta`, etc.)

**Usage Example**:
```typescript
import { FishType, ContractFish } from '@/types/game';

const myFish: FishType = {
  id: 1,
  name: "Nemo",
  image: "/fish/goldfish.png",
  position: { x: 100, y: 200 },
  rarity: "Common",
  generation: 1,
  stats: {
    happiness: 80,
    hunger: 60,
    energy: 90
  }
};
```

#### `fish.ts`
**Purpose**: Fish-specific types for breeding, genetics, and fish states.

**Key Types**:
- `Fish` - Complete fish entity with traits and breeding info
- `FishStateType` - Fish behavior states (`idle`, `swimming`, `eating`, `rejecting`)
- `BreedingPair` - Father and mother fish for breeding
- `BreedingResult` - Offspring fish with genetic inheritance
- `GeneticCombination` - Genetic trait combinations and probabilities

**Usage Example**:
```typescript
import { Fish, BreedingPair } from '@/types/fish';

const breedingPair: BreedingPair = {
  father: myFish,
  mother: anotherFish
};
```

#### `fishIndicators.d.ts`
**Purpose**: Fish health and status indicator system with decay mechanics.

**Key Types**:
- `FishIndicatorState` - Current fish indicators (hunger, energy, happiness)
- `FishIndicatorOptions` - Configuration for indicator decay rates
- `UseFishIndicatorsParams` - Hook parameters for fish indicators
- `HappinessWeights` - Contribution weights for happiness calculation

**Usage Example**:
```typescript
import { FishIndicatorState } from '@/types/fishIndicators';

const indicators: FishIndicatorState = {
  hunger: 75,
  energy: 60,
  happiness: 85,
  lastFedAt: new Date(),
  lastUpdatedAt: new Date()
};
```

### Game Systems

#### `dirt.ts`
**Purpose**: Comprehensive dirt/cleaning system with visual effects and game mechanics.

**Key Types**:
- `DirtSpot` - Individual dirt spot with position, type, and aging
- `DirtType` - Enum for dirt types (`BASIC`, `ALGAE`, `WASTE`, `DEBRIS`, `GRIME`)
- `DirtSystemConfig` - System configuration with spawn rates and bounds
- `DirtSystemState` - Current system state with analytics
- `DIRT_TYPE_CONFIG` - Visual properties for each dirt type

**Usage Example**:
```typescript
import { DirtSpot, DirtType } from '@/types/dirt';

const dirtSpot: DirtSpot = {
  id: 1,
  position: { x: 150, y: 300 },
  type: DirtType.ALGAE,
  size: 20,
  opacity: 0.8,
  createdAt: Date.now(),
  intensity: 0.5
};
```

#### `food.ts`
**Purpose**: Food system for fish feeding mechanics.

**Key Types**:
- `FoodItem` - Food particle with position and consumption state
- `FoodSystemState` - System state with spawn cooldowns and limits

**Usage Example**:
```typescript
import { FoodItem } from '@/types/food';

const food: FoodItem = {
  id: 1,
  position: { x: 200, y: 150 },
  createdAt: Date.now(),
  consumed: false,
  attractionRadius: 50,
  scale: 1.0
};
```

### User Interface Types

#### `ui-types.ts`
**Purpose**: Common UI component types, animations, and form structures.

**Key Types**:
- `ModalProps` - Modal component configuration
- `FormField` - Form field definition with validation
- `LoadingState` - Loading and error state management
- `MotionAnimationProps` - Framer Motion animation properties
- `CardVariant` - Card component styling variants

**Usage Example**:
```typescript
import { ModalProps, FormField } from '@/types/ui-types';

const modalProps: ModalProps = {
  isOpen: true,
  onClose: () => setOpen(false),
  title: "Fish Details",
  size: "medium"
};
```

#### `help-types.ts`
**Purpose**: Help system and documentation structure.

**Key Types**:
- `Topic` - Help topic with sections and content
- `Category` - Help category grouping topics
- `ContentSection` - Individual content section with type and formatting
- `IconType` - Available icon types for help content

### Wallet & Blockchain

#### `wallet-types.ts`
**Purpose**: Wallet connection and transaction types.

**Key Types**:
- `WalletConnector` - Wallet provider interface
- `WalletAccount` - Connected wallet account info
- `StarknetAccount` - Starknet-specific account type
- `TransactionRequest` - Transaction parameters
- `TransactionResponse` - Transaction result

**Usage Example**:
```typescript
import { WalletAccount } from '@/types/wallet-types';

const account: WalletAccount = {
  address: "0x123...",
  chainId: "SN_MAIN",
  isConnected: true,
  isConnecting: false
};
```

#### `connector-types.ts`
**Purpose**: Specific wallet connector implementations.

**Key Types**:
- `WalletConnector` - Base connector interface
- `CartridgeConnector` - Cartridge wallet connector
- `ArgentXConnector` - Argent X wallet connector
- `BraavosConnector` - Braavos wallet connector

#### `cartridge.ts`
**Purpose**: Cartridge Controller integration types (Spanish comments indicate active development).

**Key Types**:
- `CartridgeAccount` - Cartridge account with social login support
- `CartridgeSession` - Session management
- `CartridgeConfig` - Controller configuration
- `GameSessionPolicies` - Game-specific session policies

### API & Backend

#### `api-types.ts`
**Purpose**: API request/response structures and backend communication.

**Key Types**:
- `ApiResponse<T>` - Generic API response wrapper
- `ApiError` - Error response structure
- `PlayerCreateRequest` - Player creation payload
- `FishStateRequest` - Fish state update payload
- `DecorationPlaceRequest` - Decoration placement payload

**Usage Example**:
```typescript
import { ApiResponse, PlayerCreateRequest } from '@/types/api-types';

const response: ApiResponse<PlayerData> = {
  data: playerData,
  success: true,
  message: "Player created successfully"
};
```

#### `player-types.ts`
**Purpose**: Player data structures for frontend, backend, and blockchain.

**Key Types**:
- `PlayerData` - Frontend player representation
- `BackendPlayerData` - Database player structure (snake_case)
- `OnChainPlayerData` - Blockchain player entity
- `GameCall` - Smart contract call structure

### Market & Trading

#### `market.ts`
**Purpose**: Marketplace and trading system types.

**Key Types**:
- `Fish` - Marketplace fish with seller info and pricing
- `MarketFilters` - Search and filter options
- `Transaction` - Trading transaction record
- `MarketItem` - Generic marketplace item

### Laboratory & Breeding

#### `laboratory.ts`
**Purpose**: Fish breeding laboratory types.

**Key Types**:
- `BreedingPair` - Fish pair for breeding
- `BreedingResult` - Breeding outcome with genetic traits

### Events & Community

#### `events.ts`
**Purpose**: Calendar events and community activities.

**Key Types**:
- `CalendarEvent` - Event with dates, participants, and rewards
- `EventFilters` - Event filtering and sorting options

#### `community.ts`
**Purpose**: Community features and social interactions.

**Key Types**:
- `CommunityEventFilters` - Community event filtering
- `CommunityGalleryFilters` - Gallery content filtering

### Framework Integration

#### `dojo.ts`
**Purpose**: Dojo framework integration.

**Key Types**:
- `DojoClient` - Dojo world client type

## 🎯 Usage Guidelines

### Import Patterns
```typescript
// Specific imports (recommended)
import { Fish, FishStateType } from '@/types/fish';
import { DirtSpot, DirtType } from '@/types/dirt';

// Type-only imports for type annotations
import type { ApiResponse } from '@/types/api-types';
```

### Type Guards
Many types include utility functions for type checking:
```typescript
import { isDirtType } from '@/types/dirt';

if (isDirtType(value)) {
  // value is now typed as DirtType
}
```

### Generic Types
Use generic types for flexible, reusable interfaces:
```typescript
import { ApiResponse } from '@/types/api-types';

// Typed API response
const fishData: ApiResponse<Fish[]> = await fetchFish();
```

## 🔧 Development Guidelines

### Adding New Types

1. **Choose the appropriate file** based on the domain (game, UI, API, etc.)
2. **Follow naming conventions**:
   - Interfaces: `PascalCase` (e.g., `FishData`)
   - Types: `PascalCase` (e.g., `FishStateType`)
   - Enums: `PascalCase` with `UPPER_CASE` values
3. **Add JSDoc comments** for complex types
4. **Include usage examples** in this README
5. **Export utility functions** when helpful (type guards, validators)

### Type Safety Best Practices

1. **Use strict types** instead of `any`
2. **Prefer interfaces over types** for object shapes
3. **Use union types** for controlled values
4. **Add optional properties** with `?` when appropriate
5. **Use generic types** for reusable patterns

### Validation

Types should be validated at runtime when receiving external data:

```typescript
import { z } from 'zod';

const FishSchema = z.object({
  id: z.number(),
  name: z.string(),
  rarity: z.enum(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'])
});

// Validate API response
const validatedFish = FishSchema.parse(apiData);
```

## 📚 Related Documentation

- [Frontend README](../README.md) - Main client documentation
- [Components Documentation](../components/README.md) - Component usage
- [API Documentation](../../backend/README.md) - Backend API reference
- [Smart Contracts](../../contract/README.md) - Blockchain contracts

## 🤝 Contributing

When contributing new types:

1. **Follow existing patterns** in the codebase
2. **Update this README** with new type descriptions
3. **Add usage examples** for complex types
4. **Consider backward compatibility** when modifying existing types
5. **Run type checking** with `npm run type-check`

### Type Validation Checklist

- [ ] All types are properly exported
- [ ] Complex types have JSDoc documentation
- [ ] Usage examples are provided for new types
- [ ] Type guards are implemented where needed
- [ ] Generic types are used appropriately
- [ ] No `any` types without justification
- [ ] Backward compatibility is maintained

---

*This documentation is automatically validated against the actual type definitions. Last updated: 2025-09-12*

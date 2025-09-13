# Utils Directory

This directory contains utility functions and helpers used throughout the Aqua-Stark application. Each utility is designed with a single responsibility and follows the project's naming conventions.

## 📁 Files Overview

- [`experience.ts`](#experiencets) - Experience and level calculation utilities
- [`fishIndicators.ts`](#fishindicatorsts) - Fish health indicators and state management
- [`starknet.ts`](#starknetts) - Starknet-specific data conversion utilities
- [`walletMode.ts`](#walletmodets) - Wallet mode management and configuration

---

## experience.ts

**Purpose**: Handles experience point calculations, level progression, and XP gain management for the game.

### Functions

#### `calculateExperienceProgress(currentXP: number, requiredXP: number): number`

Calculates the percentage progress towards the next level.

**Parameters:**
- `currentXP` - Current experience points
- `requiredXP` - Required experience points for next level

**Returns:** Progress percentage (0-100)

**Example:**
```typescript
import { calculateExperienceProgress } from '@/utils/experience';

const progress = calculateExperienceProgress(750, 1000);
console.log(progress); // 75
```

#### `handleExperienceGain(currentLevel: number, currentXP: number, gainedXP: number, experienceToNextLevel: (level: number) => number)`

Handles XP gain and automatic level progression across multiple levels.

**Parameters:**
- `currentLevel` - Current player level
- `currentXP` - Current experience points
- `gainedXP` - Experience points gained
- `experienceToNextLevel` - Function that returns XP required for next level

**Returns:** Object with `level`, `experience`, and `experienceToNextLevel`

**Example:**
```typescript
import { handleExperienceGain } from '@/utils/experience';

const result = handleExperienceGain(
  5, 
  800, 
  500, 
  (level) => level * 200 // 200 XP per level
);
// Result: { level: 7, experience: 100, experienceToNextLevel: 1400 }
```

---

## fishIndicators.ts

**Purpose**: Manages fish health indicators including hunger, energy, happiness, and cleanliness with time-based decay calculations.

### Constants

#### `DEFAULT_OPTIONS: FishIndicatorOptions`

Default configuration for fish indicator calculations.

### Functions

#### `clamp(v: number, min: number, max: number): number`

Clamps a value between minimum and maximum bounds.

**Example:**
```typescript
import { clamp } from '@/utils/fishIndicators';

const value = clamp(150, 0, 100);
console.log(value); // 100
```

#### `hoursBetween(a: Date, b: Date): number`

Calculates hours between two dates.

**Example:**
```typescript
import { hoursBetween } from '@/utils/fishIndicators';

const hours = hoursBetween(new Date('2024-01-01'), new Date('2024-01-02'));
console.log(hours); // 24
```

#### `cleanlinessPenalty(cleanliness: IndicatorValue, maxPenalty: number): number`

Calculates cleanliness penalty factor for decay calculations.

**Example:**
```typescript
import { cleanlinessPenalty } from '@/utils/fishIndicators';

const penalty = cleanlinessPenalty(50, 0.5);
console.log(penalty); // 0.25 (50% cleanliness = 25% penalty)
```

#### `applyDecay(value: number, hours: number, baseDecayPerHour: number, cleanliness: IndicatorValue, maxPenalty: number, clampMin: number, clampMax: number): number`

Applies time-based decay to an indicator value.

**Example:**
```typescript
import { applyDecay } from '@/utils/fishIndicators';

const newHunger = applyDecay(80, 2, 15, 100, 0.5, 0, 100);
console.log(newHunger); // 50 (80 - 30 decay)
```

#### `computeHappiness(hunger: number, energy: number, cleanliness: IndicatorValue, weights: HappinessWeights, clampMin: number, clampMax: number): number`

Calculates overall happiness based on weighted indicators.

**Example:**
```typescript
import { computeHappiness, DEFAULT_OPTIONS } from '@/utils/fishIndicators';

const happiness = computeHappiness(
  80, 
  70, 
  90, 
  DEFAULT_OPTIONS.happinessWeights,
  0, 
  100
);
console.log(happiness); // Weighted average of all indicators
```

#### `computeNextIndicators(prev: FishIndicatorState, now: Date, cleanliness: IndicatorValue, options: FishIndicatorOptions): FishIndicatorState`

Computes the next state of all fish indicators based on time elapsed.

**Example:**
```typescript
import { computeNextIndicators, DEFAULT_OPTIONS } from '@/utils/fishIndicators';

const nextState = computeNextIndicators(
  previousState,
  new Date(),
  85,
  DEFAULT_OPTIONS
);
```

#### `feedIndicators(state: FishIndicatorState, boost: number, options: FishIndicatorOptions): FishIndicatorState`

Applies feeding boost to fish indicators and updates last fed timestamp.

**Example:**
```typescript
import { feedIndicators, DEFAULT_OPTIONS } from '@/utils/fishIndicators';

const fedState = feedIndicators(currentState, 35, DEFAULT_OPTIONS);
```

---

## starknet.ts

**Purpose**: Provides utilities for converting strings to Starknet felt format.

### Functions

#### `stringToFelt(str: string)`

Converts a string to Starknet felt format. Handles both short strings (≤31 chars) and longer strings by splitting into multiple felts.

**Parameters:**
- `str` - String to convert

**Returns:** Single BigInt felt or array of BigInt felts

**Example:**
```typescript
import { stringToFelt } from '@/utils/starknet';

// Short string
const felt = stringToFelt("hello");
console.log(felt); // BigInt representation

// Long string (splits into multiple felts)
const felts = stringToFelt("This is a very long string that exceeds 31 characters");
console.log(felts); // Array of BigInt felts
```

---

## walletMode.ts

**Purpose**: Manages wallet mode configuration and provides utilities for switching between Katana (development) and Cartridge (production) modes.

### Classes

#### `WalletModeManager`

Static class for managing wallet modes and configurations.

**Methods:**

##### `getCurrentMode(): WalletMode`
Returns the current wallet mode (KATANA or CARTRIDGE).

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

const mode = WalletModeManager.getCurrentMode();
console.log(mode); // 'KATANA' or 'CARTRIDGE'
```

##### `isKatanaMode(): boolean`
Checks if currently using Katana prefunded accounts.

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

if (WalletModeManager.isKatanaMode()) {
  console.log('Development mode active');
}
```

##### `isCartridgeMode(): boolean`
Checks if currently using Cartridge Controller.

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

if (WalletModeManager.isCartridgeMode()) {
  console.log('Production mode active');
}
```

##### `getModeDescription(): string`
Returns human-readable description of current mode.

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

const description = WalletModeManager.getModeDescription();
console.log(description); // "Development Mode (Katana Prefunded Accounts)"
```

##### `getDebugInfo()`
Returns comprehensive debug information about current configuration.

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

const debugInfo = WalletModeManager.getDebugInfo();
console.log(debugInfo);
```

##### `getRecommendations(): string[]`
Returns recommendations based on current wallet mode.

**Example:**
```typescript
import { WalletModeManager } from '@/utils/walletMode';

const recommendations = WalletModeManager.getRecommendations();
console.log(recommendations); // Array of recommendation strings
```

### Hooks

#### `useWalletMode()`

React hook that provides wallet mode information and utilities.

**Returns:** Object with mode, description, flags, config, debugInfo, and recommendations.

**Example:**
```typescript
import { useWalletMode } from '@/utils/walletMode';

function WalletInfo() {
  const { mode, isKatana, recommendations } = useWalletMode();
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Is Katana: {isKatana ? 'Yes' : 'No'}</p>
      <ul>
        {recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
      </ul>
    </div>
  );
}
```

---

## 🔧 Contribution Guide

When adding new utilities to this directory:

1. **Follow naming conventions**: Use kebab-case for files and camelCase for functions
2. **Single responsibility**: Each utility should have one clear purpose
3. **Type safety**: Use TypeScript types and interfaces from `/src/types/`
4. **Documentation**: Add JSDoc comments for all exported functions
5. **Testing**: Include usage examples in this README
6. **Import organization**: Use absolute imports with `@/` prefix

### File Structure Template

```typescript
// Purpose: Brief description of what this utility does
import type { YourType } from '@/types/your-types';

/**
 * Brief description of the function
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
export const yourFunction = (param1: Type): ReturnType => {
  // Implementation
};

// Export types if needed
export type { YourType };
```

---

## ✅ Verification Steps

To ensure all utilities work correctly:

1. **Experience Utils**:
   ```bash
   # Test in browser console or component
   import { calculateExperienceProgress } from '@/utils/experience';
   console.log(calculateExperienceProgress(500, 1000)); // Should return 50
   ```

2. **Fish Indicators**:
   ```bash
   # Test decay calculations
   import { applyDecay } from '@/utils/fishIndicators';
   const result = applyDecay(100, 1, 10, 100, 0.5, 0, 100);
   console.log(result); // Should return 90
   ```

3. **Starknet Utils**:
   ```bash
   # Test string conversion
   import { stringToFelt } from '@/utils/starknet';
   const felt = stringToFelt("test");
   console.log(typeof felt); // Should be "bigint"
   ```

4. **Wallet Mode**:
   ```bash
   # Test mode detection
   import { WalletModeManager } from '@/utils/walletMode';
   console.log(WalletModeManager.getCurrentMode()); // Should return valid mode
   ```

---

## 🔗 Related Documentation

- [Frontend Documentation](../README.md)
- [Types Documentation](../types/README.md)
- [Components Documentation](../components/README.md)
- [Project Architecture](../../docs/architecture.md)

---

## 📝 Notes

- All utilities are designed to be pure functions when possible
- Time-based calculations use JavaScript Date objects
- Starknet utilities handle BigInt conversions for blockchain compatibility
- Wallet mode utilities automatically log debug information in development

# 📖 Hooks Documentation

<hr>

This folder contains custom React hooks used across the Aqua Stark frontend. Hooks encapsulate reusable logic for state management, API calls, game systems, and UI behaviors.

---

## 📚 Purpose

Each hook provides a focused set of features for a specific domain (aquarium, fish, player, UI, etc.), enabling modular and maintainable code.

---

## 🐟 Hook Reference

### `useAquarium`

**Purpose:**  
Provides functions to interact with the AquaStark client: create aquariums, add/move fish and decorations, and query aquarium data.

**Usage Example:**
```typescript
import { useAquarium } from '@/hooks';

const { newAquarium, getAquarium } = useAquarium();

await newAquarium(account, "0xOwner", 10, 5);
const data = await getAquarium(1);
```

**Dependencies:**  
- `@dojoengine/sdk/react`
- `starknet`
- `@/typescript/models.gen`

---

### `useBubbles`

**Purpose:**  
Manages animated bubble effects for backgrounds and UI.

**Usage Example:**
```typescript
import { useBubbles } from '@/hooks';

const bubbles = useBubbles({ initialCount: 10, maxBubbles: 20 });
```

**Dependencies:**  
- React

---

### `useCartridgeConnection`

**Purpose:**  
Handles connection logic for Cartridge wallet integration.

**Usage Example:**
```typescript
import { useCartridgeConnection } from '@/hooks';

const { connect, disconnect, isConnected } = useCartridgeConnection();
```

**Dependencies:**  
- Cartridge
- Starknet

---

### `useCartridgeSession`

**Purpose:**  
Manages Cartridge session state, including address, username, and session type.

**Usage Example:**
```typescript
import { useCartridgeSession } from '@/hooks';

const { isConnected, address, username, connect, disconnect } = useCartridgeSession();
```

**Dependencies:**  
- Cartridge

---

### `useCommunity`

**Purpose:**  
Handles community features, such as events and gallery interactions.

**Usage Example:**
```typescript
import { useCommunity } from '@/hooks';

const { getEvents, joinEvent } = useCommunity();
```

**Dependencies:**  
- React

---

### `useStarknetConnect`

**Purpose:**  
Manages Starknet wallet connection and state.

**Usage Example:**
```typescript
import { useStarknetConnect } from '@/hooks';

const { connect, disconnect, account } = useStarknetConnect();
```

**Dependencies:**  
- `@starknet-react/core`

---

### `useDebounce`

**Purpose:**  
Provides debounced value updates for inputs and state.

**Usage Example:**
```typescript
import { useDebounce } from '@/hooks';

const { debouncedValue } = useDebounce(value, { delay: 300 });
```

**Dependencies:**  
- React

---

### `useDevConsoleHandlers`

**Purpose:**  
Encapsulates handlers for developer console actions and contract requests.

**Usage Example:**
```typescript
import { useDevConsoleHandlers } from '@/hooks';

const { handleRegisterPlayer, handleGetPlayer } = useDevConsoleHandlers();
```

**Dependencies:**  
- React
- Zustand

---

### `useDirtSystem`

**Purpose:**  
Manages dirt spots, cleaning logic, and analytics for aquariums.

**Usage Example:**
```typescript
import { useDirtSystem } from '@/hooks';

const { state, cleanSpot } = useDirtSystem({ maxSpots: 10 });
```

**Dependencies:**  
- React
- Zustand

---

### `useDirtSystemFixed`

**Purpose:**  
Provides a fixed configuration version of the dirt system for testing and debugging.

**Usage Example:**
```typescript
import { useDirtSystemFixed } from '@/hooks';

const dirtSystem = useDirtSystemFixed();
```

**Dependencies:**  
- React

---

### `useDirtSystemRealistic`

**Purpose:**  
Implements realistic dirt system logic with backend integration and auto-refresh.

**Usage Example:**
```typescript
import { useDirtSystemRealistic } from '@/hooks';

const dirtSystem = useDirtSystemRealistic({ aquariumId: '123', autoRefresh: true });
```

**Dependencies:**  
- React

---

### `useEncyclopedia`

**Purpose:**  
Manages encyclopedia state, navigation, and data queries.

**Usage Example:**
```typescript
import { useEncyclopedia } from '@/hooks';

const { activeTab, setActiveTab } = useEncyclopedia();
```

**Dependencies:**  
- React

---

### `useEventsCalendar`

**Purpose:**  
Handles event calendar state, filtering, and event selection.

**Usage Example:**
```typescript
import { useEventsCalendar } from '@/hooks';

const { activeTab, viewType, handleEventClick } = useEventsCalendar();
```

**Dependencies:**  
- React

---

### `useExperience`

**Purpose:**  
Manages experience points, level progression, and XP calculations.

**Usage Example:**
```typescript
import { useExperience } from '@/hooks';

const { xp, level, gainXP } = useExperience();
```

**Dependencies:**  
- React

---

### `useFishMovement`

**Purpose:**  
Controls fish movement, position, and behavior within aquariums.

**Usage Example:**
```typescript
import { useFishMovement } from '@/hooks';

const { moveFish, setBehavior } = useFishMovement(fishes, options);
```

**Dependencies:**  
- React

---

### `useFishStats`

**Purpose:**  
Tracks and updates fish stats such as hunger, energy, and happiness.

**Usage Example:**
```typescript
import { useFishStats } from '@/hooks';

const { stats, updateStats } = useFishStats(initialState);
```

**Dependencies:**  
- React

---

### `useFoodSystem`

**Purpose:**  
Manages food items, feeding logic, and fish hunger state.

**Usage Example:**
```typescript
import { useFoodSystem } from '@/hooks';

const { feedFish, getFoodItems } = useFoodSystem();
```

**Dependencies:**  
- Zustand

---

### `useGames`

**Purpose:**  
Handles mini-game state and logic.

**Usage Example:**
```typescript
import { useGames } from '@/hooks';

const { startGame, endGame } = useGames();
```

**Dependencies:**  
- React

---

### `useHelpCenter`

**Purpose:**  
Handles help center navigation, topic selection, and featured topics.

**Usage Example:**
```typescript
import { useHelpCenter } from '@/hooks';

const { handleCategoryClick, handleTopicClick } = useHelpCenter();
```

**Dependencies:**  
- React

---

### `useLoadingNavigation`

**Purpose:**  
Provides navigation helpers with loading state management.

**Usage Example:**
```typescript
import { useLoadingNavigation } from '@/hooks';

const { navigateToOnboardingWithLoading } = useLoadingNavigation();
```

**Dependencies:**  
- React Router

---

### `useModal`, `useMultipleModals`, `useConfirmModal`

**Purpose:**  
Unified hooks for managing modal state and behavior across the application.

**Usage Example:**
```typescript
import { useModal } from '@/hooks';

const { open, close, isOpen } = useModal();
```

**Dependencies:**  
- React

---

### `useNotifications`

**Purpose:**  
Manages notification state and provides methods to show, hide, and clear notifications.

**Usage Example:**
```typescript
import { useNotifications } from '@/hooks';

const { success, error, info, show, hide, clear } = useNotifications();

success('Operation completed!');
error('Something went wrong.');
```

**Dependencies:**  
- Zustand
- Sonner

---

### `useSettings`

**Purpose:**  
Manages user and game settings.

**Usage Example:**
```typescript
import { useSettings } from '@/hooks';

const { settings, updateSetting } = useSettings();
```

**Dependencies:**  
- Zustand

---

### `useShopData`

**Purpose:**  
Handles shop data, item queries, and purchase logic.

**Usage Example:**
```typescript
import { useShopData } from '@/hooks';

const { getItems, purchaseItem } = useShopData();
```

**Dependencies:**  
- Zustand

---

### `useSimpleWalletConnection`

**Purpose:**  
Simplified wallet connection logic for basic wallet integrations.

**Usage Example:**
```typescript
import { useSimpleWalletConnection } from '@/hooks';

const { connect, disconnect } = useSimpleWalletConnection();
```

**Dependencies:**  
- Starknet

---

### `useStoreFilters`

**Purpose:**  
Manages store filter state and logic.

**Usage Example:**
```typescript
import { useStoreFilters } from '@/hooks';

const { filters, setFilter } = useStoreFilters();
```

**Dependencies:**  
- Zustand

---

### `useFishIndicators`

**Purpose:**  
Manages fish health indicators including hunger, energy, and happiness.

**Usage Example:**
```typescript
import { useFishIndicators } from '@/hooks';

const { indicators, updateIndicators } = useFishIndicators(initialState);
```

**Dependencies:**  
- React

---

### `useGameActions`

**Purpose:**  
Provides game action functions such as feeding fish, cleaning aquariums, collecting rewards, and upgrades.

**Usage Example:**
```typescript
import { useGameActions } from '@/hooks';

const { feedFish, cleanAquarium, collectRewards } = useGameActions();
```

**Dependencies:**  
- React

---

### `usePlayerValidation`

**Purpose:**  
Combines on-chain and backend validation for players, handles synchronization and loading states.

**Usage Example:**
```typescript
import { usePlayerValidation } from '@/hooks';

const { validatePlayer, isValidating } = usePlayerValidation();
```

**Dependencies:**  
- React
- Backend API

---

### `useLocalStorage`

**Purpose:**  
Provides local storage helpers for persistent state.

**Usage Example:**
```typescript
import { useLocalStorage } from '@/hooks';

const [value, setValue] = useLocalStorage('key', defaultValue);
```

**Dependencies:**  
- React

---

### `useApi`, `useApiRequest`

**Purpose:**  
Unified API hooks for handling HTTP requests and API state.

**Usage Example:**
```typescript
import { useApi } from '@/hooks';

const { get, post, loading, error } = useApi();
```

**Dependencies:**  
- React

---

### `usePlayerApi`

**Purpose:**  
Player-related API operations using the unified useApi hook.

**Usage Example:**
```typescript
import { usePlayerApi } from '@/hooks';

const { getPlayer, updatePlayerStats } = usePlayerApi();
```

**Dependencies:**  
- React

---

### Dojo Hooks (`useAquarium`, `useDecoration`, `useFish`, `usePlayer`)

**Purpose:**  
Hooks for interacting with Dojo client and contract models.

**Usage Example:**
```typescript
import { useAquarium, useFish, usePlayer } from '@/hooks';

const aquarium = useAquarium();
const fish = useFish();
const player = usePlayer();
```

**Dependencies:**  
- `@dojoengine/sdk/react`
- `starknet`
- `@/typescript/models.gen`

---

### Minigames Hooks (`useGameLogic`, `useInputHandler`)

**Purpose:**  
Hooks for minigame logic and input handling (e.g., Floppy Fish).

**Usage Example:**
```typescript
import { useGameLogic, useInputHandler } from '@/hooks';

const game = useGameLogic();
const input = useInputHandler();
```

**Dependencies:**  
- React

---

## 🤝 Contribution Guide

1. **Create a new hook file** using `use-` prefix and camelCase.
2. **Document the hook** with JSDoc comments and add a section in this README.
3. **Follow the useCallback/useMemo pattern** for performance.
4. **Add unit tests** in the same directory or `/test`.
5. **Update this README** with purpose, usage, dependencies, and verification steps.

---

## ✅ Verification Steps

1. Run the development server:  
   ```bash
   pnpm dev
   ```
2. Use the hook in a component and verify expected behavior.
3. Run tests:  
   ```bash
   pnpm test
   ```
4. Check for type errors:  
   ```bash
   pnpm type-check
   ```

---

## 🔗 Related Documentation

- [Frontend README](https://github.com/AquaStark/Aqua-Stark/blob/main/client/README.md)
- [Types Documentation](../types/README.md)
- [Dojo SDK](https://docs.dojo.tech/development-resources/sdk)
- [Starknet React](https://www.starknet-react.com/docs/getting-started)

---

## 📝 Documentation Validation

- Ensure every hook is documented in this file.
- Each entry should include purpose, usage, dependencies, and verification.
- Keep documentation up-to-date with code changes.

---
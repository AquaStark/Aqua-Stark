# AquaStark API Fixes Summary

## Issues Found and Fixed

### 1. Contract Method Routing Issues
**Problem**: The `useAquarium` hook was calling non-existent methods on the wrong contract namespaces.

**Root Cause**: Methods like `addFishToAquarium`, `addDecorationToAquarium`, `moveFishToAquarium`, and `moveDecorationToAquarium` were being called on `client.AquaStark` but they actually exist in the `client.Game` contract namespace.

**Fix Applied**: Updated method routing in `useAquarium.ts`:

```typescript
// Before (incorrect):
return await client.AquaStark.addFishToAquarium(account, fish, aquariumId);

// After (correct):
return await client.Game.addFishToAquarium(account, fish, aquariumId);
```

### 2. Non-existent Method: createAquariumId
**Problem**: `createAquariumId` method doesn't exist in any contract.

**Fix Applied**: 
- Removed the method call from the UI (demo.tsx)
- Updated the hook to throw a descriptive error
- Users should use `newAquarium` method instead, which creates a complete aquarium

### 3. Method Routing Table
Here's the corrected routing for all methods:

| Method | Original (Wrong) | Corrected |
|--------|------------------|-----------|
| `createAquariumId` | `client.AquaStark` | **Method doesn't exist** - use `newAquarium` |
| `getAquarium` | `client.AquaStark` ✓ | `client.AquaStark` ✓ |
| `newAquarium` | `client.AquaStark` ✓ | `client.AquaStark` ✓ |
| `addFishToAquarium` | `client.AquaStark` ❌ | `client.Game` ✓ |
| `addDecorationToAquarium` | `client.AquaStark` ❌ | `client.Game` ✓ |
| `getPlayerAquariums` | `client.AquaStark` ✓ | `client.AquaStark` ✓ |
| `getPlayerAquariumCount` | `client.AquaStark` ✓ | `client.AquaStark` ✓ |
| `moveFishToAquarium` | `client.AquaStark` ❌ | `client.Game` ✓ |
| `moveDecorationToAquarium` | `client.AquaStark` ❌ | `client.Game` ✓ |
| `getAquariumOwner` | `client.AquaStark` ✓ | `client.AquaStark` ✓ |

## Files Modified

### 1. `/client/src/hooks/dojo/useAquarium.ts`
- Updated method routing for Game contract methods
- Added error handling for non-existent `createAquariumId`
- Updated documentation with correct contract namespace information

### 2. `/client/src/pages/demo.tsx`
- Removed "Create Aquarium ID" button since the method doesn't exist
- Kept "New Aquarium" button as the primary way to create aquariums

## Expected Error Resolution

The original error **"TypeError: can't access property 'abi', contractInfos is undefined"** should now be resolved because:

1. **Contract methods now exist**: All method calls are routed to contracts that actually have those methods
2. **Proper namespace routing**: Methods are called on the correct contract namespaces (`Game` vs `AquaStark`)
3. **No undefined method calls**: Removed calls to non-existent methods

## Testing Instructions

### 1. Basic Connectivity Test
```typescript
// In your component or testing environment:
const { getAquarium } = useAquarium();

// Test a simple read operation first
const result = await getAquarium(1);
console.log('Aquarium data:', result);
```

### 2. Test Each Fixed Method
1. **New Aquarium** - Should work (was already correct)
2. **Get Aquarium** - Should work (was already correct) 
3. **Add Fish to Aquarium** - Should now work (fixed routing)
4. **Add Decoration to Aquarium** - Should now work (fixed routing)
5. **Move Fish to Aquarium** - Should now work (fixed routing)
6. **Move Decoration to Aquarium** - Should now work (fixed routing)

### 3. Expected Behavior Changes
- **createAquariumId button**: Removed from UI
- **Error messages**: Should be more descriptive for actual contract/network issues
- **Method calls**: Should reach the blockchain instead of failing with "abi" errors

### 4. Debugging Steps if Issues Persist

If you still encounter problems:

1. **Check network connection**:
   ```typescript
   console.log('Dojo config:', dojoConfig);
   console.log('Client object:', client);
   ```

2. **Verify contract availability**:
   ```typescript
   console.log('Available contracts:', Object.keys(client));
   console.log('Game methods:', Object.keys(client.Game));
   console.log('AquaStark methods:', Object.keys(client.AquaStark));
   ```

3. **Check wallet connection**:
   ```typescript
   console.log('Account:', account);
   console.log('Address:', address);
   console.log('Is connected:', isConnected);
   ```

## Alternative Contract Methods

If you need ID generation, you can use these existing methods:

### From AquaStark contract:
- `newAquarium(account, owner, maxCapacity, maxDecorations)` - Creates a full aquarium

### From Game contract:
- `newFish(account, aquariumId, species)` - Creates a fish directly

### From FishSystem contract:
- `newFish(account, owner, species)` - Alternative fish creation

## Notes

- The `setupWorld` function in `contracts.gen.ts` contains all available methods
- Contract methods are organized by namespace (AquaStark, Game, FishSystem, etc.)
- Always check the contract namespace before calling methods
- Read operations (get*) typically don't require account parameter, write operations do
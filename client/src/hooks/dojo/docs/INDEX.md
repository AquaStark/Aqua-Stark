# 📚 Índice de Documentación de Hooks - AquaStark

Documentación completa de todos los hooks de contratos del proyecto AquaStark.

## 📋 Tabla de Contenidos

1. [Hooks del Contrato AquaStark](#hooks-del-contrato-aquastark)
2. [Hooks del Contrato Trade](#hooks-del-contrato-trade)
3. [Hooks del Contrato Game](#hooks-del-contrato-game)
4. [Hooks de Sistemas Especializados](#hooks-de-sistemas-especializados)
5. [Resumen por Categoría](#resumen-por-categoría)
6. [Guía Rápida de Uso](#guía-rápida-de-uso)

---

## Hooks del Contrato AquaStark

### [useAquarium](./useAquarium.md)

**Contrato:** AquaStark + Game  
**Propósito:** Gestión completa de acuarios

**Métodos principales:**

- ✅ `getAquarium(id)` - Obtener datos de acuario
- ✅ `newAquarium(account, owner, maxCapacity, maxDecorations)` - Crear acuario
- ✅ `addFishToAquarium(account, fish, aquariumId)` - Agregar pez
- ✅ `addDecorationToAquarium(account, decoration, aquariumId)` - Agregar decoración
- ✅ `moveFishToAquarium(account, fishId, from, to)` - Mover pez
- ✅ `moveDecorationToAquarium(account, decorationId, from, to)` - Mover decoración
- ✅ `getPlayerAquariums(playerAddress)` - Obtener acuarios del jugador
- ✅ `getPlayerAquariumCount(playerAddress)` - Contar acuarios
- ⚠️ `createAquariumId()` - DEPRECADO

**Total de métodos:** 10 (9 activos, 1 deprecado)

---

### [usePlayer](./usePlayer.md)

**Contrato:** AquaStark  
**Propósito:** Gestión de jugadores y cuentas

**Métodos principales:**

- ✅ `registerPlayer(account, username)` - Registrar nuevo jugador
- ✅ `getPlayer(address)` - Obtener datos del jugador
- ✅ `getUsernameFromAddress(address)` - Obtener nombre de usuario
- ✅ `createNewPlayerId(account)` - Crear ID de jugador
- ✅ `isVerified(playerAddress)` - Verificar estado del jugador

**Total de métodos:** 5 activos

---

### [useFish](./useFish.md)

**Contrato:** AquaStark  
**Propósito:** Gestión completa de peces (CRUD, genealogía, marketplace)

**Métodos principales:**

**Creación y Gestión:**

- ✅ `createFishId(account)` - Crear ID de pez
- ✅ `getFish(id)` - Obtener datos del pez
- ✅ `newFish(account, aquariumId, species)` - Crear nuevo pez
- ✅ `getPlayerFishes(playerAddress)` - Obtener peces del jugador
- ✅ `getPlayerFishCount(playerAddress)` - Contar peces

**Reproducción:**

- ✅ `breedFishes(account, parent1Id, parent2Id)` - Reproducir peces

**Genealogía:**

- ✅ `getFishOwner(fishId)` - Obtener propietario
- ✅ `getFishParents(fishId)` - Obtener padres
- ✅ `getFishOffspring(fishId)` - Obtener hijos
- ✅ `getFishAncestor(fishId, generation)` - Obtener ancestro
- ✅ `getFishFamilyTree(fishId)` - Obtener árbol genealógico

**Marketplace:**

- ✅ `listFish(account, fishId, price)` - Listar para venta
- ✅ `purchaseFish(account, listingId)` - Comprar pez

**Total de métodos:** 13 activos

---

### [useDecoration](./useDecoration.md)

**Contrato:** AquaStark  
**Propósito:** Gestión de decoraciones para acuarios

**Métodos principales:**

- ✅ `createDecorationId(account)` - Crear ID de decoración
- ✅ `getDecoration(id)` - Obtener datos de decoración
- ✅ `newDecoration(account, aquariumId, name, description, price, rarity)` - Crear decoración
- ✅ `getPlayerDecorations(playerAddress)` - Obtener decoraciones del jugador
- ✅ `getPlayerDecorationCount(playerAddress)` - Contar decoraciones
- ✅ `getDecorationOwner(decorationId)` - Obtener propietario

**Total de métodos:** 6 activos

**Niveles de rareza:** 0=Común, 1=Poco Común, 2=Raro, 3=Épico, 4=Legendario, 5=Mítico

---

## Hooks del Contrato Trade

### [useTrade](./useTrade.md)

**Contrato:** Trade  
**Propósito:** Sistema de intercambio de peces entre jugadores  
**⚠️ Nota:** Usa snake_case. Ver useTradeEnhanced para camelCase

**Métodos principales:**

**Gestión de Ofertas:**

- ✅ `createTradeOffer(...)` - Crear oferta de intercambio
- ✅ `acceptTradeOffer(account, offerId, offeredFishId)` - Aceptar oferta
- ✅ `cancelTradeOffer(account, offerId)` - Cancelar oferta

**Consultas:**

- ✅ `getTradeOffer(offerId)` - Obtener detalles de oferta
- ✅ `getActiveTradeOffers(creator)` - Ofertas activas de un usuario
- ✅ `getAllActiveOffers()` - Todas las ofertas activas
- ✅ `getOffersForFish(fishId)` - Ofertas relacionadas a un pez

**Estado de Bloqueo:**

- ✅ `getFishLockStatus(fishId)` - Estado de bloqueo del pez
- ✅ `isFishLocked(fishId)` - Verificar si está bloqueado

**Mantenimiento:**

- ✅ `cleanupExpiredOffers(account)` - Limpiar ofertas expiradas

**Estadísticas:**

- ✅ `getTotalTradesCount()` - Contador total de intercambios
- ✅ `getUserTradeCount(user)` - Intercambios de un usuario

**Total de métodos:** 12 activos

---

### useTradeEnhanced

**Contrato:** Trade  
**Propósito:** Igual que useTrade pero con camelCase  
**⚠️ Recomendación:** Usar esta versión para consistencia

**Mismos métodos que useTrade pero con:**

- `createTradeOffer` en lugar de `create_trade_offer`
- `acceptTradeOffer` en lugar de `accept_trade_offer`
- etc.

---

## Hooks del Contrato Game

### [useGameEnhanced](./useGameEnhanced.md)

**Contrato:** Game  
**Propósito:** Funciones comprehensivas del juego (consolidación de múltiples entidades)

**Métodos por categoría:**

**Acuarios (4 métodos):**

- ✅ `getAquarium(id)`
- ✅ `getAquariumOwner(id)`
- ✅ `getPlayerAquariums(player)`
- ✅ `getPlayerAquariumCount(player)`

**Peces (4 métodos):**

- ✅ `getFish(id)`
- ✅ `getFishOwner(id)`
- ✅ `getPlayerFishes(player)`
- ✅ `getPlayerFishCount(player)`

**Decoraciones (4 métodos):**

- ✅ `getDecoration(id)`
- ✅ `getDecorationOwner(id)`
- ✅ `getPlayerDecorations(player)`
- ✅ `getPlayerDecorationCount(player)`

**Jugadores (2 métodos):**

- ✅ `getPlayer(address)`
- ✅ `isVerified(player)`

**Listings (2 métodos):**

- ✅ `getListing(listingId)`
- ✅ `listFish(fishId, price)`

**Genealogía (4 métodos):**

- ✅ `getParents(fishId)`
- ✅ `getFishAncestor(fishId, generation)`
- ✅ `getFishFamilyTree(fishId)`
- ✅ `getFishOffspring(fishId)`

**Total de métodos:** 20 activos

---

## Hooks de Sistemas Especializados

### [useAquaAuction](./useAquaAuction.md)

**Contrato:** AquaAuction  
**Propósito:** Sistema de subastas de peces

**Métodos principales:**

- ✅ `startAuction(account, fishId, durationSecs, reservePrice)` - Iniciar subasta
- ✅ `placeBid(account, auctionId, amount)` - Realizar puja
- ✅ `endAuction(account, auctionId)` - Finalizar subasta
- ✅ `getAuctionById(auctionId)` - Obtener detalles de subasta
- ✅ `getActiveAuctions()` - Obtener subastas activas

**Total de métodos:** 5 activos

---

### [useShopCatalog](./useShopCatalog.md)

**Contrato:** ShopCatalog  
**Propósito:** Gestión del catálogo de la tienda  
**⚠️ Nota:** Existen 2 versiones (snake_case y camelCase)

**Métodos principales:**

- ✅ `addNewItem(account, price, stock, description)` - Agregar item
- ✅ `updateItem(account, id, price, stock, description)` - Actualizar item
- ✅ `getItem(id)` - Obtener item
- ✅ `getAllItems()` - Obtener todos los items

**Total de métodos:** 4 activos

---

### [useSessionEnhanced](./useSessionEnhanced.md)

**Contrato:** session  
**Propósito:** Gestión de sesiones de usuario

**Métodos principales:**

**Gestión:**

- ✅ `createSessionKey(account, duration, maxTransactions, sessionType)` - Crear sesión
- ✅ `renewSession(account, sessionId, newDuration, newMaxTx)` - Renovar sesión
- ✅ `revokeSession(account, sessionId)` - Revocar sesión
- ✅ `validateSession(account, sessionId)` - Validar sesión

**Consultas:**

- ✅ `getSessionInfo(sessionId)` - Información de sesión
- ✅ `calculateRemainingTransactions(sessionId)` - Transacciones restantes
- ✅ `calculateSessionTimeRemaining(sessionId)` - Tiempo restante
- ✅ `checkSessionNeedsRenewal(sessionId)` - Verificar necesidad de renovación

**Total de métodos:** 8 activos

---

### useDailyChallenge

**Contrato:** daily_challenge  
**Propósito:** Sistema de desafíos diarios

**Métodos principales:**

- ✅ `createChallenge(account, day, seed)` - Crear desafío
- ✅ `joinChallenge(account, challengeId)` - Unirse a desafío
- ✅ `completeChallenge(account, challengeId)` - Completar desafío
- ✅ `claimReward(account, challengeId)` - Reclamar recompensa

**Total de métodos:** 4 activos

---

## Resumen por Categoría

### Por Contrato

| Contrato        | Hooks  | Métodos Totales | Documentación                                                                                                              |
| --------------- | ------ | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| AquaStark       | 4      | 34              | [useAquarium](./useAquarium.md), [usePlayer](./usePlayer.md), [useFish](./useFish.md), [useDecoration](./useDecoration.md) |
| Trade           | 2      | 12              | [useTrade](./useTrade.md)                                                                                                  |
| Game            | 1      | 20              | [useGameEnhanced](./useGameEnhanced.md)                                                                                    |
| AquaAuction     | 1      | 5               | [useAquaAuction](./useAquaAuction.md)                                                                                      |
| ShopCatalog     | 1      | 4               | [useShopCatalog](./useShopCatalog.md)                                                                                      |
| session         | 1      | 8               | [useSessionEnhanced](./useSessionEnhanced.md)                                                                              |
| daily_challenge | 1      | 4               | -                                                                                                                          |
| **TOTAL**       | **11** | **87**          | **8 documentos**                                                                                                           |

### Por Tipo de Operación

| Tipo      | Cantidad | Descripción                      |
| --------- | -------- | -------------------------------- |
| Query     | 65       | Consultas de solo lectura        |
| Write     | 22       | Operaciones que modifican estado |
| Deprecado | 1        | Métodos obsoletos                |

### Por Funcionalidad

| Funcionalidad           | Hooks Relacionados             | Métodos |
| ----------------------- | ------------------------------ | ------- |
| Gestión de Acuarios     | useAquarium, useGameEnhanced   | 14      |
| Gestión de Peces        | useFish, useGameEnhanced       | 17      |
| Gestión de Decoraciones | useDecoration, useGameEnhanced | 10      |
| Gestión de Jugadores    | usePlayer, useGameEnhanced     | 7       |
| Trading & Marketplace   | useTrade, useFish              | 13      |
| Subastas                | useAquaAuction                 | 5       |
| Tienda                  | useShopCatalog                 | 4       |
| Sesiones                | useSessionEnhanced             | 8       |
| Genealogía              | useFish, useGameEnhanced       | 9       |

---

## Guía Rápida de Uso

### Setup Inicial

```typescript
import {
  useAquarium,
  usePlayer,
  useFish,
  useDecoration,
  useTrade,
  useAquaAuction,
  useShopCatalog,
  useSessionEnhanced,
  useGameEnhanced,
} from '@/hooks/dojo';

function MyComponent() {
  const account = useAccount();

  // Importar los hooks que necesites
  const { registerPlayer } = usePlayer();
  const { newAquarium } = useAquarium();
  const { newFish } = useFish();

  // ... tu lógica
}
```

### Flujo Típico de Nuevo Usuario

```typescript
// 1. Registrar jugador
await registerPlayer(account, 'MiUsername');

// 2. Crear primer acuario
const aquariumId = await newAquarium(account, account.address, 10, 5);

// 3. Crear primer pez
const fish = await newFish(account, aquariumId, species);

// 4. Agregar decoración
const decoration = await newDecoration(
  account,
  aquariumId,
  name,
  desc,
  price,
  rarity
);
```

### Dashboard de Estadísticas

```typescript
const { getPlayerAquariumCount, getPlayerFishCount, getPlayerDecorationCount } =
  useGameEnhanced();

const stats = await Promise.all([
  getPlayerAquariumCount(address),
  getPlayerFishCount(address),
  getPlayerDecorationCount(address),
]);
```

### Sistema de Trading

```typescript
const { createTradeOffer, getAllActiveOffers, acceptTradeOffer } = useTrade();

// Crear oferta
await createTradeOffer(
  account,
  myFishId,
  criteria,
  null,
  species,
  null,
  [],
  24
);

// Ver ofertas disponibles
const offers = await getAllActiveOffers();

// Aceptar oferta
await acceptTradeOffer(account, offerId, myFishId);
```

### Sistema de Subastas

```typescript
const { startAuction, placeBid, getActiveAuctions } = useAquaAuction();

// Iniciar subasta
await startAuction(account, fishId, 86400, 100);

// Ver subastas activas
const auctions = await getActiveAuctions();

// Pujar
await placeBid(account, auctionId, 150);
```

---

## 🔧 Problemas Conocidos y Recomendaciones

### ⚠️ Duplicaciones

**Trade:** Usar `useTradeEnhanced` (camelCase) en lugar de `useTrade` (snake_case)

**Shop:** Usar versión camelCase de `useShopCatalog` de `useAdditionalContracts.ts`

### ⚠️ Métodos Deprecados

**useAquarium:**

- ❌ `createAquariumId()` - No usar, reemplazar por `newAquarium()`

### ⚠️ Sobrelapamiento de Funcionalidad

Los siguientes métodos existen en múltiples hooks:

- `getFish()` - en useFish y useGameEnhanced
- `getAquarium()` - en useAquarium y useGameEnhanced
- `getDecoration()` - en useDecoration y useGameEnhanced

**Recomendación:** Usar hooks específicos para operaciones individuales y `useGameEnhanced` para dashboards o vistas agregadas.

---

## 📁 Estructura de Archivos

```
/client/src/hooks/dojo/
├── docs/
│   ├── INDEX.md (este archivo)
│   ├── useAquarium.md
│   ├── usePlayer.md
│   ├── useFish.md
│   ├── useDecoration.md
│   ├── useTrade.md
│   ├── useAquaAuction.md
│   ├── useShopCatalog.md
│   ├── useSessionEnhanced.md
│   └── useGameEnhanced.md
├── index.ts
├── useAquarium.ts
├── usePlayer.ts
├── useFish.ts
├── useDecoration.ts
├── useTrade.ts
├── useTradeEnhanced.ts
├── useAquaAuction.ts
├── useShop.ts
├── useSessionEnhanced.ts
├── useAquaStarkEnhanced.ts
├── useFishSystemEnhanced.ts
└── useAdditionalContracts.ts
```

---

## 🚀 Próximos Pasos

1. **Consolidar hooks duplicados:** Eliminar versiones snake_case
2. **Unificar naming:** Estandarizar todo a camelCase
3. **Eliminar código legacy:** Remover `/dojoclient/index.tsx`
4. **Documentar contratos faltantes:** FishSystemEnhanced, AquaStarkEnhanced
5. **Crear tests unitarios:** Para cada hook documentado

---

## 📖 Recursos Adicionales

- [Documentación de Dojo SDK](https://dojoengine.org)
- [Documentación de Starknet](https://starknet.io)
- [README Principal del Proyecto](../../../../README.md)

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0  
**Mantenedor:** AquaStark Team

# Documentación de Hooks Dojo - AquaStark

## Índice

- [useAquaStarkEnhanced](#useaquastarkenhanced)
- [useAquarium](#useaquarium)
- [usePlayer](#useplayer)
- [useFish](#usefish)
- [useFishSystemEnhanced](#usefishsystemenhanced)
- [useAdditionalContracts](#useadditionalcontracts)
- [useTrade](#usetrade)
- [useTradeEnhanced](#usetradeenhanced)
- [useAquaAuction](#useaquaauction)
- [useShop](#useshop)
- [useDecoration](#usedecoration)
- [useSession](#usesession)
- [useSessionEnhanced](#usesessionenhanced)
- [useTransaction](#usetransaction)
- [useTransactionHistory](#usetransactionhistory)
- [useExperience](#useexperience)

---

## useAquaStarkEnhanced

Hook principal para interacciones con el contrato AquaStark.

### Métodos

#### Gestión de Transacciones

**confirmTransaction**
- **Parámetros:** `account`, `transactionId`, `confirmationHash`
- **Descripción:** Confirma una transacción pendiente
- **Uso:** `await confirmTransaction(account, txId, hash)`

**initiateTransaction**
- **Parámetros:** `account`, `player`, `eventTypeId`, `payload`
- **Descripción:** Inicia una nueva transacción
- **Uso:** `await initiateTransaction(account, "0xPlayer", 1, [data])`

**processTransaction**
- **Parámetros:** `account`, `transactionId`
- **Descripción:** Procesa una transacción pendiente
- **Uso:** `await processTransaction(account, txId)`

**getTransactionStatus**
- **Parámetros:** `transactionId`
- **Descripción:** Obtiene el estado de una transacción
- **Uso:** `const status = await getTransactionStatus(txId)`

**isTransactionConfirmed**
- **Parámetros:** `transactionId`
- **Descripción:** Verifica si una transacción está confirmada
- **Uso:** `const confirmed = await isTransactionConfirmed(txId)`

**getTransactionCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene el número total de transacciones
- **Uso:** `const count = await getTransactionCount()`

**getTransactionHistory**
- **Parámetros:** `player`, `eventTypeId`, `start`, `limit`, `startTimestamp`, `endTimestamp`
- **Descripción:** Obtiene historial de transacciones con filtros
- **Uso:** `const history = await getTransactionHistory(player, null, 0, 10, null, null)`

#### Gestión de Eventos

**getAllEventTypes**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todos los tipos de eventos
- **Uso:** `const types = await getAllEventTypes()`

**getEventTypesCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene el número de tipos de eventos
- **Uso:** `const count = await getEventTypesCount()`

**getEventTypeDetails**
- **Parámetros:** `eventTypeId`
- **Descripción:** Obtiene detalles de un tipo de evento
- **Uso:** `const details = await getEventTypeDetails(typeId)`

**registerEventType**
- **Parámetros:** `account`, `eventName`
- **Descripción:** Registra un nuevo tipo de evento
- **Uso:** `await registerEventType(account, "FishBred")`

**logEvent**
- **Parámetros:** `account`, `eventTypeId`, `player`, `payload`
- **Descripción:** Registra un evento
- **Uso:** `await logEvent(account, typeId, "0xPlayer", [data])`

#### Gestión de Jugadores

**register**
- **Parámetros:** `account`, `username`
- **Descripción:** Registra un nuevo jugador
- **Uso:** `await register(account, username)`

**getPlayer**
- **Parámetros:** `address`
- **Descripción:** Obtiene datos de un jugador
- **Uso:** `const player = await getPlayer("0xAddress")`

**isVerified**
- **Parámetros:** `player`
- **Descripción:** Verifica si un jugador está verificado
- **Uso:** `const verified = await isVerified("0xPlayer")`

**getUsernameFromAddress**
- **Parámetros:** `address`
- **Descripción:** Obtiene username desde dirección
- **Uso:** `const username = await getUsernameFromAddress("0xAddress")`

#### Gestión de Acuarios

**getAquarium**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de un acuario
- **Uso:** `const aquarium = await getAquarium(1)`

**newAquarium**
- **Parámetros:** `account`, `owner`, `maxCapacity`, `maxDecorations`
- **Descripción:** Crea un nuevo acuario
- **Uso:** `await newAquarium(account, "0xOwner", 10, 5)`

**getAquariumOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene el propietario de un acuario
- **Uso:** `const owner = await getAquariumOwner(1)`

**getPlayerAquariums**
- **Parámetros:** `player`
- **Descripción:** Obtiene acuarios de un jugador
- **Uso:** `const aquariums = await getPlayerAquariums("0xPlayer")`

**getPlayerAquariumCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de acuarios de un jugador
- **Uso:** `const count = await getPlayerAquariumCount("0xPlayer")`

#### Gestión de Peces

**newFish**
- **Parámetros:** `account`, `aquariumId`, `species`
- **Descripción:** Crea un nuevo pez
- **Uso:** `await newFish(account, aquariumId, species)`

**getFishOwnerForAuction**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene propietario de pez para subasta
- **Uso:** `const owner = await getFishOwnerForAuction(fishId)`

#### Gestión de Decoraciones

**newDecoration**
- **Parámetros:** `account`, `aquariumId`, `name`, `description`, `price`, `rarity`
- **Descripción:** Crea una nueva decoración
- **Uso:** `await newDecoration(account, aquariumId, name, desc, price, rarity)`

**getDecoration**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de una decoración
- **Uso:** `const decoration = await getDecoration(1)`

**getDecorationOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene propietario de una decoración
- **Uso:** `const owner = await getDecorationOwner(1)`

**getPlayerDecorations**
- **Parámetros:** `player`
- **Descripción:** Obtiene decoraciones de un jugador
- **Uso:** `const decorations = await getPlayerDecorations("0xPlayer")`

**getPlayerDecorationCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de decoraciones de un jugador
- **Uso:** `const count = await getPlayerDecorationCount("0xPlayer")`

---

## useAquarium

Hook para gestión de acuarios.

### Métodos

**createAquariumId**
- **Parámetros:** `account`
- **Descripción:** ⚠️ MÉTODO DEPRECADO - Usar newAquarium
- **Uso:** No usar

**getAquarium**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de un acuario
- **Uso:** `const aquarium = await getAquarium(1)`

**newAquarium**
- **Parámetros:** `account`, `owner`, `maxCapacity`, `maxDecorations`
- **Descripción:** Crea un nuevo acuario
- **Uso:** `await newAquarium(account, "0xOwner", 10, 5)`

**addFishToAquarium**
- **Parámetros:** `account`, `fish`, `aquariumId`
- **Descripción:** Añade pez a acuario
- **Uso:** `await addFishToAquarium(account, fishModel, 1)`

**addDecorationToAquarium**
- **Parámetros:** `account`, `decoration`, `aquariumId`
- **Descripción:** Añade decoración a acuario
- **Uso:** `await addDecorationToAquarium(account, decorationModel, 1)`

**getPlayerAquariums**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene acuarios de un jugador
- **Uso:** `const aquariums = await getPlayerAquariums("0xPlayer")`

**getPlayerAquariumCount**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene número de acuarios de un jugador
- **Uso:** `const count = await getPlayerAquariumCount("0xPlayer")`

**moveFishToAquarium**
- **Parámetros:** `account`, `fishId`, `fromAquariumId`, `toAquariumId`
- **Descripción:** Mueve pez entre acuarios
- **Uso:** `await moveFishToAquarium(account, 1, 2, 3)`

**moveDecorationToAquarium**
- **Parámetros:** `account`, `decorationId`, `fromAquariumId`, `toAquariumId`
- **Descripción:** Mueve decoración entre acuarios
- **Uso:** `await moveDecorationToAquarium(account, 1, 2, 3)`

**getAquariumOwner**
- **Parámetros:** `aquariumId`
- **Descripción:** Obtiene propietario de un acuario
- **Uso:** `const owner = await getAquariumOwner(1)`

---

## usePlayer

Hook para gestión de jugadores.

### Métodos

**registerPlayer**
- **Parámetros:** `account`, `username`
- **Descripción:** Registra un nuevo jugador
- **Uso:** `await registerPlayer(account, "MyUsername")`

**getPlayer**
- **Parámetros:** `address`
- **Descripción:** Obtiene datos de un jugador
- **Uso:** `const player = await getPlayer("0xAddress")`

**getUsernameFromAddress**
- **Parámetros:** `address`
- **Descripción:** Obtiene username desde dirección
- **Uso:** `const username = await getUsernameFromAddress("0xAddress")`

**createNewPlayerId**
- **Parámetros:** `account`
- **Descripción:** Crea nuevo ID de jugador
- **Uso:** `const playerId = await createNewPlayerId(account)`

**isVerified**
- **Parámetros:** `playerAddress`
- **Descripción:** Verifica si un jugador está verificado
- **Uso:** `const verified = await isVerified("0xPlayer")`

---

## useFish

Hook para gestión de peces.

### Métodos

**createFishId**
- **Parámetros:** `account`
- **Descripción:** Crea nuevo ID de pez
- **Uso:** `const fishId = await createFishId(account)`

**getFish**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de un pez
- **Uso:** `const fish = await getFish(1)`

**newFish**
- **Parámetros:** `account`, `aquariumId`, `species`
- **Descripción:** ⚠️ MÉTODO INCORRECTO - Usar useFishSystemEnhanced
- **Uso:** No usar

**getPlayerFishes**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene peces de un jugador
- **Uso:** `const fishes = await getPlayerFishes("0xPlayer")`

**getPlayerFishCount**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene número de peces de un jugador
- **Uso:** `const count = await getPlayerFishCount("0xPlayer")`

**breedFishes**
- **Parámetros:** `account`, `parent1Id`, `parent2Id`
- **Descripción:** Cruza dos peces
- **Uso:** `await breedFishes(account, 1, 2)`

**getFishOwner**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene propietario de un pez
- **Uso:** `const owner = await getFishOwner(1)`

**getFishParents**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene padres de un pez
- **Uso:** `const parents = await getFishParents(1)`

**getFishOffspring**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene descendencia de un pez
- **Uso:** `const offspring = await getFishOffspring(1)`

**getFishAncestor**
- **Parámetros:** `fishId`, `generation`
- **Descripción:** Obtiene ancestro de un pez
- **Uso:** `const ancestor = await getFishAncestor(1, 2)`

**getFishFamilyTree**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene árbol genealógico de un pez
- **Uso:** `const tree = await getFishFamilyTree(1)`

**listFish**
- **Parámetros:** `account`, `fishId`, `price`
- **Descripción:** Lista pez para venta
- **Uso:** `await listFish(account, 1, 100)`

**purchaseFish**
- **Parámetros:** `account`, `listingId`
- **Descripción:** Compra pez listado
- **Uso:** `await purchaseFish(account, 1)`

---

## useFishSystemEnhanced

Hook mejorado para gestión de peces.

### Métodos

#### Creación y Gestión

**newFish**
- **Parámetros:** `account`, `aquariumId`, `species`
- **Descripción:** Crea un nuevo pez
- **Uso:** `await newFish(account, aquariumId, species)`

**addFishToAquarium**
- **Parámetros:** `account`, `fish`, `aquariumId`
- **Descripción:** Añade pez a acuario
- **Uso:** `await addFishToAquarium(account, fishModel, 1)`

**moveFishToAquarium**
- **Parámetros:** `account`, `fishId`, `from`, `to`
- **Descripción:** Mueve pez entre acuarios
- **Uso:** `await moveFishToAquarium(account, 1, 2, 3)`

#### Cría

**breedFishes**
- **Parámetros:** `account`, `parent1Id`, `parent2Id`
- **Descripción:** Cruza dos peces
- **Uso:** `await breedFishes(account, 1, 2)`

#### Consultas

**getFish**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de un pez
- **Uso:** `const fish = await getFish(1)`

**getFishOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene propietario de un pez
- **Uso:** `const owner = await getFishOwner(1)`

**getPlayerFishes**
- **Parámetros:** `player`
- **Descripción:** Obtiene peces de un jugador
- **Uso:** `const fishes = await getPlayerFishes("0xPlayer")`

**getPlayerFishCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de peces de un jugador
- **Uso:** `const count = await getPlayerFishCount("0xPlayer")`

#### Genealogía

**getParents**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene padres de un pez
- **Uso:** `const parents = await getParents(1)`

**getFishOffspring**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene descendencia de un pez
- **Uso:** `const offspring = await getFishOffspring(1)`

**getFishAncestor**
- **Parámetros:** `fishId`, `generation`
- **Descripción:** Obtiene ancestro de un pez
- **Uso:** `const ancestor = await getFishAncestor(1, 2)`

**getFishFamilyTree**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene árbol genealógico de un pez
- **Uso:** `const tree = await getFishFamilyTree(1)`

#### Comercio

**listFish**
- **Parámetros:** `fishId`, `price`
- **Descripción:** Lista pez para venta
- **Uso:** `await listFish(1, 100)`

**purchaseFish**
- **Parámetros:** `account`, `listingId`
- **Descripción:** Compra pez listado
- **Uso:** `await purchaseFish(account, 1)`

---

## useAdditionalContracts

Hook que contiene múltiples contratos adicionales.

### useShopCatalog

**addNewItem**
- **Parámetros:** `price`, `stock`, `description`
- **Descripción:** Añade nuevo artículo a la tienda
- **Uso:** `await addNewItem(100, 50, "New item")`

**getAllItems**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todos los artículos
- **Uso:** `const items = await getAllItems()`

**getItem**
- **Parámetros:** `id`
- **Descripción:** Obtiene artículo por ID
- **Uso:** `const item = await getItem(1)`

**updateItem**
- **Parámetros:** `id`, `price`, `stock`, `description`
- **Descripción:** Actualiza artículo existente
- **Uso:** `await updateItem(1, 150, 40, "Updated item")`

### useDailyChallenge

**createChallenge**
- **Parámetros:** `account`, `day`, `seed`
- **Descripción:** Crea nuevo desafío diario
- **Uso:** `await createChallenge(account, 1, 123)`

**joinChallenge**
- **Parámetros:** `account`, `challengeId`
- **Descripción:** Se une a un desafío
- **Uso:** `await joinChallenge(account, 1)`

**completeChallenge**
- **Parámetros:** `account`, `challengeId`
- **Descripción:** Completa un desafío
- **Uso:** `await completeChallenge(account, 1)`

**claimReward**
- **Parámetros:** `account`, `challengeId`
- **Descripción:** Reclama recompensa de desafío
- **Uso:** `await claimReward(account, 1)`

### useGameEnhanced

**getAquarium**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de acuario
- **Uso:** `const aquarium = await getAquarium(1)`

**getAquariumOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene propietario de acuario
- **Uso:** `const owner = await getAquariumOwner(1)`

**getPlayerAquariums**
- **Parámetros:** `player`
- **Descripción:** Obtiene acuarios de jugador
- **Uso:** `const aquariums = await getPlayerAquariums("0xPlayer")`

**getPlayerAquariumCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de acuarios de jugador
- **Uso:** `const count = await getPlayerAquariumCount("0xPlayer")`

**getFish**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de pez
- **Uso:** `const fish = await getFish(1)`

**getFishOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene propietario de pez
- **Uso:** `const owner = await getFishOwner(1)`

**getPlayerFishes**
- **Parámetros:** `player`
- **Descripción:** Obtiene peces de jugador
- **Uso:** `const fishes = await getPlayerFishes("0xPlayer")`

**getPlayerFishCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de peces de jugador
- **Uso:** `const count = await getPlayerFishCount("0xPlayer")`

**getDecoration**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de decoración
- **Uso:** `const decoration = await getDecoration(1)`

**getDecorationOwner**
- **Parámetros:** `id`
- **Descripción:** Obtiene propietario de decoración
- **Uso:** `const owner = await getDecorationOwner(1)`

**getPlayerDecorations**
- **Parámetros:** `player`
- **Descripción:** Obtiene decoraciones de jugador
- **Uso:** `const decorations = await getPlayerDecorations("0xPlayer")`

**getPlayerDecorationCount**
- **Parámetros:** `player`
- **Descripción:** Obtiene número de decoraciones de jugador
- **Uso:** `const count = await getPlayerDecorationCount("0xPlayer")`

**getPlayer**
- **Parámetros:** `address`
- **Descripción:** Obtiene datos de jugador
- **Uso:** `const player = await getPlayer("0xAddress")`

**isVerified**
- **Parámetros:** `player`
- **Descripción:** Verifica si jugador está verificado
- **Uso:** `const verified = await isVerified("0xPlayer")`

**getListing**
- **Parámetros:** `listingId`
- **Descripción:** Obtiene datos de listado
- **Uso:** `const listing = await getListing(1)`

**listFish**
- **Parámetros:** `fishId`, `price`
- **Descripción:** Lista pez para venta
- **Uso:** `await listFish(1, 100)`

**getParents**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene padres de pez
- **Uso:** `const parents = await getParents(1)`

**getFishAncestor**
- **Parámetros:** `fishId`, `generation`
- **Descripción:** Obtiene ancestro de pez
- **Uso:** `const ancestor = await getFishAncestor(1, 2)`

**getFishFamilyTree**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene árbol genealógico de pez
- **Uso:** `const tree = await getFishFamilyTree(1)`

**getFishOffspring**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene descendencia de pez
- **Uso:** `const offspring = await getFishOffspring(1)`

**newFish**
- **Parámetros:** `account`, `aquariumId`, `species`
- **Descripción:** Crea nuevo pez
- **Uso:** `await newFish(account, aquariumId, species)`

---

## useTrade

Hook para gestión de intercambios.

### Métodos

**createTradeOffer**
- **Parámetros:** `account`, `offeredFishId`, `criteria`, `requestedFishId`, `requestedSpecies`, `requestedGeneration`, `requestedTraits`, `durationHours`
- **Descripción:** Crea oferta de intercambio
- **Uso:** `await createTradeOffer(account, 1, criteria, null, 2, null, [], 24)`

**acceptTradeOffer**
- **Parámetros:** `account`, `offerId`, `offeredFishId`
- **Descripción:** Acepta oferta de intercambio
- **Uso:** `await acceptTradeOffer(account, 1, 1)`

**cancelTradeOffer**
- **Parámetros:** `account`, `offerId`
- **Descripción:** Cancela oferta de intercambio
- **Uso:** `await cancelTradeOffer(account, 1)`

**getTradeOffer**
- **Parámetros:** `offerId`
- **Descripción:** Obtiene datos de oferta
- **Uso:** `const offer = await getTradeOffer(1)`

**getActiveTradeOffers**
- **Parámetros:** `creator`
- **Descripción:** Obtiene ofertas activas de creador
- **Uso:** `const offers = await getActiveTradeOffers("0xCreator")`

**getAllActiveOffers**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todas las ofertas activas
- **Uso:** `const offers = await getAllActiveOffers()`

**getOffersForFish**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene ofertas para un pez
- **Uso:** `const offers = await getOffersForFish(1)`

**getFishLockStatus**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene estado de bloqueo de pez
- **Uso:** `const status = await getFishLockStatus(1)`

**isFishLocked**
- **Parámetros:** `fishId`
- **Descripción:** Verifica si pez está bloqueado
- **Uso:** `const locked = await isFishLocked(1)`

**cleanupExpiredOffers**
- **Parámetros:** `account`
- **Descripción:** Limpia ofertas expiradas
- **Uso:** `await cleanupExpiredOffers(account)`

**getTotalTradesCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene número total de intercambios
- **Uso:** `const count = await getTotalTradesCount()`

**getUserTradeCount**
- **Parámetros:** `user`
- **Descripción:** Obtiene número de intercambios de usuario
- **Uso:** `const count = await getUserTradeCount("0xUser")`

---

## useTradeEnhanced

Hook mejorado para gestión de intercambios.

### Métodos

#### Gestión de Ofertas

**createTradeOffer**
- **Parámetros:** `account`, `offeredFishId`, `criteria`, `requestedFishId`, `requestedSpecies`, `requestedGeneration`, `requestedTraits`, `durationHours`
- **Descripción:** Crea oferta de intercambio
- **Uso:** `await createTradeOffer(account, 1, criteria, null, 2, null, [], 24)`

**acceptTradeOffer**
- **Parámetros:** `account`, `offerId`, `offeredFishId`
- **Descripción:** Acepta oferta de intercambio
- **Uso:** `await acceptTradeOffer(account, 1, 1)`

**cancelTradeOffer**
- **Parámetros:** `account`, `offerId`
- **Descripción:** Cancela oferta de intercambio
- **Uso:** `await cancelTradeOffer(account, 1)`

**cleanupExpiredOffers**
- **Parámetros:** `account`
- **Descripción:** Limpia ofertas expiradas
- **Uso:** `await cleanupExpiredOffers(account)`

#### Consultas

**getTradeOffer**
- **Parámetros:** `offerId`
- **Descripción:** Obtiene datos de oferta
- **Uso:** `const offer = await getTradeOffer(1)`

**getActiveTradeOffers**
- **Parámetros:** `creator`
- **Descripción:** Obtiene ofertas activas de creador
- **Uso:** `const offers = await getActiveTradeOffers("0xCreator")`

**getAllActiveOffers**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todas las ofertas activas
- **Uso:** `const offers = await getAllActiveOffers()`

**getOffersForFish**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene ofertas para un pez
- **Uso:** `const offers = await getOffersForFish(1)`

#### Estado de Bloqueo

**isFishLocked**
- **Parámetros:** `fishId`
- **Descripción:** Verifica si pez está bloqueado
- **Uso:** `const locked = await isFishLocked(1)`

**getFishLockStatus**
- **Parámetros:** `fishId`
- **Descripción:** Obtiene estado de bloqueo de pez
- **Uso:** `const status = await getFishLockStatus(1)`

#### Estadísticas

**getTotalTradesCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene número total de intercambios
- **Uso:** `const count = await getTotalTradesCount()`

**getUserTradeCount**
- **Parámetros:** `user`
- **Descripción:** Obtiene número de intercambios de usuario
- **Uso:** `const count = await getUserTradeCount("0xUser")`

---

## useAquaAuction

Hook para gestión de subastas.

### Métodos

**endAuction**
- **Parámetros:** `account`, `auctionId`
- **Descripción:** Termina una subasta
- **Uso:** `await endAuction(account, 1)`

**getActiveAuctions**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene subastas activas
- **Uso:** `const auctions = await getActiveAuctions()`

**getAuctionById**
- **Parámetros:** `auctionId`
- **Descripción:** Obtiene datos de subasta por ID
- **Uso:** `const auction = await getAuctionById(1)`

**placeBid**
- **Parámetros:** `account`, `auctionId`, `amount`
- **Descripción:** Hace una puja
- **Uso:** `await placeBid(account, 1, 100)`

**startAuction**
- **Parámetros:** `account`, `fishId`, `durationSecs`, `reservePrice`
- **Descripción:** Inicia nueva subasta
- **Uso:** `await startAuction(account, 1, 3600, 50)`

---

## useShop

Hook para gestión de tienda.

### Métodos

**addNewItem**
- **Parámetros:** `account`, `price`, `stock`, `description`
- **Descripción:** Añade nuevo artículo
- **Uso:** `await addNewItem(account, 100, 50, "New item")`

**updateItem**
- **Parámetros:** `account`, `id`, `price`, `stock`, `description`
- **Descripción:** Actualiza artículo existente
- **Uso:** `await updateItem(account, 1, 150, 40, "Updated item")`

**getItem**
- **Parámetros:** `id`
- **Descripción:** Obtiene artículo por ID
- **Uso:** `const item = await getItem(1)`

**getAllItems**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todos los artículos
- **Uso:** `const items = await getAllItems()`

---

## useDecoration

Hook para gestión de decoraciones.

### Métodos

**createDecorationId**
- **Parámetros:** `account`
- **Descripción:** Crea nuevo ID de decoración
- **Uso:** `const decorationId = await createDecorationId(account)`

**getDecoration**
- **Parámetros:** `id`
- **Descripción:** Obtiene datos de decoración
- **Uso:** `const decoration = await getDecoration(1)`

**newDecoration**
- **Parámetros:** `account`, `aquariumId`, `name`, `description`, `price`, `rarity`
- **Descripción:** Crea nueva decoración
- **Uso:** `await newDecoration(account, 1, name, desc, price, rarity)`

**getPlayerDecorations**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene decoraciones de jugador
- **Uso:** `const decorations = await getPlayerDecorations("0xPlayer")`

**getPlayerDecorationCount**
- **Parámetros:** `playerAddress`
- **Descripción:** Obtiene número de decoraciones de jugador
- **Uso:** `const count = await getPlayerDecorationCount("0xPlayer")`

**getDecorationOwner**
- **Parámetros:** `decorationId`
- **Descripción:** Obtiene propietario de decoración
- **Uso:** `const owner = await getDecorationOwner(1)`

---

## useSession

Hook para gestión de sesiones.

### Métodos

**createSessionKey**
- **Parámetros:** `account`, `duration`, `maxTransactions`, `sessionType`
- **Descripción:** Crea nueva clave de sesión
- **Uso:** `await createSessionKey(account, 3600, 100, 1)`

**validateSession**
- **Parámetros:** `sessionId`
- **Descripción:** Valida sesión existente
- **Uso:** `const isValid = await validateSession("sessionId")`

**renewSession**
- **Parámetros:** `account`, `sessionId`, `newDuration`, `newMaxTx`
- **Descripción:** Renueva sesión existente
- **Uso:** `await renewSession(account, "sessionId", 7200, 50)`

**revokeSession**
- **Parámetros:** `account`, `sessionId`
- **Descripción:** Revoca sesión existente
- **Uso:** `await revokeSession(account, "sessionId")`

**getSessionInfo**
- **Parámetros:** `sessionId`
- **Descripción:** Obtiene información de sesión
- **Uso:** `const info = await getSessionInfo("sessionId")`

**calculateSessionTimeRemaining**
- **Parámetros:** `sessionId`
- **Descripción:** Calcula tiempo restante de sesión
- **Uso:** `const time = await calculateSessionTimeRemaining("sessionId")`

**checkSessionNeedsRenewal**
- **Parámetros:** `sessionId`
- **Descripción:** Verifica si sesión necesita renovación
- **Uso:** `const needsRenewal = await checkSessionNeedsRenewal("sessionId")`

**calculateRemainingTransactions**
- **Parámetros:** `sessionId`
- **Descripción:** Calcula transacciones restantes de sesión
- **Uso:** `const remaining = await calculateRemainingTransactions("sessionId")`

---

## useSessionEnhanced

Hook mejorado para gestión de sesiones.

### Métodos

#### Gestión de Sesiones

**createSessionKey**
- **Parámetros:** `account`, `duration`, `maxTransactions`, `sessionType`
- **Descripción:** Crea nueva clave de sesión
- **Uso:** `await createSessionKey(account, 3600, 100, 1)`

**renewSession**
- **Parámetros:** `account`, `sessionId`, `newDuration`, `newMaxTx`
- **Descripción:** Renueva sesión existente
- **Uso:** `await renewSession(account, sessionId, 7200, 50)`

**revokeSession**
- **Parámetros:** `account`, `sessionId`
- **Descripción:** Revoca sesión existente
- **Uso:** `await revokeSession(account, sessionId)`

**validateSession**
- **Parámetros:** `account`, `sessionId`
- **Descripción:** Valida sesión existente
- **Uso:** `const isValid = await validateSession(account, sessionId)`

#### Consultas

**getSessionInfo**
- **Parámetros:** `sessionId`
- **Descripción:** Obtiene información de sesión
- **Uso:** `const info = await getSessionInfo(sessionId)`

**calculateRemainingTransactions**
- **Parámetros:** `sessionId`
- **Descripción:** Calcula transacciones restantes de sesión
- **Uso:** `const remaining = await calculateRemainingTransactions(sessionId)`

**calculateSessionTimeRemaining**
- **Parámetros:** `sessionId`
- **Descripción:** Calcula tiempo restante de sesión
- **Uso:** `const time = await calculateSessionTimeRemaining(sessionId)`

**checkSessionNeedsRenewal**
- **Parámetros:** `sessionId`
- **Descripción:** Verifica si sesión necesita renovación
- **Uso:** `const needsRenewal = await checkSessionNeedsRenewal(sessionId)`

---

## useTransaction

Hook para gestión de transacciones.

### Métodos

**initiateTransaction**
- **Parámetros:** `account`, `player`, `eventTypeId`, `payload`
- **Descripción:** Inicia nueva transacción
- **Uso:** `const txId = await initiateTransaction(account, "0xPlayer", 1, ["data"])`

**processTransaction**
- **Parámetros:** `account`, `transactionId`
- **Descripción:** Procesa transacción pendiente
- **Uso:** `await processTransaction(account, txId)`

**confirmTransaction**
- **Parámetros:** `account`, `transactionId`, `confirmationHash`
- **Descripción:** Confirma transacción con hash
- **Uso:** `await confirmTransaction(account, txId, "0xHash")`

**getTransactionStatus**
- **Parámetros:** `transactionId`
- **Descripción:** Obtiene estado de transacción
- **Uso:** `const status = await getTransactionStatus(txId)`

**isTransactionConfirmed**
- **Parámetros:** `transactionId`
- **Descripción:** Verifica si transacción está confirmada
- **Uso:** `const confirmed = await isTransactionConfirmed(txId)`

---

## useTransactionHistory

Hook para gestión de historial de transacciones.

### Métodos

**registerEventType**
- **Parámetros:** `account`, `eventName`
- **Descripción:** Registra nuevo tipo de evento
- **Uso:** `const typeId = await registerEventType(account, "FishBred")`

**logEvent**
- **Parámetros:** `account`, `eventTypeId`, `player`, `payload`
- **Descripción:** Registra evento
- **Uso:** `await logEvent(account, typeId, "0xPlayer", ["data"])`

**getEventTypesCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene número de tipos de eventos
- **Uso:** `const count = await getEventTypesCount()`

**getAllEventTypes**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene todos los tipos de eventos
- **Uso:** `const types = await getAllEventTypes()`

**getEventTypeDetails**
- **Parámetros:** `eventTypeId`
- **Descripción:** Obtiene detalles de tipo de evento
- **Uso:** `const details = await getEventTypeDetails(typeId)`

**getTransactionCount**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene número total de transacciones
- **Uso:** `const count = await getTransactionCount()`

**getTransactionHistory**
- **Parámetros:** `player`, `eventTypeId`, `start`, `limit`, `startTimestamp`, `endTimestamp`
- **Descripción:** Obtiene historial de transacciones con filtros
- **Uso:** `const history = await getTransactionHistory("0xPlayer", null, 0, 10, null, null)`

**initiateTransaction**
- **Parámetros:** `account`, `player`, `eventTypeId`, `payload`
- **Descripción:** Inicia nueva transacción
- **Uso:** `const txId = await initiateTransaction(account, "0xPlayer", 1, ["data"])`

**processTransaction**
- **Parámetros:** `account`, `transactionId`
- **Descripción:** Procesa transacción pendiente
- **Uso:** `await processTransaction(account, txId)`

**confirmTransaction**
- **Parámetros:** `account`, `transactionId`, `confirmationHash`
- **Descripción:** Confirma transacción con hash
- **Uso:** `await confirmTransaction(account, txId, "0xHash")`

**getTransactionStatus**
- **Parámetros:** `transactionId`
- **Descripción:** Obtiene estado de transacción
- **Uso:** `const status = await getTransactionStatus(txId)`

**isTransactionConfirmed**
- **Parámetros:** `transactionId`
- **Descripción:** Verifica si transacción está confirmada
- **Uso:** `const confirmed = await isTransactionConfirmed(txId)`

---

## useExperience

Hook para gestión de experiencia.

### Métodos

**grantExperience**
- **Parámetros:** `account`, `player`, `amount`
- **Descripción:** Otorga experiencia a jugador
- **Uso:** `await grantExperience(account, "0xPlayer", 100)`

**getPlayerExperience**
- **Parámetros:** `player`
- **Descripción:** Obtiene experiencia de jugador
- **Uso:** `const experience = await getPlayerExperience("0xPlayer")`

**getExperienceConfig**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene configuración de experiencia
- **Uso:** `const config = await getExperienceConfig()`

**updateExperienceConfig**
- **Parámetros:** `account`, `baseExperience`, `experienceMultiplier`, `maxLevel`
- **Descripción:** Actualiza configuración de experiencia
- **Uso:** `await updateExperienceConfig(account, 100, 2, 50)`

**initializePlayerExperience**
- **Parámetros:** `account`, `player`
- **Descripción:** Inicializa experiencia de jugador
- **Uso:** `await initializePlayerExperience(account, "0xPlayer")`

**getLevelProgress**
- **Parámetros:** `player`
- **Descripción:** Obtiene progreso de nivel de jugador
- **Uso:** `const progress = await getLevelProgress("0xPlayer")`

**getExperienceForNextLevel**
- **Parámetros:** `player`
- **Descripción:** Obtiene experiencia necesaria para siguiente nivel
- **Uso:** `const exp = await getExperienceForNextLevel("0xPlayer")`

**claimLevelReward**
- **Parámetros:** `account`, `level`
- **Descripción:** Reclama recompensa de nivel
- **Uso:** `await claimLevelReward(account, 5)`

**getTotalExperienceGranted**
- **Parámetros:** Ninguno
- **Descripción:** Obtiene experiencia total otorgada
- **Uso:** `const total = await getTotalExperienceGranted()`

---

## Notas Importantes

### Hooks Deprecados
- `useFish.newFish` - Usar `useFishSystemEnhanced.newFish` en su lugar
- `useAquarium.createAquariumId` - Usar `useAquarium.newAquarium` en su lugar

### Hooks Recomendados
- **Para peces:** `useFishSystemEnhanced` (más completo)
- **Para transacciones:** `useTransactionHistory` (más funcionalidades)
- **Para sesiones:** `useSessionEnhanced` (mejor validación)
- **Para intercambios:** `useTradeEnhanced` (mejor tipado)

### Contratos Principales
- **AquaStark:** Contrato principal del juego
- **FishSystem:** Gestión específica de peces
- **Game:** Operaciones de juego
- **Trade:** Sistema de intercambios
- **AquaAuction:** Sistema de subastas
- **ShopCatalog:** Catálogo de tienda
- **Session:** Gestión de sesiones
- **Transaction:** Gestión de transacciones
- **Experience:** Sistema de experiencia

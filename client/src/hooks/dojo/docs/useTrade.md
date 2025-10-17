# useTrade Hook

## Descripción

Hook para gestionar intercambios de peces entre jugadores. Proporciona métodos para crear ofertas de intercambio, aceptar, cancelar y consultar información de trades.

## Contratos Utilizados

- `Trade`: Todas las operaciones de intercambio

## ⚠️ Nota Importante

Existe también `useTradeEnhanced` que usa camelCase. Este hook usa snake_case en los nombres de métodos.

## Métodos Disponibles

### `createTradeOffer(...)`

**Estado:** ✅ Activo

**Descripción:** Crea una nueva oferta de intercambio para un pez.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `offeredFishId` (BigNumberish): ID del pez ofrecido
- `criteria` (models.MatchCriteria): Criterios de coincidencia para el intercambio
- `requestedFishId` (BigNumberish | null): ID del pez solicitado (opcional)
- `requestedSpecies` (number | null): Especie solicitada como u8 (opcional)
- `requestedGeneration` (number | null): Generación solicitada como u8 (opcional)
- `requestedTraits` (string[]): Array de descripciones de rasgos solicitados
- `durationHours` (BigNumberish): Duración de la oferta en horas

**Retorna:** Promise<BigNumberish> con el ID de la nueva oferta

**Ejemplo:**

```typescript
const { createTradeOffer } = useTrade();

// Crear oferta: cambio mi pez #5 por un pez de especie Goldfish
const offerId = await createTradeOffer(
  account,
  5, // Mi pez
  matchCriteria, // Criterios
  null, // Sin pez específico
  1, // Especie: Goldfish
  null, // Cualquier generación
  [], // Sin rasgos específicos
  24 // 24 horas de duración
);

console.log(`Oferta creada: ${offerId}`);
```

**Cómo probar:**

```typescript
import { useTrade } from '@/hooks/dojo';

function CreateTradeOfferTest() {
  const account = useAccount();
  const { createTradeOffer } = useTrade();
  const [fishId, setFishId] = useState('');
  const [requestedSpecies, setRequestedSpecies] = useState('');
  const [duration, setDuration] = useState(24);

  const handleCreate = async () => {
    try {
      const criteria = { /* configurar criterios */ };
      const offerId = await createTradeOffer(
        account,
        fishId,
        criteria,
        null,
        requestedSpecies ? parseInt(requestedSpecies) : null,
        null,
        [],
        duration
      );
      console.log('Oferta creada:', offerId);
      alert(`Oferta creada con ID: ${offerId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Crear Oferta de Intercambio</h3>
      <input
        value={fishId}
        onChange={(e) => setFishId(e.target.value)}
        placeholder="ID de tu pez"
        type="number"
      />
      <input
        value={requestedSpecies}
        onChange={(e) => setRequestedSpecies(e.target.value)}
        placeholder="Especie solicitada (1-10)"
        type="number"
      />
      <input
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duración (horas)"
        type="number"
      />
      <button onClick={handleCreate}>Crear Oferta</button>
    </div>
  );
}
```

---

### `acceptTradeOffer(account, offerId, offeredFishId)`

**Estado:** ✅ Activo

**Descripción:** Acepta una oferta de intercambio con el pez especificado.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `offerId` (BigNumberish): ID de la oferta a aceptar
- `offeredFishId` (BigNumberish): ID del pez que se ofrece en aceptación

**Retorna:** Promise<boolean> con el estado de éxito

**Ejemplo:**

```typescript
const { acceptTradeOffer } = useTrade();

// Aceptar oferta #10 con mi pez #7
const success = await acceptTradeOffer(account, 10, 7);
if (success) {
  console.log('Intercambio completado exitosamente');
}
```

**Cómo probar:**

```typescript
function AcceptTradeTest() {
  const account = useAccount();
  const { acceptTradeOffer } = useTrade();
  const [offerId, setOfferId] = useState('');
  const [myFishId, setMyFishId] = useState('');

  const handleAccept = async () => {
    try {
      const result = await acceptTradeOffer(account, offerId, myFishId);
      if (result) {
        alert('¡Intercambio exitoso!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aceptar oferta');
    }
  };

  return (
    <div>
      <h3>Aceptar Oferta</h3>
      <input
        value={offerId}
        onChange={(e) => setOfferId(e.target.value)}
        placeholder="ID de la oferta"
        type="number"
      />
      <input
        value={myFishId}
        onChange={(e) => setMyFishId(e.target.value)}
        placeholder="ID de tu pez"
        type="number"
      />
      <button onClick={handleAccept}>Aceptar</button>
    </div>
  );
}
```

---

### `cancelTradeOffer(account, offerId)`

**Estado:** ✅ Activo

**Descripción:** Cancela una oferta de intercambio activa.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `offerId` (BigNumberish): ID de la oferta a cancelar

**Retorna:** Promise<boolean> con el estado de éxito

**Ejemplo:**

```typescript
const { cancelTradeOffer } = useTrade();

// Cancelar oferta #15
const success = await cancelTradeOffer(account, 15);
if (success) {
  console.log('Oferta cancelada');
}
```

**Cómo probar:**

```typescript
function CancelTradeTest() {
  const account = useAccount();
  const { cancelTradeOffer } = useTrade();
  const [offerId, setOfferId] = useState('');

  const handleCancel = async () => {
    try {
      const result = await cancelTradeOffer(account, offerId);
      if (result) {
        alert('Oferta cancelada');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={offerId}
        onChange={(e) => setOfferId(e.target.value)}
        placeholder="ID de la oferta"
        type="number"
      />
      <button onClick={handleCancel}>Cancelar Oferta</button>
    </div>
  );
}
```

---

### `getTradeOffer(offerId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los detalles de una oferta de intercambio específica.

**Parámetros:**

- `offerId` (BigNumberish): ID de la oferta

**Retorna:** Promise<models.TradeOffer> con los datos de la oferta

**Ejemplo:**

```typescript
const { getTradeOffer } = useTrade();

const offer = await getTradeOffer(10);
console.log('Oferta:', offer);
```

---

### `getActiveTradeOffers(creator)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las ofertas activas creadas por un usuario.

**Parámetros:**

- `creator` (string): Dirección del creador de las ofertas

**Retorna:** Promise<models.TradeOffer[]> con array de ofertas activas

**Ejemplo:**

```typescript
const { getActiveTradeOffers } = useTrade();

const myOffers = await getActiveTradeOffers(account.address);
console.log(`Tengo ${myOffers.length} ofertas activas`);
```

**Cómo probar:**

```typescript
function MyActiveOffersTest() {
  const account = useAccount();
  const { getActiveTradeOffers } = useTrade();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        try {
          const data = await getActiveTradeOffers(account.address);
          setOffers(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <h3>Mis Ofertas Activas ({offers.length})</h3>
      <ul>
        {offers.map(offer => (
          <li key={offer.id}>
            Oferta #{offer.id} - Pez: {offer.offeredFishId}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### `getAllActiveOffers()`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las ofertas activas globalmente.

**Parámetros:** Ninguno

**Retorna:** Promise<models.TradeOffer[]> con array de todas las ofertas activas

**Ejemplo:**

```typescript
const { getAllActiveOffers } = useTrade();

const allOffers = await getAllActiveOffers();
console.log(`Hay ${allOffers.length} ofertas disponibles`);
```

**Cómo probar:**

```typescript
function AllOffersMarketplaceTest() {
  const { getAllActiveOffers } = useTrade();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllActiveOffers();
        setOffers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Cargando ofertas...</p>;

  return (
    <div>
      <h3>Marketplace de Intercambios ({offers.length})</h3>
      <div className="offers-grid">
        {offers.map(offer => (
          <div key={offer.id} className="offer-card">
            <h4>Oferta #{offer.id}</h4>
            <p>Ofrece: Pez #{offer.offeredFishId}</p>
            <p>Solicita: {offer.requestedSpecies || 'Cualquiera'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### `getOffersForFish(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las ofertas activas relacionadas con un pez específico.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<models.TradeOffer[]> con array de ofertas relacionadas

**Ejemplo:**

```typescript
const { getOffersForFish } = useTrade();

const relatedOffers = await getOffersForFish(5);
console.log(`${relatedOffers.length} ofertas relacionadas con el pez #5`);
```

---

### `getFishLockStatus(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el estado de bloqueo de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<models.FishLock> con los datos de bloqueo

**Ejemplo:**

```typescript
const { getFishLockStatus } = useTrade();

const lockStatus = await getFishLockStatus(5);
console.log('Estado de bloqueo:', lockStatus);
```

---

### `isFishLocked(fishId)`

**Estado:** ✅ Activo

**Descripción:** Verifica si un pez está actualmente bloqueado para intercambio.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<boolean> - true si está bloqueado, false si no

**Ejemplo:**

```typescript
const { isFishLocked } = useTrade();

const locked = await isFishLocked(5);
if (locked) {
  console.log('El pez está en una oferta activa');
} else {
  console.log('El pez está disponible para intercambiar');
}
```

**Cómo probar:**

```typescript
function FishLockStatusTest() {
  const { isFishLocked } = useTrade();
  const [fishId, setFishId] = useState('');
  const [isLocked, setIsLocked] = useState(null);

  const handleCheck = async () => {
    try {
      const locked = await isFishLocked(fishId);
      setIsLocked(locked);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={fishId}
        onChange={(e) => setFishId(e.target.value)}
        placeholder="Fish ID"
        type="number"
      />
      <button onClick={handleCheck}>Verificar Estado</button>

      {isLocked !== null && (
        <p>{isLocked ? '🔒 Bloqueado' : '✅ Disponible'}</p>
      )}
    </div>
  );
}
```

---

### `cleanupExpiredOffers(account)`

**Estado:** ✅ Activo

**Descripción:** Limpia ofertas expiradas del sistema.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario

**Retorna:** Promise<BigNumberish> con el número de ofertas limpiadas

**Ejemplo:**

```typescript
const { cleanupExpiredOffers } = useTrade();

const cleaned = await cleanupExpiredOffers(account);
console.log(`${cleaned} ofertas expiradas eliminadas`);
```

---

### `getTotalTradesCount()`

**Estado:** ✅ Activo

**Descripción:** Obtiene el contador total de todos los intercambios realizados.

**Parámetros:** Ninguno

**Retorna:** Promise<BigNumberish> con el contador total

**Ejemplo:**

```typescript
const { getTotalTradesCount } = useTrade();

const total = await getTotalTradesCount();
console.log(`Total de intercambios en el sistema: ${total}`);
```

---

### `getUserTradeCount(user)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el número total de intercambios realizados por un usuario.

**Parámetros:**

- `user` (string): Dirección del usuario

**Retorna:** Promise<BigNumberish> con el contador del usuario

**Ejemplo:**

```typescript
const { getUserTradeCount } = useTrade();

const myTrades = await getUserTradeCount(account.address);
console.log(`Has realizado ${myTrades} intercambios`);
```

---

## Resumen de Métodos

| Método               | Estado    | Tipo  | Categoría     |
| -------------------- | --------- | ----- | ------------- |
| createTradeOffer     | ✅ Activo | Write | Gestión       |
| acceptTradeOffer     | ✅ Activo | Write | Gestión       |
| cancelTradeOffer     | ✅ Activo | Write | Gestión       |
| getTradeOffer        | ✅ Activo | Query | Consulta      |
| getActiveTradeOffers | ✅ Activo | Query | Consulta      |
| getAllActiveOffers   | ✅ Activo | Query | Consulta      |
| getOffersForFish     | ✅ Activo | Query | Consulta      |
| getFishLockStatus    | ✅ Activo | Query | Estado        |
| isFishLocked         | ✅ Activo | Query | Estado        |
| cleanupExpiredOffers | ✅ Activo | Write | Mantenimiento |
| getTotalTradesCount  | ✅ Activo | Query | Estadísticas  |
| getUserTradeCount    | ✅ Activo | Query | Estadísticas  |

## Flujo Completo de Intercambio

```typescript
// 1. Verificar que el pez no esté bloqueado
const locked = await isFishLocked(myFishId);
if (locked) {
  console.log('Pez no disponible');
  return;
}

// 2. Crear oferta
const offerId = await createTradeOffer(
  account,
  myFishId,
  criteria,
  null,
  requestedSpecies,
  null,
  [],
  24
);

// 3. Otro jugador ve ofertas disponibles
const offers = await getAllActiveOffers();

// 4. Otro jugador acepta
await acceptTradeOffer(otherAccount, offerId, theirFishId);

// 5. O el creador cancela
await cancelTradeOffer(account, offerId);

// 6. Limpiar ofertas expiradas periódicamente
await cleanupExpiredOffers(account);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useTrade.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/typescript/models.gen`

## Diferencias con useTradeEnhanced

- **useTrade**: usa snake_case (`create_trade_offer`, `get_trade_offer`)
- **useTradeEnhanced**: usa camelCase (`createTradeOffer`, `getTradeOffer`)

Se recomienda usar **useTradeEnhanced** para consistencia con el resto del código.

## Notas Importantes

- Los peces se bloquean automáticamente al crear una oferta
- Las ofertas expiran según el tiempo especificado en `durationHours`
- Solo el creador puede cancelar su propia oferta
- El intercambio requiere que el pez ofrecido coincida con los criterios

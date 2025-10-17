# useAquaAuction Hook

## Descripción

Hook para gestionar subastas de peces en el ecosistema AquaStark. Proporciona métodos para iniciar, pujar, finalizar subastas y consultar información de subastas activas.

## Contratos Utilizados

- `AquaAuction`: Todas las operaciones de subasta

## Métodos Disponibles

### `startAuction(account, fishId, durationSecs, reservePrice)`

**Estado:** ✅ Activo

**Descripción:** Inicia una nueva subasta para un pez.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `fishId` (BigNumberish): ID del pez a subastar
- `durationSecs` (BigNumberish): Duración de la subasta en segundos
- `reservePrice` (BigNumberish): Precio mínimo de puja

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { startAuction } = useAquaAuction();

// Subasta de 24 horas con precio mínimo de 100 tokens
await startAuction(
  account,
  5, // Fish ID
  86400, // 24 horas en segundos
  100 // Precio mínimo
);
```

**Cómo probar:**

```typescript
function StartAuctionTest() {
  const account = useAccount();
  const { startAuction } = useAquaAuction();
  const [fishId, setFishId] = useState('');
  const [duration, setDuration] = useState(24);
  const [reservePrice, setReservePrice] = useState('');

  const handleStart = async () => {
    try {
      await startAuction(
        account,
        fishId,
        duration * 3600, // Convertir horas a segundos
        reservePrice
      );
      alert('¡Subasta iniciada!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Iniciar Subasta</h3>
      <input
        value={fishId}
        onChange={(e) => setFishId(e.target.value)}
        placeholder="Fish ID"
        type="number"
      />
      <input
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duración (horas)"
        type="number"
      />
      <input
        value={reservePrice}
        onChange={(e) => setReservePrice(e.target.value)}
        placeholder="Precio mínimo"
        type="number"
      />
      <button onClick={handleStart}>Iniciar Subasta</button>
    </div>
  );
}
```

---

### `placeBid(account, auctionId, amount)`

**Estado:** ✅ Activo

**Descripción:** Coloca una puja en una subasta activa.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `auctionId` (BigNumberish): ID de la subasta
- `amount` (BigNumberish): Cantidad a pujar

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { placeBid } = useAquaAuction();

// Pujar 150 tokens en subasta #10
await placeBid(account, 10, 150);
```

**Cómo probar:**

```typescript
function PlaceBidTest() {
  const account = useAccount();
  const { placeBid } = useAquaAuction();
  const [auctionId, setAuctionId] = useState('');
  const [amount, setAmount] = useState('');

  const handleBid = async () => {
    try {
      await placeBid(account, auctionId, amount);
      alert('¡Puja realizada!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al pujar');
    }
  };

  return (
    <div>
      <h3>Realizar Puja</h3>
      <input
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
        placeholder="Auction ID"
        type="number"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Cantidad"
        type="number"
      />
      <button onClick={handleBid}>Pujar</button>
    </div>
  );
}
```

---

### `endAuction(account, auctionId)`

**Estado:** ✅ Activo

**Descripción:** Finaliza una subasta activa.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `auctionId` (BigNumberish): ID de la subasta a finalizar

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { endAuction } = useAquaAuction();

await endAuction(account, 10);
console.log('Subasta finalizada');
```

---

### `getAuctionById(auctionId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los detalles de una subasta por su ID.

**Parámetros:**

- `auctionId` (BigNumberish): ID de la subasta

**Retorna:** Promise con los datos de la subasta

**Ejemplo:**

```typescript
const { getAuctionById } = useAquaAuction();

const auction = await getAuctionById(10);
console.log('Subasta:', auction);
```

**Cómo probar:**

```typescript
function AuctionDetailsTest() {
  const { getAuctionById } = useAquaAuction();
  const [auctionId, setAuctionId] = useState('');
  const [auctionData, setAuctionData] = useState(null);

  const handleGet = async () => {
    try {
      const data = await getAuctionById(auctionId);
      setAuctionData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
        placeholder="Auction ID"
        type="number"
      />
      <button onClick={handleGet}>Ver Detalles</button>

      {auctionData && (
        <div>
          <h3>Subasta #{auctionData.id}</h3>
          <p>Pez: #{auctionData.fishId}</p>
          <p>Puja actual: {auctionData.currentBid}</p>
          <p>Precio mínimo: {auctionData.reservePrice}</p>
        </div>
      )}
    </div>
  );
}
```

---

### `getActiveAuctions()`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las subastas activas actualmente.

**Parámetros:** Ninguno

**Retorna:** Promise con array de subastas activas

**Ejemplo:**

```typescript
const { getActiveAuctions } = useAquaAuction();

const auctions = await getActiveAuctions();
console.log(`${auctions.length} subastas activas`);
```

**Cómo probar:**

```typescript
function ActiveAuctionsTest() {
  const { getActiveAuctions } = useAquaAuction();
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getActiveAuctions();
        setAuctions(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h3>Subastas Activas ({auctions.length})</h3>
      <div className="auctions-grid">
        {auctions.map(auction => (
          <div key={auction.id} className="auction-card">
            <h4>Subasta #{auction.id}</h4>
            <p>Pez: #{auction.fishId}</p>
            <p>Puja actual: {auction.currentBid}</p>
            <p>Precio mínimo: {auction.reservePrice}</p>
            <button>Pujar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Resumen de Métodos

| Método            | Estado    | Tipo  | Requiere Cuenta |
| ----------------- | --------- | ----- | --------------- |
| startAuction      | ✅ Activo | Write | Sí              |
| placeBid          | ✅ Activo | Write | Sí              |
| endAuction        | ✅ Activo | Write | Sí              |
| getAuctionById    | ✅ Activo | Query | No              |
| getActiveAuctions | ✅ Activo | Query | No              |

## Flujo Completo de Subasta

```typescript
// 1. Usuario inicia subasta
await startAuction(account, fishId, 86400, 100);

// 2. Ver subastas activas
const auctions = await getActiveAuctions();

// 3. Obtener detalles de una subasta
const auction = await getAuctionById(auctionId);

// 4. Usuarios realizan pujas
await placeBid(bidderAccount, auctionId, 150);
await placeBid(otherBidderAccount, auctionId, 200);

// 5. Finalizar subasta
await endAuction(account, auctionId);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useAquaAuction.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/types`

## Notas Importantes

- Las pujas deben ser mayores que el precio mínimo (reserve price)
- Cada nueva puja debe ser mayor que la puja actual
- Solo el propietario o cuando expira puede finalizar la subasta
- El pez se bloquea durante la subasta
- La duración se especifica en segundos

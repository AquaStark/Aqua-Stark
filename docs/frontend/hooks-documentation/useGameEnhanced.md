# useGameEnhanced Hook

## Descripción

Hook para interactuar con el contrato Game. Proporciona funciones comprehensivas de gestión del juego incluyendo acuarios, peces, decoraciones, jugadores, listings y genealogía.

## Contratos Utilizados

- `Game`: Todas las operaciones del juego

## Métodos Disponibles

## Funciones de Acuarios

### `getAquarium(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un acuario por su ID.

**Parámetros:**

- `id` (BigNumberish): ID del acuario

**Retorna:** Promise con los datos del acuario

**Ejemplo:**

```typescript
const { getAquarium } = useGameEnhanced();
const aquarium = await getAquarium(1);
```

---

### `getAquariumOwner(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el propietario de un acuario.

**Parámetros:**

- `id` (BigNumberish): ID del acuario

**Retorna:** Promise<string> con la dirección del propietario

---

### `getPlayerAquariums(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los acuarios de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise con array de acuarios

---

### `getPlayerAquariumCount(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el contador de acuarios de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

---

## Funciones de Peces

### `getFish(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un pez por su ID.

**Parámetros:**

- `id` (BigNumberish): ID del pez

**Retorna:** Promise con los datos del pez

---

### `getFishOwner(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el propietario de un pez.

**Parámetros:**

- `id` (BigNumberish): ID del pez

**Retorna:** Promise<string> con la dirección del propietario

---

### `getPlayerFishes(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los peces de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise con array de peces

**Cómo probar:**

```typescript
function PlayerFishesTest() {
  const account = useAccount();
  const { getPlayerFishes } = useGameEnhanced();
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        try {
          const data = await getPlayerFishes(account.address);
          setFishes(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <h3>Mis Peces ({fishes.length})</h3>
      <ul>
        {fishes.map(fish => (
          <li key={fish.id}>Pez #{fish.id} - {fish.species}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### `getPlayerFishCount(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el contador de peces de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

---

## Funciones de Decoraciones

### `getDecoration(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de una decoración por su ID.

**Parámetros:**

- `id` (BigNumberish): ID de la decoración

**Retorna:** Promise con los datos de la decoración

---

### `getDecorationOwner(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el propietario de una decoración.

**Parámetros:**

- `id` (BigNumberish): ID de la decoración

**Retorna:** Promise<string> con la dirección del propietario

---

### `getPlayerDecorations(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las decoraciones de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise con array de decoraciones

---

### `getPlayerDecorationCount(player)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el contador de decoraciones de un jugador.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

---

## Funciones de Jugadores

### `getPlayer(address)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un jugador.

**Parámetros:**

- `address` (string): Dirección del jugador

**Retorna:** Promise con los datos del jugador

---

### `isVerified(player)`

**Estado:** ✅ Activo

**Descripción:** Verifica si un jugador está verificado.

**Parámetros:**

- `player` (string): Dirección del jugador

**Retorna:** Promise<boolean> - true si está verificado

**Cómo probar:**

```typescript
function VerificationBadgeTest() {
  const account = useAccount();
  const { isVerified } = useGameEnhanced();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (account?.address) {
        const status = await isVerified(account.address);
        setVerified(status);
      }
    };
    check();
  }, [account]);

  return (
    <div>
      {verified ? '✓ Verificado' : '✗ No verificado'}
    </div>
  );
}
```

---

## Funciones de Listings

### `getListing(listingId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un listing.

**Parámetros:**

- `listingId` (BigNumberish): ID del listing

**Retorna:** Promise con los datos del listing

---

### `listFish(fishId, price)`

**Estado:** ✅ Activo

**Descripción:** Lista un pez para venta.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez
- `price` (BigNumberish): Precio de venta

**Retorna:** Promise con el resultado

**Ejemplo:**

```typescript
const { listFish } = useGameEnhanced();
await listFish(5, 100); // Listar pez #5 por 100 tokens
```

---

## Funciones de Genealogía

### `getParents(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los padres de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise con los IDs de los padres

---

### `getFishAncestor(fishId, generation)`

**Estado:** ✅ Activo

**Descripción:** Obtiene un ancestro específico por generación.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez
- `generation` (BigNumberish): Número de generaciones atrás

**Retorna:** Promise con los datos del ancestro

---

### `getFishFamilyTree(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el árbol genealógico completo.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise con el árbol genealógico

**Cómo probar:**

```typescript
function FamilyTreeVisualizerTest() {
  const { getFishFamilyTree } = useGameEnhanced();
  const [fishId, setFishId] = useState('');
  const [tree, setTree] = useState(null);

  const handleGetTree = async () => {
    try {
      const data = await getFishFamilyTree(fishId);
      setTree(data);
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
      <button onClick={handleGetTree}>Ver Árbol</button>

      {tree && (
        <div className="family-tree">
          <pre>{JSON.stringify(tree, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

### `getFishOffspring(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los hijos de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise con array de hijos

---

## Resumen de Métodos

### Acuarios (4 métodos)

| Método                 | Tipo  |
| ---------------------- | ----- |
| getAquarium            | Query |
| getAquariumOwner       | Query |
| getPlayerAquariums     | Query |
| getPlayerAquariumCount | Query |

### Peces (4 métodos)

| Método             | Tipo  |
| ------------------ | ----- |
| getFish            | Query |
| getFishOwner       | Query |
| getPlayerFishes    | Query |
| getPlayerFishCount | Query |

### Decoraciones (4 métodos)

| Método                   | Tipo  |
| ------------------------ | ----- |
| getDecoration            | Query |
| getDecorationOwner       | Query |
| getPlayerDecorations     | Query |
| getPlayerDecorationCount | Query |

### Jugadores (2 métodos)

| Método     | Tipo  |
| ---------- | ----- |
| getPlayer  | Query |
| isVerified | Query |

### Listings (2 métodos)

| Método     | Tipo  |
| ---------- | ----- |
| getListing | Query |
| listFish   | Write |

### Genealogía (4 métodos)

| Método            | Tipo  |
| ----------------- | ----- |
| getParents        | Query |
| getFishAncestor   | Query |
| getFishFamilyTree | Query |
| getFishOffspring  | Query |

## Dashboard Completo de Ejemplo

```typescript
function PlayerDashboard() {
  const account = useAccount();
  const {
    getPlayerAquariumCount,
    getPlayerFishCount,
    getPlayerDecorationCount,
    isVerified
  } = useGameEnhanced();

  const [stats, setStats] = useState({
    aquariums: 0,
    fishes: 0,
    decorations: 0,
    verified: false
  });

  useEffect(() => {
    const loadStats = async () => {
      if (account?.address) {
        const [aq, fi, dec, ver] = await Promise.all([
          getPlayerAquariumCount(account.address),
          getPlayerFishCount(account.address),
          getPlayerDecorationCount(account.address),
          isVerified(account.address)
        ]);

        setStats({
          aquariums: aq,
          fishes: fi,
          decorations: dec,
          verified: ver
        });
      }
    };
    loadStats();
  }, [account]);

  return (
    <div className="dashboard">
      <h2>Mi Dashboard {stats.verified && '✓'}</h2>
      <div className="stats">
        <div>🏠 Acuarios: {stats.aquariums}</div>
        <div>🐠 Peces: {stats.fishes}</div>
        <div>🎨 Decoraciones: {stats.decorations}</div>
      </div>
    </div>
  );
}
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useAdditionalContracts.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/types`

## Notas Importantes

- Todos los métodos son de tipo Query (solo lectura)
- Excepto `listFish` que es Write y requiere transacción
- Agrupa funcionalidad de múltiples entidades del juego
- Ideal para dashboards y vistas generales

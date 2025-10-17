# useDecoration Hook

## Descripción

Hook para gestionar operaciones relacionadas con decoraciones en el ecosistema AquaStark. Proporciona métodos para crear, obtener y gestionar decoraciones para acuarios.

## Contratos Utilizados

- `AquaStark`: Todas las operaciones de decoraciones

## Métodos Disponibles

### `createDecorationId(account)`

**Estado:** ✅ Activo

**Descripción:** Crea un nuevo ID único para una decoración.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet

**Retorna:** Promise<BigNumberish> con el ID de la decoración creada

**Ejemplo:**

```typescript
const { createDecorationId } = useDecoration();

const decorationId = await createDecorationId(account);
console.log(`Nuevo Decoration ID: ${decorationId}`);
```

**Cómo probar:**

```typescript
import { useDecoration } from '@/hooks/dojo';

function CreateDecorationIdTest() {
  const account = useAccount();
  const { createDecorationId } = useDecoration();

  const handleCreate = async () => {
    try {
      const id = await createDecorationId(account);
      console.log('Decoration ID creado:', id);
      alert(`Nuevo Decoration ID: ${id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleCreate}>Crear Decoration ID</button>;
}
```

---

### `getDecoration(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de una decoración por su ID.

**Parámetros:**

- `id` (BigNumberish): ID de la decoración

**Retorna:** Promise con los datos de la decoración

**Ejemplo:**

```typescript
const { getDecoration } = useDecoration();

const decoration = await getDecoration(1);
console.log('Decoración:', decoration);
// { id: 1, name: "Castillo", rarity: ..., price: ... }
```

**Cómo probar:**

```typescript
function DecorationDetailsTest() {
  const { getDecoration } = useDecoration();
  const [decorationData, setDecorationData] = useState(null);
  const [decorationId, setDecorationId] = useState('');

  const handleGet = async () => {
    try {
      const data = await getDecoration(decorationId);
      setDecorationData(data);
      console.log('Decoración encontrada:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={decorationId}
        onChange={(e) => setDecorationId(e.target.value)}
        placeholder="Decoration ID"
        type="number"
      />
      <button onClick={handleGet}>Obtener Decoración</button>

      {decorationData && (
        <div>
          <h3>Decoración #{decorationData.id}</h3>
          <pre>{JSON.stringify(decorationData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

### `newDecoration(account, aquariumId, name, description, price, rarity)`

**Estado:** ✅ Activo

**Descripción:** Crea una nueva decoración y la asigna a un acuario.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet
- `aquariumId` (BigNumberish): ID del acuario destino
- `name` (BigNumberish): Nombre de la decoración (codificado como felt)
- `description` (BigNumberish): Descripción de la decoración (codificada como felt)
- `price` (BigNumberish): Precio de la decoración
- `rarity` (BigNumberish): Rareza de la decoración (0-5)

**Retorna:** Promise con el resultado de la creación

**Ejemplo:**

```typescript
import { stringToFelt } from '@/utils/starknet';

const { newDecoration } = useDecoration();

const decoration = await newDecoration(
  account,
  1, // Aquarium ID
  stringToFelt('Castillo'), // Nombre
  stringToFelt('Castillo medieval'), // Descripción
  50, // Precio
  3 // Rareza (0=común, 5=legendario)
);
```

**Cómo probar:**

```typescript
import { stringToFelt } from '@/utils/starknet';

function CreateDecorationTest() {
  const account = useAccount();
  const { newDecoration } = useDecoration();
  const [aquariumId, setAquariumId] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rarity, setRarity] = useState(1);

  const handleCreate = async () => {
    try {
      const decoration = await newDecoration(
        account,
        aquariumId,
        stringToFelt(name),
        stringToFelt(description),
        price,
        rarity
      );
      console.log('Decoración creada:', decoration);
      alert('¡Decoración creada exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear decoración');
    }
  };

  return (
    <div>
      <h3>Crear Nueva Decoración</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        type="number"
      />
      <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
        <option value="0">Común</option>
        <option value="1">Poco Común</option>
        <option value="2">Raro</option>
        <option value="3">Épico</option>
        <option value="4">Legendario</option>
        <option value="5">Mítico</option>
      </select>
      <input
        value={aquariumId}
        onChange={(e) => setAquariumId(e.target.value)}
        placeholder="Aquarium ID"
        type="number"
      />
      <button onClick={handleCreate}>Crear</button>
    </div>
  );
}
```

---

### `getPlayerDecorations(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todas las decoraciones propiedad de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise con array de decoraciones

**Ejemplo:**

```typescript
const { getPlayerDecorations } = useDecoration();

const decorations = await getPlayerDecorations('0x123abc...');
console.log(`Jugador tiene ${decorations.length} decoraciones`);
```

**Cómo probar:**

```typescript
function MyDecorationsTest() {
  const account = useAccount();
  const { getPlayerDecorations } = useDecoration();
  const [decorations, setDecorations] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        try {
          const data = await getPlayerDecorations(account.address);
          setDecorations(data);
          console.log('Decoraciones cargadas:', data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <h3>Mis Decoraciones ({decorations.length})</h3>
      <ul>
        {decorations.map(decoration => (
          <li key={decoration.id}>
            Decoración #{decoration.id} - Rareza: {decoration.rarity}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### `getPlayerDecorationCount(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el número total de decoraciones de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

**Ejemplo:**

```typescript
const { getPlayerDecorationCount } = useDecoration();

const count = await getPlayerDecorationCount('0x123abc...');
console.log(`Tienes ${count} decoraciones`);
```

**Cómo probar:**

```typescript
function DecorationCountTest() {
  const account = useAccount();
  const { getPlayerDecorationCount } = useDecoration();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        try {
          const total = await getPlayerDecorationCount(account.address);
          setCount(total);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <p>Total de decoraciones: {count}</p>
    </div>
  );
}
```

---

### `getDecorationOwner(decorationId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene la dirección del propietario de una decoración.

**Parámetros:**

- `decorationId` (BigNumberish): ID de la decoración

**Retorna:** Promise<string> con la dirección del propietario

**Ejemplo:**

```typescript
const { getDecorationOwner } = useDecoration();

const owner = await getDecorationOwner(1);
console.log(`Propietario: ${owner}`);
```

**Cómo probar:**

```typescript
function DecorationOwnerTest() {
  const { getDecorationOwner } = useDecoration();
  const [decorationId, setDecorationId] = useState('');
  const [owner, setOwner] = useState('');

  const handleGetOwner = async () => {
    try {
      const ownerAddress = await getDecorationOwner(decorationId);
      setOwner(ownerAddress);
      console.log('Propietario:', ownerAddress);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={decorationId}
        onChange={(e) => setDecorationId(e.target.value)}
        placeholder="Decoration ID"
        type="number"
      />
      <button onClick={handleGetOwner}>Ver Propietario</button>

      {owner && (
        <div>
          <p>Propietario: {owner}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Resumen de Métodos

| Método                   | Estado    | Tipo  | Requiere Cuenta |
| ------------------------ | --------- | ----- | --------------- |
| createDecorationId       | ✅ Activo | Write | Sí              |
| getDecoration            | ✅ Activo | Query | No              |
| newDecoration            | ✅ Activo | Write | Sí              |
| getPlayerDecorations     | ✅ Activo | Query | No              |
| getPlayerDecorationCount | ✅ Activo | Query | No              |
| getDecorationOwner       | ✅ Activo | Query | No              |

## Niveles de Rareza

| Valor | Nombre     | Descripción             |
| ----- | ---------- | ----------------------- |
| 0     | Común      | Decoraciones básicas    |
| 1     | Poco Común | Decoraciones estándar   |
| 2     | Raro       | Decoraciones especiales |
| 3     | Épico      | Decoraciones premium    |
| 4     | Legendario | Decoraciones exclusivas |
| 5     | Mítico     | Decoraciones únicas     |

## Flujo de Uso Típico

```typescript
// 1. Crear ID de decoración
const decorationId = await createDecorationId(account);

// 2. Crear nueva decoración
const decoration = await newDecoration(
  account,
  aquariumId,
  stringToFelt('Castillo'),
  stringToFelt('Un hermoso castillo'),
  100,
  3
);

// 3. Consultar decoraciones del jugador
const myDecorations = await getPlayerDecorations(account.address);

// 4. Obtener detalles de una decoración
const decorationData = await getDecoration(decoration.id);

// 5. Verificar propietario
const owner = await getDecorationOwner(decoration.id);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useDecoration.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/utils/starknet` (stringToFelt)

## Notas Importantes

- Los nombres y descripciones deben convertirse a felt usando `stringToFelt`
- La rareza debe estar entre 0 y 5
- Las decoraciones se asignan a un acuario específico al crearlas
- Los métodos de escritura requieren una cuenta conectada
- Los métodos de consulta no requieren autenticación

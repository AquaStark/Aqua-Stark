# useFish Hook

## Descripción

Hook para gestionar operaciones relacionadas con peces en el ecosistema AquaStark. Proporciona métodos para crear, obtener, reproducir, gestionar genealogía y realizar operaciones de marketplace con peces.

## Contratos Utilizados

- `AquaStark`: Todas las operaciones de peces

## Métodos Disponibles

### `createFishId(account)`

**Estado:** ✅ Activo

**Descripción:** Crea un nuevo ID único para un pez.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet

**Retorna:** Promise<BigNumberish> con el ID del pez creado

**Ejemplo:**

```typescript
const { createFishId } = useFish();

const fishId = await createFishId(account);
console.log(`Nuevo Fish ID: ${fishId}`);
```

**Cómo probar:**

```typescript
import { useFish } from '@/hooks/dojo';

function CreateFishIdTest() {
  const account = useAccount();
  const { createFishId } = useFish();

  const handleCreate = async () => {
    try {
      const id = await createFishId(account);
      console.log('Fish ID creado:', id);
      alert(`Nuevo Fish ID: ${id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleCreate}>Crear Fish ID</button>;
}
```

---

### `getFish(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un pez por su ID.

**Parámetros:**

- `id` (BigNumberish): ID del pez

**Retorna:** Promise<models.Fish> con los datos del pez

**Ejemplo:**

```typescript
const { getFish } = useFish();

const fish = await getFish(1);
console.log('Datos del pez:', fish);
// { id: 1, species: ..., health: ..., hunger: ... }
```

**Cómo probar:**

```typescript
function FishDetailsTest() {
  const { getFish } = useFish();
  const [fishData, setFishData] = useState(null);
  const [fishId, setFishId] = useState('');

  const handleGet = async () => {
    try {
      const data = await getFish(fishId);
      setFishData(data);
      console.log('Pez encontrado:', data);
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
      <button onClick={handleGet}>Obtener Pez</button>

      {fishData && (
        <div>
          <h3>Pez #{fishData.id}</h3>
          <pre>{JSON.stringify(fishData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

### `newFish(account, aquariumId, species)`

**Estado:** ✅ Activo

**Descripción:** Crea un nuevo pez y lo asigna a un acuario.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet
- `aquariumId` (BigNumberish): ID del acuario destino
- `species` (CairoCustomEnum): Especie del pez (enum de Cairo)

**Retorna:** Promise<models.Fish> con el resultado de la creación

**Ejemplo:**

```typescript
import { CairoCustomEnum } from 'starknet';
const { newFish } = useFish();

// Crear un pez dorado
const fish = await newFish(
  account,
  1, // Acuario ID
  new CairoCustomEnum({ Goldfish: {} })
);
```

**Cómo probar:**

```typescript
import { CairoCustomEnum } from 'starknet';

function CreateFishTest() {
  const account = useAccount();
  const { newFish } = useFish();
  const [aquariumId, setAquariumId] = useState(1);
  const [species, setSpecies] = useState('Goldfish');

  const handleCreate = async () => {
    try {
      const speciesEnum = new CairoCustomEnum({ [species]: {} });
      const fish = await newFish(account, aquariumId, speciesEnum);
      console.log('Pez creado:', fish);
      alert('¡Pez creado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <select value={species} onChange={(e) => setSpecies(e.target.value)}>
        <option value="Goldfish">Goldfish</option>
        <option value="Betta">Betta</option>
        <option value="Guppy">Guppy</option>
      </select>
      <input
        value={aquariumId}
        onChange={(e) => setAquariumId(e.target.value)}
        type="number"
        placeholder="Aquarium ID"
      />
      <button onClick={handleCreate}>Crear Pez</button>
    </div>
  );
}
```

---

### `getPlayerFishes(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los peces propiedad de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise<models.Fish[]> con array de datos de peces

**Ejemplo:**

```typescript
const { getPlayerFishes } = useFish();

const fishes = await getPlayerFishes('0x123abc...');
console.log(`Jugador tiene ${fishes.length} peces`);
```

**Cómo probar:**

```typescript
function MyFishesTest() {
  const account = useAccount();
  const { getPlayerFishes } = useFish();
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
          <li key={fish.id}>
            Pez #{fish.id} - {fish.species}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### `getPlayerFishCount(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el número total de peces de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

**Ejemplo:**

```typescript
const { getPlayerFishCount } = useFish();

const count = await getPlayerFishCount('0x123abc...');
console.log(`Tienes ${count} peces`);
```

---

### `breedFishes(account, parent1Id, parent2Id)`

**Estado:** ✅ Activo

**Descripción:** Reproduce dos peces y crea una cría.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet
- `parent1Id` (BigNumberish): ID del primer pez padre
- `parent2Id` (BigNumberish): ID del segundo pez padre

**Retorna:** Promise<BigNumberish> con el ID del pez hijo

**Ejemplo:**

```typescript
const { breedFishes } = useFish();

// Reproducir peces #5 y #7
const offspringId = await breedFishes(account, 5, 7);
console.log(`Nueva cría ID: ${offspringId}`);
```

**Cómo probar:**

```typescript
function BreedFishTest() {
  const account = useAccount();
  const { breedFishes } = useFish();
  const [parent1, setParent1] = useState('');
  const [parent2, setParent2] = useState('');

  const handleBreed = async () => {
    try {
      const offspring = await breedFishes(account, parent1, parent2);
      console.log('Cría creada:', offspring);
      alert(`¡Nueva cría con ID: ${offspring}!`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al reproducir peces');
    }
  };

  return (
    <div>
      <h3>Reproducir Peces</h3>
      <input
        value={parent1}
        onChange={(e) => setParent1(e.target.value)}
        placeholder="ID Padre 1"
        type="number"
      />
      <input
        value={parent2}
        onChange={(e) => setParent2(e.target.value)}
        placeholder="ID Padre 2"
        type="number"
      />
      <button onClick={handleBreed}>Reproducir</button>
    </div>
  );
}
```

---

### `getFishOwner(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el propietario de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<string> con la dirección del propietario

**Ejemplo:**

```typescript
const { getFishOwner } = useFish();

const owner = await getFishOwner(1);
console.log(`Propietario: ${owner}`);
```

---

### `getFishParents(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los padres de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<[BigNumberish, BigNumberish]> tupla con IDs de los padres

**Ejemplo:**

```typescript
const { getFishParents } = useFish();

const [parent1, parent2] = await getFishParents(10);
console.log(`Padres: ${parent1} y ${parent2}`);
```

**Cómo probar:**

```typescript
function FishParentsTest() {
  const { getFishParents } = useFish();
  const [fishId, setFishId] = useState('');
  const [parents, setParents] = useState(null);

  const handleGetParents = async () => {
    try {
      const [p1, p2] = await getFishParents(fishId);
      setParents({ parent1: p1, parent2: p2 });
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
      <button onClick={handleGetParents}>Ver Padres</button>

      {parents && (
        <div>
          <p>Padre 1: {parents.parent1.toString()}</p>
          <p>Padre 2: {parents.parent2.toString()}</p>
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

**Retorna:** Promise<models.Fish[]> array con datos de los hijos

**Ejemplo:**

```typescript
const { getFishOffspring } = useFish();

const offspring = await getFishOffspring(5);
console.log(`Pez tiene ${offspring.length} hijos`);
```

---

### `getFishAncestor(fishId, generation)`

**Estado:** ✅ Activo

**Descripción:** Obtiene un ancestro específico de un pez por generación.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez
- `generation` (BigNumberish): Número de generaciones atrás

**Retorna:** Promise<models.FishParents> con datos del ancestro

**Ejemplo:**

```typescript
const { getFishAncestor } = useFish();

// Obtener bisabuelo (2 generaciones atrás)
const ancestor = await getFishAncestor(15, 2);
```

---

### `getFishFamilyTree(fishId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el árbol genealógico completo de un pez.

**Parámetros:**

- `fishId` (BigNumberish): ID del pez

**Retorna:** Promise<models.FishParents[]> con el árbol genealógico completo

**Ejemplo:**

```typescript
const { getFishFamilyTree } = useFish();

const familyTree = await getFishFamilyTree(20);
console.log('Árbol genealógico:', familyTree);
```

**Cómo probar:**

```typescript
function FamilyTreeTest() {
  const { getFishFamilyTree } = useFish();
  const [fishId, setFishId] = useState('');
  const [tree, setTree] = useState([]);

  const handleGetTree = async () => {
    try {
      const data = await getFishFamilyTree(fishId);
      setTree(data);
      console.log('Árbol genealógico:', data);
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
      <button onClick={handleGetTree}>Ver Árbol Genealógico</button>

      {tree.length > 0 && (
        <div>
          <h3>Árbol Genealógico</h3>
          <pre>{JSON.stringify(tree, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

### `listFish(account, fishId, price)`

**Estado:** ✅ Activo

**Descripción:** Lista un pez para venta en el marketplace.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet
- `fishId` (BigNumberish): ID del pez a listar
- `price` (BigNumberish): Precio de venta

**Retorna:** Promise<models.Listing> con los datos del listing

**Ejemplo:**

```typescript
const { listFish } = useFish();

// Listar pez #10 por 100 tokens
const listing = await listFish(account, 10, 100);
console.log('Listing creado:', listing);
```

**Cómo probar:**

```typescript
function ListFishTest() {
  const account = useAccount();
  const { listFish } = useFish();
  const [fishId, setFishId] = useState('');
  const [price, setPrice] = useState('');

  const handleList = async () => {
    try {
      const listing = await listFish(account, fishId, price);
      console.log('Pez listado:', listing);
      alert('¡Pez listado para venta!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al listar pez');
    }
  };

  return (
    <div>
      <h3>Listar Pez para Venta</h3>
      <input
        value={fishId}
        onChange={(e) => setFishId(e.target.value)}
        placeholder="Fish ID"
        type="number"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        type="number"
      />
      <button onClick={handleList}>Listar</button>
    </div>
  );
}
```

---

### `purchaseFish(account, listingId)`

**Estado:** ✅ Activo

**Descripción:** Compra un pez listado en el marketplace.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet
- `listingId` (BigNumberish): ID del listing a comprar

**Retorna:** Promise con el resultado de la transacción de compra

**Ejemplo:**

```typescript
const { purchaseFish } = useFish();

// Comprar listing #5
await purchaseFish(account, 5);
console.log('Pez comprado exitosamente');
```

**Cómo probar:**

```typescript
function PurchaseFishTest() {
  const account = useAccount();
  const { purchaseFish } = useFish();
  const [listingId, setListingId] = useState('');

  const handlePurchase = async () => {
    try {
      await purchaseFish(account, listingId);
      alert('¡Pez comprado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al comprar pez');
    }
  };

  return (
    <div>
      <input
        value={listingId}
        onChange={(e) => setListingId(e.target.value)}
        placeholder="Listing ID"
        type="number"
      />
      <button onClick={handlePurchase}>Comprar</button>
    </div>
  );
}
```

---

## Resumen de Métodos

| Método             | Estado    | Tipo  | Categoría    |
| ------------------ | --------- | ----- | ------------ |
| createFishId       | ✅ Activo | Write | Creación     |
| getFish            | ✅ Activo | Query | Consulta     |
| newFish            | ✅ Activo | Write | Creación     |
| getPlayerFishes    | ✅ Activo | Query | Consulta     |
| getPlayerFishCount | ✅ Activo | Query | Consulta     |
| breedFishes        | ✅ Activo | Write | Reproducción |
| getFishOwner       | ✅ Activo | Query | Consulta     |
| getFishParents     | ✅ Activo | Query | Genealogía   |
| getFishOffspring   | ✅ Activo | Query | Genealogía   |
| getFishAncestor    | ✅ Activo | Query | Genealogía   |
| getFishFamilyTree  | ✅ Activo | Query | Genealogía   |
| listFish           | ✅ Activo | Write | Marketplace  |
| purchaseFish       | ✅ Activo | Write | Marketplace  |

## Flujo de Uso Completo

```typescript
// 1. Crear un nuevo pez
const fish = await newFish(account, aquariumId, species);

// 2. Consultar detalles
const fishData = await getFish(fish.id);

// 3. Reproducir peces
const offspring = await breedFishes(account, fish1.id, fish2.id);

// 4. Ver genealogía
const parents = await getFishParents(offspring);
const familyTree = await getFishFamilyTree(offspring);

// 5. Listar en marketplace
await listFish(account, fish.id, 100);

// 6. Otro jugador compra
await purchaseFish(buyerAccount, listingId);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useFish.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `CairoCustomEnum` para especies

## Notas Importantes

- Todos los métodos de escritura requieren una cuenta conectada
- Los IDs de especies deben usar `CairoCustomEnum`
- La reproducción requiere que ambos peces pertenezcan al mismo jugador
- El marketplace requiere aprobación de tokens para compras

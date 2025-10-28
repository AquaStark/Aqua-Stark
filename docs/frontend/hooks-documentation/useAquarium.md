# useAquarium Hook

## Descripción

Hook para interactuar con el contrato AquaStark y gestionar acuarios. Proporciona métodos para crear, consultar y modificar acuarios.

## Contratos Utilizados

- `AquaStark`: Operaciones principales de acuarios
- `Game`: Operaciones de agregar y mover entidades

## Métodos Disponibles

### `createAquariumId(account)`

**Estado:** ⚠️ DEPRECADO - No existe en contratos actuales

**Descripción:** Método legacy que lanza error. Usar `newAquarium` en su lugar.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario

**Retorna:** Error indicando que el método no existe

**Ejemplo:**

```typescript
// ❌ NO USAR - Este método está deprecado
const { createAquariumId } = useAquarium();
// Lanzará error
```

---

### `getAquarium(id)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un acuario por su ID.

**Parámetros:**

- `id` (BigNumberish): ID del acuario

**Retorna:** Promise con los datos del acuario

**Ejemplo:**

```typescript
const { getAquarium } = useAquarium();

// Obtener acuario con ID 1
const aquarium = await getAquarium(1);
console.log(aquarium);
```

**Cómo probar:**

```typescript
// En la consola del navegador o componente React
import { useAquarium } from '@/hooks/dojo';

function TestComponent() {
  const { getAquarium } = useAquarium();

  useEffect(() => {
    const test = async () => {
      try {
        const aquarium = await getAquarium(1);
        console.log('Acuario encontrado:', aquarium);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    test();
  }, []);

  return <div>Ver consola</div>;
}
```

---

### `newAquarium(account, owner, maxCapacity, maxDecorations)`

**Estado:** ✅ Activo

**Descripción:** Crea un nuevo acuario con propiedades definidas.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `owner` (string): Dirección del propietario del acuario
- `maxCapacity` (BigNumberish): Número máximo de peces
- `maxDecorations` (BigNumberish): Número máximo de decoraciones

**Retorna:** Promise con los datos del acuario creado

**Ejemplo:**

```typescript
const { newAquarium } = useAquarium();

// Crear nuevo acuario
const aquarium = await newAquarium(
  account,
  '0x123...', // Dirección del propietario
  10, // Máximo 10 peces
  5 // Máximo 5 decoraciones
);
```

**Cómo probar:**

```typescript
import { useAccount } from '@/hooks/dojo/usePlayer';
import { useAquarium } from '@/hooks/dojo';

function CreateAquariumTest() {
  const account = useAccount();
  const { newAquarium } = useAquarium();

  const handleCreate = async () => {
    try {
      const result = await newAquarium(
        account,
        account.address,
        10,
        5
      );
      console.log('Acuario creado:', result);
    } catch (error) {
      console.error('Error al crear acuario:', error);
    }
  };

  return <button onClick={handleCreate}>Crear Acuario</button>;
}
```

---

### `addFishToAquarium(account, fish, aquariumId)`

**Estado:** ✅ Activo (usa contrato Game)

**Descripción:** Agrega un pez a un acuario existente.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `fish` (models.Fish): Objeto del pez a agregar
- `aquariumId` (BigNumberish): ID del acuario destino

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { addFishToAquarium } = useAquarium();

const fish = {
  id: 1,
  species: SpeciesEnum.Goldfish,
  // ... otros campos del pez
};

await addFishToAquarium(account, fish, 1);
```

**Cómo probar:**

```typescript
import { useFish } from '@/hooks/dojo/useFish';
import { useAquarium } from '@/hooks/dojo';

function AddFishTest() {
  const account = useAccount();
  const { getFish } = useFish();
  const { addFishToAquarium } = useAquarium();

  const handleAdd = async () => {
    try {
      // Primero obtener el pez
      const fish = await getFish(1);

      // Agregar al acuario
      await addFishToAquarium(account, fish, 1);
      console.log('Pez agregado exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleAdd}>Agregar Pez</button>;
}
```

---

### `addDecorationToAquarium(account, decoration, aquariumId)`

**Estado:** ✅ Activo (usa contrato Game)

**Descripción:** Agrega una decoración a un acuario existente.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `decoration` (models.Decoration): Objeto de la decoración
- `aquariumId` (BigNumberish): ID del acuario destino

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { addDecorationToAquarium } = useAquarium();

const decoration = {
  id: 1,
  name: 'Castillo',
  // ... otros campos
};

await addDecorationToAquarium(account, decoration, 1);
```

---

### `getPlayerAquariums(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los acuarios propiedad de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise con array de acuarios

**Ejemplo:**

```typescript
const { getPlayerAquariums } = useAquarium();

const aquariums = await getPlayerAquariums('0x123...');
console.log(`Jugador tiene ${aquariums.length} acuarios`);
```

**Cómo probar:**

```typescript
function MyAquariumsTest() {
  const account = useAccount();
  const { getPlayerAquariums } = useAquarium();
  const [aquariums, setAquariums] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        const result = await getPlayerAquariums(account.address);
        setAquariums(result);
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <h3>Mis Acuarios ({aquariums.length})</h3>
      <ul>
        {aquariums.map(a => <li key={a.id}>Acuario #{a.id}</li>)}
      </ul>
    </div>
  );
}
```

---

### `getPlayerAquariumCount(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el número total de acuarios de un jugador.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise<number> con el contador

**Ejemplo:**

```typescript
const { getPlayerAquariumCount } = useAquarium();

const count = await getPlayerAquariumCount('0x123...');
console.log(`Tienes ${count} acuarios`);
```

---

### `moveFishToAquarium(account, fishId, fromAquariumId, toAquariumId)`

**Estado:** ✅ Activo (usa contrato Game)

**Descripción:** Mueve un pez entre dos acuarios.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `fishId` (BigNumberish): ID del pez
- `fromAquariumId` (BigNumberish): ID del acuario origen
- `toAquariumId` (BigNumberish): ID del acuario destino

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { moveFishToAquarium } = useAquarium();

// Mover pez #5 del acuario 1 al acuario 2
await moveFishToAquarium(account, 5, 1, 2);
```

**Cómo probar:**

```typescript
function MoveFishTest() {
  const account = useAccount();
  const { moveFishToAquarium } = useAquarium();

  const handleMove = async () => {
    try {
      await moveFishToAquarium(account, 5, 1, 2);
      console.log('Pez movido exitosamente');
    } catch (error) {
      console.error('Error al mover pez:', error);
    }
  };

  return <button onClick={handleMove}>Mover Pez</button>;
}
```

---

### `moveDecorationToAquarium(account, decorationId, fromAquariumId, toAquariumId)`

**Estado:** ✅ Activo (usa contrato Game)

**Descripción:** Mueve una decoración entre dos acuarios.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `decorationId` (BigNumberish): ID de la decoración
- `fromAquariumId` (BigNumberish): ID del acuario origen
- `toAquariumId` (BigNumberish): ID del acuario destino

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { moveDecorationToAquarium } = useAquarium();

// Mover decoración #3 del acuario 1 al acuario 2
await moveDecorationToAquarium(account, 3, 1, 2);
```

---

### `getAquariumOwner(aquariumId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene la dirección del propietario de un acuario.

**Parámetros:**

- `aquariumId` (BigNumberish): ID del acuario

**Retorna:** Promise<string> con la dirección del propietario

**Ejemplo:**

```typescript
const { getAquariumOwner } = useAquarium();

const owner = await getAquariumOwner(1);
console.log(`Propietario: ${owner}`);
```

---

## Resumen de Métodos

| Método                   | Estado       | Contrato  | Tipo  |
| ------------------------ | ------------ | --------- | ----- |
| createAquariumId         | ⚠️ Deprecado | -         | -     |
| getAquarium              | ✅ Activo    | AquaStark | Query |
| newAquarium              | ✅ Activo    | AquaStark | Write |
| addFishToAquarium        | ✅ Activo    | Game      | Write |
| addDecorationToAquarium  | ✅ Activo    | Game      | Write |
| getPlayerAquariums       | ✅ Activo    | AquaStark | Query |
| getPlayerAquariumCount   | ✅ Activo    | AquaStark | Query |
| moveFishToAquarium       | ✅ Activo    | Game      | Write |
| moveDecorationToAquarium | ✅ Activo    | Game      | Write |
| getAquariumOwner         | ✅ Activo    | AquaStark | Query |

## Ubicación del Archivo

`/client/src/hooks/dojo/useAquarium.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/typescript/models.gen`
- `@/types`

## Notas Importantes

- Los métodos que usan el contrato `Game` requieren que el cliente Dojo tenga acceso a ese contrato
- El método `createAquariumId` está deprecado y lanzará un error
- Algunos métodos requieren transacciones en blockchain (Write) y otros son solo consultas (Query)

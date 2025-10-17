# useShopCatalog Hook

## Descripción

Hook para gestionar el catálogo de la tienda. Proporciona métodos para agregar, actualizar y consultar items de la tienda.

## Contratos Utilizados

- `ShopCatalog`: Todas las operaciones de tienda

## ⚠️ Nota Importante

Existen dos implementaciones:

- `/hooks/dojo/useShop.ts` (usa snake_case)
- `/hooks/dojo/useAdditionalContracts.ts` → `useShopCatalog` (usa camelCase)

Esta documentación cubre ambas versiones.

## Métodos Disponibles

### `addNewItem(account, price, stock, description)`

**Snake_case:** `add_new_item`

**Estado:** ✅ Activo

**Descripción:** Agrega un nuevo item al catálogo de la tienda.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `price` (BigNumberish): Precio del item
- `stock` (BigNumberish): Cantidad en stock
- `description` (string): Descripción del item

**Retorna:** Promise<BigNumberish> con el ID del nuevo item

**Ejemplo:**

```typescript
const { addNewItem } = useShopCatalog();

const itemId = await addNewItem(
  account,
  100, // Precio
  50, // Stock inicial
  'Decoración de castillo' // Descripción
);
console.log(`Item creado con ID: ${itemId}`);
```

**Cómo probar:**

```typescript
function AddItemTest() {
  const account = useAccount();
  const { addNewItem } = useShopCatalog();
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const itemId = await addNewItem(
        account,
        price,
        stock,
        description
      );
      alert(`Item creado con ID: ${itemId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Agregar Item a Tienda</h3>
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
      <input
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        type="number"
      />
      <button onClick={handleAdd}>Agregar Item</button>
    </div>
  );
}
```

---

### `updateItem(account, id, price, stock, description)`

**Snake_case:** `update_item`

**Estado:** ✅ Activo

**Descripción:** Actualiza un item existente en el catálogo.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `id` (BigNumberish): ID del item a actualizar
- `price` (BigNumberish): Nuevo precio
- `stock` (BigNumberish): Nuevo stock
- `description` (string): Nueva descripción

**Retorna:** Promise con el resultado de la transacción

**Ejemplo:**

```typescript
const { updateItem } = useShopCatalog();

await updateItem(
  account,
  1, // Item ID
  150, // Nuevo precio
  40, // Nuevo stock
  'Castillo actualizado' // Nueva descripción
);
```

**Cómo probar:**

```typescript
function UpdateItemTest() {
  const account = useAccount();
  const { updateItem, getItem } = useShopCatalog();
  const [itemId, setItemId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

  const loadItem = async () => {
    try {
      const item = await getItem(itemId);
      setPrice(item.price);
      setStock(item.stock);
      setDescription(item.description);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateItem(account, itemId, price, stock, description);
      alert('Item actualizado');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Actualizar Item</h3>
      <input
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        placeholder="Item ID"
        type="number"
      />
      <button onClick={loadItem}>Cargar</button>

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
      <input
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        type="number"
      />
      <button onClick={handleUpdate}>Actualizar</button>
    </div>
  );
}
```

---

### `getItem(id)`

**Snake_case:** `get_item`

**Estado:** ✅ Activo

**Descripción:** Obtiene los detalles de un item por su ID.

**Parámetros:**

- `id` (BigNumberish): ID del item

**Retorna:** Promise<models.ShopItemModel> con los datos del item

**Ejemplo:**

```typescript
const { getItem } = useShopCatalog();

const item = await getItem(1);
console.log('Item:', item);
```

---

### `getAllItems()`

**Snake_case:** `get_all_items`

**Estado:** ✅ Activo

**Descripción:** Obtiene todos los items del catálogo.

**Parámetros:** Ninguno

**Retorna:** Promise<models.ShopItemModel[]> con array de items

**Ejemplo:**

```typescript
const { getAllItems } = useShopCatalog();

const items = await getAllItems();
console.log(`${items.length} items en catálogo`);
```

**Cómo probar:**

```typescript
function ShopCatalogTest() {
  const { getAllItems } = useShopCatalog();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;

  return (
    <div>
      <h3>Catálogo de Tienda ({items.length})</h3>
      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h4>{item.description}</h4>
            <p>Precio: {item.price} tokens</p>
            <p>Stock: {item.stock} unidades</p>
            <button>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Resumen de Métodos

| Método      | Estado    | Tipo  | Requiere Cuenta |
| ----------- | --------- | ----- | --------------- |
| addNewItem  | ✅ Activo | Write | Sí              |
| updateItem  | ✅ Activo | Write | Sí              |
| getItem     | ✅ Activo | Query | No              |
| getAllItems | ✅ Activo | Query | No              |

## Flujo Típico de Uso

```typescript
// 1. Admin agrega items al catálogo
const itemId = await addNewItem(account, 100, 50, 'Decoración');

// 2. Usuarios ven el catálogo
const items = await getAllItems();

// 3. Ver detalles de un item
const item = await getItem(itemId);

// 4. Admin actualiza el item
await updateItem(account, itemId, 120, 45, 'Decoración actualizada');
```

## Ubicación de Archivos

- `/client/src/hooks/dojo/useShop.ts`
- `/client/src/hooks/dojo/useAdditionalContracts.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`

## Versiones del Hook

### Versión 1: useShop.ts (snake_case)

```typescript
import { useShopCatalog } from '@/hooks/dojo/useShop';
// Métodos: add_new_item, update_item, get_item, get_all_items
```

### Versión 2: useAdditionalContracts.ts (camelCase)

```typescript
import { useShopCatalog } from '@/hooks/dojo/useAdditionalContracts';
// Métodos: addNewItem, updateItem, getItem, getAllItems
```

## Notas Importantes

- Solo usuarios autorizados pueden agregar/actualizar items
- El stock se reduce automáticamente con las compras
- Las descripciones pueden requerir codificación según el contrato
- Se recomienda usar la versión camelCase para consistencia

# usePlayer Hook

## Descripción

Hook para gestionar operaciones relacionadas con jugadores en el ecosistema AquaStark. Proporciona funciones para registrar, obtener información, verificar jugadores y manejar nombres de usuario.

## Contratos Utilizados

- `AquaStark`: Todas las operaciones de jugadores

## Métodos Disponibles

### `registerPlayer(account, username)`

**Estado:** ✅ Activo

**Descripción:** Registra un nuevo jugador con un nombre de usuario.

**Parámetros:**

- `account` (AccountInterface | undefined): Instancia de la cuenta StarkNet
- `username` (string): Nombre de usuario elegido para el jugador

**Retorna:** Promise con el resultado de la transacción de registro

**Errores:**

- Lanza error si el username es demasiado largo
- Lanza error si la transacción falla

**Ejemplo:**

```typescript
const { registerPlayer } = usePlayer();

try {
  await registerPlayer(account, 'MiUsuario123');
  console.log('Jugador registrado exitosamente');
} catch (error) {
  console.error('Error al registrar:', error);
}
```

**Cómo probar:**

```typescript
import { usePlayer } from '@/hooks/dojo';
import { useAccount } from '@starknet-react/core';

function RegisterPlayerTest() {
  const account = useAccount();
  const { registerPlayer } = usePlayer();
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    try {
      const result = await registerPlayer(account, username);
      console.log('Registro exitoso:', result);
      alert('¡Jugador registrado!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar: ' + error.message);
    }
  };

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Ingresa tu username"
      />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
}
```

---

### `getPlayer(address)`

**Estado:** ✅ Activo

**Descripción:** Obtiene los datos de un jugador por su dirección.

**Parámetros:**

- `address` (string): Dirección de la wallet del jugador

**Retorna:** Promise con los datos del jugador

**Errores:**

- Muestra alerta si el cliente no está disponible
- Lanza error si la consulta falla

**Ejemplo:**

```typescript
const { getPlayer } = usePlayer();

const player = await getPlayer('0x123abc...');
console.log('Datos del jugador:', player);
```

**Cómo probar:**

```typescript
function PlayerInfoTest() {
  const { getPlayer } = usePlayer();
  const [playerData, setPlayerData] = useState(null);
  const [address, setAddress] = useState('');

  const handleSearch = async () => {
    try {
      const data = await getPlayer(address);
      setPlayerData(data);
      console.log('Jugador encontrado:', data);
    } catch (error) {
      console.error('Error al buscar jugador:', error);
    }
  };

  return (
    <div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="0x..."
      />
      <button onClick={handleSearch}>Buscar</button>

      {playerData && (
        <div>
          <h3>Información del Jugador</h3>
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

### `getUsernameFromAddress(address)`

**Estado:** ✅ Activo

**Descripción:** Obtiene el nombre de usuario asociado a una dirección de jugador.

**Parámetros:**

- `address` (string): Dirección de la wallet del jugador

**Retorna:** Promise<string> con el nombre de usuario

**Errores:**

- Lanza error si la consulta falla

**Ejemplo:**

```typescript
const { getUsernameFromAddress } = usePlayer();

const username = await getUsernameFromAddress('0x123abc...');
console.log(`Username: ${username}`);
```

**Cómo probar:**

```typescript
function UsernameDisplayTest() {
  const { getUsernameFromAddress } = usePlayer();
  const [username, setUsername] = useState('');
  const account = useAccount();

  useEffect(() => {
    const load = async () => {
      if (account?.address) {
        try {
          const name = await getUsernameFromAddress(account.address);
          setUsername(name);
        } catch (error) {
          console.error('Error obteniendo username:', error);
        }
      }
    };
    load();
  }, [account]);

  return (
    <div>
      <p>Tu username: {username || 'Cargando...'}</p>
    </div>
  );
}
```

---

### `createNewPlayerId(account)`

**Estado:** ✅ Activo

**Descripción:** Crea un nuevo ID único de jugador.

**Parámetros:**

- `account` (Account | AccountInterface): Instancia de la cuenta StarkNet

**Retorna:** Promise<BigNumberish> con el ID del jugador creado

**Errores:**

- Retorna null si falla la creación
- Log en consola del error

**Ejemplo:**

```typescript
const { createNewPlayerId } = usePlayer();

const playerId = await createNewPlayerId(account);
if (playerId) {
  console.log(`Nuevo Player ID: ${playerId}`);
} else {
  console.log('Error al crear Player ID');
}
```

**Cómo probar:**

```typescript
function CreatePlayerIdTest() {
  const account = useAccount();
  const { createNewPlayerId } = usePlayer();

  const handleCreate = async () => {
    try {
      const id = await createNewPlayerId(account);
      if (id) {
        console.log('Player ID creado:', id);
        alert(`Nuevo Player ID: ${id}`);
      } else {
        alert('Error al crear Player ID');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleCreate}>Crear Nuevo Player ID</button>
  );
}
```

---

### `isVerified(playerAddress)`

**Estado:** ✅ Activo

**Descripción:** Verifica si un jugador está verificado en el sistema.

**Parámetros:**

- `playerAddress` (string): Dirección del jugador

**Retorna:** Promise<boolean> - true si está verificado, false si no

**Errores:**

- Lanza error si la consulta falla

**Ejemplo:**

```typescript
const { isVerified } = usePlayer();

const verified = await isVerified('0x123abc...');
if (verified) {
  console.log('Jugador verificado ✓');
} else {
  console.log('Jugador no verificado ✗');
}
```

**Cómo probar:**

```typescript
function VerificationStatusTest() {
  const account = useAccount();
  const { isVerified } = usePlayer();
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (account?.address) {
        try {
          const status = await isVerified(account.address);
          setVerificationStatus(status);
        } catch (error) {
          console.error('Error verificando estado:', error);
        }
      }
    };
    check();
  }, [account]);

  return (
    <div>
      {verificationStatus === null ? (
        <p>Verificando...</p>
      ) : verificationStatus ? (
        <p>✓ Cuenta verificada</p>
      ) : (
        <p>✗ Cuenta no verificada</p>
      )}
    </div>
  );
}
```

---

## Resumen de Métodos

| Método                 | Estado    | Tipo  | Requiere Cuenta |
| ---------------------- | --------- | ----- | --------------- |
| registerPlayer         | ✅ Activo | Write | Sí              |
| getPlayer              | ✅ Activo | Query | No              |
| getUsernameFromAddress | ✅ Activo | Query | No              |
| createNewPlayerId      | ✅ Activo | Write | Sí              |
| isVerified             | ✅ Activo | Query | No              |

## Flujo Típico de Uso

```typescript
// 1. Usuario conecta su wallet
const account = useAccount();

// 2. Verificar si ya está registrado
const player = await getPlayer(account.address);

if (!player) {
  // 3. Registrar nuevo jugador
  await registerPlayer(account, 'MiNombreDeUsuario');
}

// 4. Verificar estado
const isPlayerVerified = await isVerified(account.address);

// 5. Obtener username
const username = await getUsernameFromAddress(account.address);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/usePlayer.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/utils/starknet` (stringToFelt)

## Notas Importantes

- `registerPlayer` convierte el username a felt usando `stringToFelt`
- Si el username es muy largo, lanzará un error
- `getPlayer` usa blockId 'latest' para obtener datos actualizados
- `createNewPlayerId` retorna null en lugar de lanzar error si falla
- Todos los métodos de query (get, is) no requieren firma de transacciones
- Los métodos write (register, create) requieren una cuenta conectada y firma

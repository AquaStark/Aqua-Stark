# useSessionEnhanced Hook

## Descripción

Hook para gestionar sesiones de usuario en el sistema. Proporciona métodos para crear, renovar, revocar y validar sesiones, así como consultar información y estado de sesiones.

## Contratos Utilizados

- `session`: Todas las operaciones de sesión

## Métodos Disponibles

### `createSessionKey(account, duration, maxTransactions, sessionType)`

**Estado:** ✅ Activo

**Descripción:** Crea una nueva clave de sesión para el usuario.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `duration` (BigNumberish): Duración de la sesión (en segundos)
- `maxTransactions` (BigNumberish): Número máximo de transacciones permitidas
- `sessionType` (BigNumberish): Tipo de sesión

**Retorna:** Promise con el resultado de la creación

**Ejemplo:**

```typescript
const { createSessionKey } = useSessionEnhanced();

// Crear sesión de 24 horas con máximo 100 transacciones
await createSessionKey(
  account,
  86400, // 24 horas
  100, // Máx transacciones
  1 // Tipo de sesión
);
```

**Cómo probar:**

```typescript
function CreateSessionTest() {
  const account = useAccount();
  const { createSessionKey } = useSessionEnhanced();
  const [duration, setDuration] = useState(24);
  const [maxTx, setMaxTx] = useState(100);

  const handleCreate = async () => {
    try {
      await createSessionKey(
        account,
        duration * 3600,
        maxTx,
        1
      );
      alert('Sesión creada exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Crear Sesión</h3>
      <input
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duración (horas)"
        type="number"
      />
      <input
        value={maxTx}
        onChange={(e) => setMaxTx(e.target.value)}
        placeholder="Máx transacciones"
        type="number"
      />
      <button onClick={handleCreate}>Crear Sesión</button>
    </div>
  );
}
```

---

### `renewSession(account, sessionId, newDuration, newMaxTx)`

**Estado:** ✅ Activo

**Descripción:** Renueva una sesión existente con nueva duración y límites.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `sessionId` (BigNumberish): ID de la sesión a renovar
- `newDuration` (BigNumberish): Nueva duración
- `newMaxTx` (BigNumberish): Nuevo límite de transacciones

**Retorna:** Promise con el resultado de la renovación

**Ejemplo:**

```typescript
const { renewSession } = useSessionEnhanced();

// Renovar sesión por 48 horas más
await renewSession(account, sessionId, 172800, 200);
```

---

### `revokeSession(account, sessionId)`

**Estado:** ✅ Activo

**Descripción:** Revoca una sesión activa.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `sessionId` (BigNumberish): ID de la sesión a revocar

**Retorna:** Promise con el resultado de la revocación

**Ejemplo:**

```typescript
const { revokeSession } = useSessionEnhanced();

await revokeSession(account, sessionId);
console.log('Sesión revocada');
```

---

### `validateSession(account, sessionId)`

**Estado:** ✅ Activo

**Descripción:** Valida si una sesión está activa y es válida.

**Parámetros:**

- `account` (Account | AccountInterface): Cuenta del usuario
- `sessionId` (BigNumberish): ID de la sesión a validar

**Retorna:** Promise con el resultado de la validación

**Ejemplo:**

```typescript
const { validateSession } = useSessionEnhanced();

const isValid = await validateSession(account, sessionId);
if (isValid) {
  console.log('Sesión válida');
} else {
  console.log('Sesión inválida o expirada');
}
```

**Cómo probar:**

```typescript
function ValidateSessionTest() {
  const account = useAccount();
  const { validateSession } = useSessionEnhanced();
  const [sessionId, setSessionId] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleValidate = async () => {
    try {
      const result = await validateSession(account, sessionId);
      setIsValid(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Session ID"
        type="number"
      />
      <button onClick={handleValidate}>Validar</button>

      {isValid !== null && (
        <p>{isValid ? '✅ Sesión válida' : '❌ Sesión inválida'}</p>
      )}
    </div>
  );
}
```

---

### `getSessionInfo(sessionId)`

**Estado:** ✅ Activo

**Descripción:** Obtiene información completa de una sesión.

**Parámetros:**

- `sessionId` (BigNumberish): ID de la sesión

**Retorna:** Promise con los datos de la sesión

**Ejemplo:**

```typescript
const { getSessionInfo } = useSessionEnhanced();

const sessionInfo = await getSessionInfo(sessionId);
console.log('Info de sesión:', sessionInfo);
```

---

### `calculateRemainingTransactions(sessionId)`

**Estado:** ✅ Activo

**Descripción:** Calcula las transacciones restantes en la sesión.

**Parámetros:**

- `sessionId` (BigNumberish): ID de la sesión

**Retorna:** Promise con el número de transacciones restantes

**Ejemplo:**

```typescript
const { calculateRemainingTransactions } = useSessionEnhanced();

const remaining = await calculateRemainingTransactions(sessionId);
console.log(`Quedan ${remaining} transacciones`);
```

---

### `calculateSessionTimeRemaining(sessionId)`

**Estado:** ✅ Activo

**Descripción:** Calcula el tiempo restante de la sesión.

**Parámetros:**

- `sessionId` (BigNumberish): ID de la sesión

**Retorna:** Promise con el tiempo restante (en segundos)

**Ejemplo:**

```typescript
const { calculateSessionTimeRemaining } = useSessionEnhanced();

const timeLeft = await calculateSessionTimeRemaining(sessionId);
const hoursLeft = timeLeft / 3600;
console.log(`Quedan ${hoursLeft.toFixed(2)} horas`);
```

**Cómo probar:**

```typescript
function SessionStatusTest() {
  const { calculateSessionTimeRemaining, calculateRemainingTransactions } = useSessionEnhanced();
  const [sessionId, setSessionId] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [txLeft, setTxLeft] = useState(null);

  const handleCheck = async () => {
    try {
      const time = await calculateSessionTimeRemaining(sessionId);
      const tx = await calculateRemainingTransactions(sessionId);
      setTimeLeft(time);
      setTxLeft(tx);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Session ID"
        type="number"
      />
      <button onClick={handleCheck}>Verificar Estado</button>

      {timeLeft !== null && (
        <div>
          <p>Tiempo restante: {(timeLeft / 3600).toFixed(2)} horas</p>
          <p>Transacciones restantes: {txLeft}</p>
        </div>
      )}
    </div>
  );
}
```

---

### `checkSessionNeedsRenewal(sessionId)`

**Estado:** ✅ Activo

**Descripción:** Verifica si una sesión necesita ser renovada.

**Parámetros:**

- `sessionId` (BigNumberish): ID de la sesión

**Retorna:** Promise<boolean> - true si necesita renovación

**Ejemplo:**

```typescript
const { checkSessionNeedsRenewal } = useSessionEnhanced();

const needsRenewal = await checkSessionNeedsRenewal(sessionId);
if (needsRenewal) {
  console.log('⚠️ La sesión necesita renovación');
}
```

---

## Resumen de Métodos

| Método                         | Estado    | Tipo  | Categoría  |
| ------------------------------ | --------- | ----- | ---------- |
| createSessionKey               | ✅ Activo | Write | Gestión    |
| renewSession                   | ✅ Activo | Write | Gestión    |
| revokeSession                  | ✅ Activo | Write | Gestión    |
| validateSession                | ✅ Activo | Write | Validación |
| getSessionInfo                 | ✅ Activo | Query | Consulta   |
| calculateRemainingTransactions | ✅ Activo | Query | Estado     |
| calculateSessionTimeRemaining  | ✅ Activo | Query | Estado     |
| checkSessionNeedsRenewal       | ✅ Activo | Query | Validación |

## Flujo Completo de Sesión

```typescript
// 1. Crear sesión
await createSessionKey(account, 86400, 100, 1);

// 2. Obtener info de sesión
const sessionInfo = await getSessionInfo(sessionId);

// 3. Verificar estado periódicamente
const timeLeft = await calculateSessionTimeRemaining(sessionId);
const txLeft = await calculateRemainingTransactions(sessionId);

// 4. Verificar si necesita renovación
const needsRenewal = await checkSessionNeedsRenewal(sessionId);
if (needsRenewal) {
  await renewSession(account, sessionId, 86400, 100);
}

// 5. Validar antes de usar
const isValid = await validateSession(account, sessionId);

// 6. Revocar cuando ya no se necesite
await revokeSession(account, sessionId);
```

## Ubicación del Archivo

`/client/src/hooks/dojo/useSessionEnhanced.ts`

## Dependencias

- `@dojoengine/sdk/react`
- `starknet`
- `@/types`

## Notas Importantes

- Las sesiones tienen límite de tiempo y transacciones
- Una sesión puede renovarse antes de expirar
- Las transacciones se cuentan automáticamente
- Es recomendable validar la sesión antes de operaciones críticas
- Revocar sesiones no utilizadas mejora la seguridad

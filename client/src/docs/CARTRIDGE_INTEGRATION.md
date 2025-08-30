# 🎮 Integración de Cartridge Controller

## Descripción

Esta implementación proporciona una integración completa de **Cartridge Controller** con soporte para:

- ✅ **Login Social**: Google, Discord
- ✅ **WalletConnect**: Conectar wallets externas
- ✅ **Wallets nativas**: Argent X, Braavos, etc.
- ✅ **Passkey**: Autenticación biométrica
- ✅ **Session Keys**: Transacciones automáticas sin gas
- ✅ **Gaming optimizado**: UX específica para juegos

## 🚀 Características

### Login Social
- **Google OAuth**: Login directo con cuenta de Google
- **Discord OAuth**: Login directo con cuenta de Discord
- **Registro automático**: Creación de cuenta al primer login
- **Perfiles de usuario**: Información de avatar y username

### WalletConnect
- **Wallets externas**: MetaMask, Rabby, etc.
- **QR Code**: Conexión móvil
- **Multi-chain**: Soporte para múltiples redes

### Gaming Features
- **Session Keys**: Transacciones automáticas sin popups
- **Gasless transactions**: Sin costos de gas para acciones del juego
- **Políticas de sesión**: Configuración granular de permisos
- **Auto-renewal**: Renovación automática de sesiones

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── ui/
│       ├── connect-button.tsx          # Botón principal de conexión
│       ├── cartridge-demo.tsx          # Componente de demostración
│       └── walletConnectModal.tsx      # Modal de conexión actualizado
├── hooks/
│   └── use-cartridge-session.ts        # Hook para manejo de sesiones
├── providers/
│   └── StarknetProvider.tsx            # Configuración de Cartridge
├── types/
│   └── cartridge.ts                    # Tipos TypeScript
└── config/
    └── policies.ts                     # Políticas de sesión del juego
```

## 🔧 Configuración

### 1. StarknetProvider.tsx

```typescript
import ControllerConnector from '@cartridge/connector/controller';

const controller = new ControllerConnector({
  policies: GAME_POLICIES,
  theme: 'aqua-stark',
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  chains: [
    { rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia' },
    { rpcUrl: 'https://api.cartridge.gg/x/starknet/mainnet' },
  ],
  namespace: 'aqua_stark',
  slot: 'aqua5',
  colorMode: 'dark',
});
```

### 2. Políticas de Sesión (policies.ts)

```typescript
export const GAME_POLICIES: SessionPolicies = {
  contracts: {
    '0x...': {
      name: 'Aqua Stark Game World',
      methods: [
        {
          name: 'Feed Fish',
          entrypoint: 'feed_fish',
          description: 'Alimentar peces en el acuario',
        },
        // ... más métodos
      ],
    },
  },
};
```

## 🎯 Uso

### ConnectButton Component

```typescript
import { ConnectButton } from '@/components/ui/connect-button';

function MyComponent() {
  return (
    <ConnectButton 
      size="lg" 
      variant="default"
      onConnect={(account) => console.log('Conectado:', account)}
    />
  );
}
```

### useCartridgeSession Hook

```typescript
import { useCartridgeSession } from '@/hooks/use-cartridge-session';

function MyComponent() {
  const {
    isConnected,
    address,
    username,
    sessionType,
    connect,
    disconnect,
  } = useCartridgeSession();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Conectado: {username || address}</p>
          <p>Tipo: {sessionType}</p>
          <button onClick={disconnect}>Desconectar</button>
        </div>
      ) : (
        <button onClick={connect}>Conectar</button>
      )}
    </div>
  );
}
```

## 🔄 Flujo de Conexión

1. **Usuario hace click en "Conectar Wallet / Iniciar Sesión"**
2. **Se abre el modal de Cartridge** con opciones:
   - 🔐 **Google** - Login con cuenta de Google
   - 🎮 **Discord** - Login con cuenta de Discord
   - 🔗 **WalletConnect** - Conectar wallets externas
   - 🦊 **Wallets nativas** - Argent X, Braavos, etc.
   - 🔑 **Passkey** - Autenticación biométrica

3. **Usuario selecciona método de login**
4. **Cartridge maneja la autenticación**
5. **Se crea/recupera la cuenta del usuario**
6. **Se establece la sesión con session keys**
7. **Usuario puede jugar sin popups de transacciones**

## 🎮 Gaming Features

### Session Keys Automáticas
- Las transacciones del juego se ejecutan automáticamente
- No se requieren confirmaciones del usuario
- Optimizado para UX de gaming

### Transacciones Sin Gas
- Las acciones del juego no requieren gas
- Cartridge maneja los costos de transacción
- Experiencia fluida para el jugador

### Políticas Granulares
- Configuración específica por contrato
- Métodos permitidos por sesión
- Seguridad y control total

## 🛠️ Desarrollo

### Agregar Nuevos Métodos

Para agregar nuevos métodos a las políticas de sesión:

```typescript
// En policies.ts
export const GAME_POLICIES: SessionPolicies = {
  contracts: {
    '0x...': {
      name: 'Mi Contrato',
      methods: [
        {
          name: 'Nuevo Método',
          entrypoint: 'nuevo_metodo',
          description: 'Descripción del método',
        },
      ],
    },
  },
};
```

### Manejo de Errores

```typescript
const { connect } = useCartridgeSession();

try {
  await connect();
} catch (error) {
  if (error.code === 'USER_REJECTED') {
    // Usuario canceló la conexión
  } else if (error.code === 'ACCOUNT_NOT_FOUND') {
    // Usuario no tiene cuenta
  }
}
```

## 🔍 Debugging

### Logs de Desarrollo

```typescript
// Habilitar logs detallados
console.log('Cartridge Controller:', controller);
console.log('Account:', account);
console.log('Session Type:', sessionType);
```

### Verificar Conexión

```typescript
const { isConnected, address } = useCartridgeSession();

useEffect(() => {
  if (isConnected && address) {
    console.log('Usuario conectado:', address);
  }
}, [isConnected, address]);
```

## 📱 Compatibilidad

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: iOS Safari, Chrome Mobile
- ✅ **Wallets**: Argent X, Braavos, MetaMask (vía WalletConnect)
- ✅ **Social**: Google, Discord
- ✅ **Biometric**: Passkey, Touch ID, Face ID

## 🚨 Troubleshooting

### Error: "Cartridge Controller no está disponible"
- Verificar que `@cartridge/connector` esté instalado
- Comprobar configuración en `StarknetProvider.tsx`

### Error: "Error de cuenta"
- Usuario no tiene cuenta en Cartridge
- Guiar al usuario al registro

### Error: "Sesión expirada"
- La sesión ha expirado
- Usuario debe reconectarse

### Modal no se abre
- Verificar que `connect({ connector: controller })` se ejecute
- Comprobar que no haya errores en la consola

## 🔗 Recursos

- [Documentación oficial de Cartridge](https://docs.cartridge.gg)
- [Starknet React Core](https://github.com/apibara/starknet-react)
- [Dojo Engine](https://book.dojoengine.org)

## 📄 Licencia

Esta implementación está bajo la misma licencia que el proyecto principal.

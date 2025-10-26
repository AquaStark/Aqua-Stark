# 🌊 Aqua Stark Frontend - Environment Setup

## 📋 Variables de Entorno

El frontend está configurado para funcionar con diferentes backends usando variables de entorno.

### 🔧 Configuración Rápida

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env.local
   ```

2. **Edita `.env.local` con tu configuración:**
   ```env
   # Para backend local
   VITE_API_URL=http://localhost:3001
   
   # Para backend remoto (Vercel)
   VITE_API_URL=https://tu-backend-url.vercel.app
   ```

### 📝 Variables Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| `VITE_API_URL` | URL del backend | `http://localhost:3001` | `https://api.aqua-stark.vercel.app` |
| `VITE_BACKEND_INTEGRATION` | Habilitar integración backend | `true` | `false` |
| `VITE_PLAYER_VALIDATION` | Habilitar validación de jugadores | `true` | `false` |
| `VITE_REALTIME_UPDATES` | Habilitar actualizaciones en tiempo real | `true` | `false` |
| `VITE_API_TIMEOUT` | Timeout de API (ms) | `10000` | `15000` |
| `VITE_DEBUG` | Modo debug | `false` | `true` |

### 🚀 Configuraciones Comunes

#### **Desarrollo Local**
```env
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true
VITE_BACKEND_INTEGRATION=true
VITE_REALTIME_UPDATES=true
```

#### **Producción con Backend Remoto**
```env
VITE_API_URL=https://aqua-stark-backend.vercel.app
VITE_DEBUG=false
VITE_BACKEND_INTEGRATION=true
VITE_REALTIME_UPDATES=true
```

#### **Solo Frontend (Sin Backend)**
```env
VITE_BACKEND_INTEGRATION=false
VITE_PLAYER_VALIDATION=false
VITE_REALTIME_UPDATES=false
```

### 🔄 Cambiar Entre Entornos

#### **Opción 1: Archivo .env.local**
```bash
# Para local
echo "VITE_API_URL=http://localhost:3001" > .env.local

# Para remoto
echo "VITE_API_URL=https://tu-backend.vercel.app" > .env.local
```

#### **Opción 2: Variables de Sistema**
```bash
# Para local
export VITE_API_URL=http://localhost:3001
npm run dev

# Para remoto
export VITE_API_URL=https://tu-backend.vercel.app
npm run dev
```

### 🐛 Debug y Verificación

El frontend mostrará automáticamente la configuración actual en la consola del navegador cuando `VITE_DEBUG=true`.

También puedes usar los componentes de debug:
```tsx
import { BackendStatus } from '@/components';

// Mostrar tipo de backend
<BackendStatus showDetails={true} />
```

### 📱 Componentes de Estado

```tsx
import { BackendStatus, BackendConnectionStatus } from '@/components';

// Mostrar configuración del backend
<BackendStatus />

// Mostrar estado de conexión
<BackendConnectionStatus 
  isConnected={true} 
  isConnecting={false} 
  error={null} 
/>
```

### ⚠️ Notas Importantes

1. **Reinicia el servidor** después de cambiar variables de entorno
2. **El archivo `.env.local`** tiene prioridad sobre `.env`
3. **Variables de sistema** tienen prioridad sobre archivos
4. **En producción**, configura las variables en Vercel dashboard

### 🔗 URLs de Ejemplo

- **Local**: `http://localhost:3001`
- **Vercel**: `https://aqua-stark-backend.vercel.app`
- **Railway**: `https://aqua-stark-backend.railway.app`
- **Render**: `https://aqua-stark-backend.onrender.com`

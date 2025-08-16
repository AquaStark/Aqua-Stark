# 🌊 Aqua Stark Backend

Backend API para el juego on-chain de mascotas acuáticas Aqua Stark. Maneja estados dinámicos off-chain mientras mantiene la propiedad real en Starknet.

## 🏗️ Arquitectura

### **On-chain (Starknet/Dojo)**
- **Propiedad real** de activos (NFTs)
- **Identificadores únicos** (player_id, fish_id, aquarium_id, decoration_id)
- **Relaciones de propiedad** (quién posee qué)
- **Datos genéticos** de peces
- **Economía** (tokens, precios)

### **Off-chain (Supabase + Redis)**
- **Estados dinámicos** (felicidad, hambre, salud)
- **Configuraciones** de usuario
- **Estadísticas** de gameplay
- **Sesiones** de minijuegos
- **Cache** para performance

## 🚀 Setup para Contribuidores

### 1. Prerrequisitos
```bash
# Node.js 18+ y pnpm
node --version
pnpm --version

# Supabase CLI
pnpm add -g supabase
```

### 2. Configurar Supabase

#### Opción A: Usar Supabase Cloud (Recomendado)
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta/proyecto
3. Guarda las credenciales:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Opción B: Supabase Local (Docker)
```bash
# Instalar Supabase CLI
pnpm add -g supabase

# Inicializar proyecto local
supabase init

# Iniciar servicios locales
supabase start

# Las credenciales aparecerán en la terminal
```

### 3. Configurar Redis

#### Opción A: Upstash (Recomendado)
1. Ve a [upstash.com](https://upstash.com)
2. Crea una nueva base de datos Redis
3. Copia la URL de conexión

#### Opción B: Redis Local
```bash
# Docker
docker run -d --name redis -p 6379:6379 redis:alpine

# O instalación local
# brew install redis (macOS)
# sudo apt install redis-server (Ubuntu)
```

### 4. Configurar Variables de Entorno

Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=3001
NODE_ENV=development

# Redis Configuration
REDIS_URL=redis://default:your-password@your-project.upstash.io:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Game Configuration
GAME_UPDATE_INTERVAL=5000
HAPPINESS_DECAY_RATE=0.1
```

### 5. Instalar Dependencias
```bash
cd backend
pnpm install
```

### 6. Aplicar Migraciones de Base de Datos

#### Conectar Proyecto Supabase
```bash
# Login a Supabase
supabase login

# Vincular proyecto (usa las credenciales de tu proyecto)
supabase link --project-ref your-project-ref

# Te pedirá la database password (está en Project Settings > Database)
```

#### Aplicar Migraciones
```bash
# Aplicar todas las migraciones
npx supabase db push

# Verificar estado
npx supabase db diff

# Si necesitas resetear la BD
npx supabase db reset
```

### 7. Ejecutar el Servidor
```bash
# Desarrollo
pnpm dev

# Producción
pnpm start

# Build
pnpm build
```

## 📊 Estructura de Base de Datos

### Tablas Principales

#### `players`
- `player_id` (PK) - ID on-chain del jugador
- `wallet_address` - Dirección de wallet
- `username` - Nombre de usuario
- `level`, `experience_current`, `experience_total`
- `currency` - Moneda off-chain
- `stats` - Estadísticas de juego

#### `fish_states`
- `fish_id` (PK) - ID on-chain del pez
- `player_id` (FK) - Referencia al jugador
- `happiness_level`, `hunger_level`, `health`
- `mood` - Estado emocional
- `last_fed_timestamp`, `last_played_timestamp`

#### `aquarium_states`
- `aquarium_id` (PK) - ID on-chain del acuario
- `player_id` (FK) - Referencia al jugador
- `water_temperature`, `lighting_level`, `pollution_level`
- `background_music_playing`, `current_theme_id`

#### `decoration_states`
- `decoration_id` (PK) - ID on-chain de la decoración
- `player_id` (FK) - Referencia al jugador
- `aquarium_id` (FK) - Acuario donde está colocada
- `position_x`, `position_y`, `rotation_degrees`

## 🔧 Comandos Útiles

### Base de Datos
```bash
# Ver migraciones aplicadas
npx supabase migration list

# Crear nueva migración
npx supabase migration new nombre_migracion

# Revertir última migración
npx supabase db reset

# Ver diferencias
npx supabase db diff
```

### Desarrollo
```bash
# Ejecutar tests
pnpm test

# Linting
pnpm lint

# Formatear código
pnpm format

# Ver logs en tiempo real
pnpm dev --watch
```

### Redis
```bash
# Conectar a Redis CLI
redis-cli -u your-redis-url

# Ver claves
KEYS *

# Ver valor específico
GET fish:happiness:fish-123
```

## 🌐 Endpoints API

### Health Check
```
GET /health
```

### API Base
```
GET /api/v1
```

### Fish Management
```
GET    /api/v1/fish/:fishId/state
PUT    /api/v1/fish/:fishId/happiness
POST   /api/v1/fish/:fishId/feed
GET    /api/v1/fish/player/:playerId
```

### Minigames
```
POST   /api/v1/minigames/start
PUT    /api/v1/minigames/:sessionId/score
GET    /api/v1/minigames/leaderboard
```

### WebSocket
```
WS /ws
```

## 🔐 Autenticación

El backend usa JWT para autenticación basada en wallet:

```javascript
// Ejemplo de uso
const token = jwt.sign({ walletAddress: '0x123...' }, JWT_SECRET);
```

## 📈 Monitoreo

### Logs
- **Morgan** para logging HTTP
- **Console** para errores y eventos importantes
- **Supabase** para logs de base de datos

### Métricas
- **Health check** en `/health`
- **Uptime** y estadísticas del servidor
- **Redis** para métricas de cache

## 🐛 Troubleshooting

### Error de Conexión a Supabase
```bash
# Verificar credenciales
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Re-vincular proyecto
supabase link --project-ref your-project-ref
```

### Error de Redis
```bash
# Verificar URL
echo $REDIS_URL

# Probar conexión
redis-cli -u $REDIS_URL ping
```

### Puerto en Uso
```bash
# Cambiar puerto en .env
PORT=3002

# O matar proceso
lsof -ti:3001 | xargs kill -9
```

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Configura** tu entorno local
4. **Desarrolla** y **testea**
5. **Commit** con mensajes descriptivos
6. **Push** y crea un **Pull Request**

### Convenciones de Código
- **ESLint** y **Prettier** configurados
- **Comentarios** en inglés
- **Nombres** descriptivos para funciones y variables
- **Error handling** en todos los endpoints

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Redis Docs](https://redis.io/documentation)
- [Express.js Docs](https://expressjs.com/)
- [WebSocket Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 📄 Licencia

MIT License - ver [LICENSE](../LICENSE) para detalles.

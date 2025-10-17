# 📚 Documentación de Hooks - AquaStark

Bienvenido a la documentación completa de todos los hooks de contratos del proyecto AquaStark.

## 🎯 Inicio Rápido

**👉 [Ver Índice Completo (INDEX.md)](./INDEX.md)**

El índice contiene:
- Lista completa de todos los hooks
- Resumen de métodos por categoría
- Guías rápidas de uso
- Ejemplos de código
- Problemas conocidos y recomendaciones

---

## 📖 Documentación por Hook

### Contratos Principales

#### 🏠 [useAquarium](./useAquarium.md)
Gestión completa de acuarios: crear, modificar, consultar.  
**10 métodos** | Contratos: `AquaStark`, `Game`

#### 👤 [usePlayer](./usePlayer.md)
Gestión de jugadores: registro, verificación, usernames.  
**5 métodos** | Contrato: `AquaStark`

#### 🐠 [useFish](./useFish.md)
Gestión completa de peces: CRUD, reproducción, genealogía, marketplace.  
**13 métodos** | Contrato: `AquaStark`

#### 🎨 [useDecoration](./useDecoration.md)
Gestión de decoraciones para acuarios.  
**6 métodos** | Contrato: `AquaStark`

---

### Trading y Marketplace

#### 🔄 [useTrade](./useTrade.md)
Sistema de intercambio de peces entre jugadores.  
**12 métodos** | Contrato: `Trade`  
⚠️ Usa snake_case - Recomendado usar `useTradeEnhanced`

#### 🎯 [useAquaAuction](./useAquaAuction.md)
Sistema de subastas de peces.  
**5 métodos** | Contrato: `AquaAuction`

#### 🏪 [useShopCatalog](./useShopCatalog.md)
Gestión del catálogo de la tienda.  
**4 métodos** | Contrato: `ShopCatalog`

---

### Sistemas Auxiliares

#### 🔐 [useSessionEnhanced](./useSessionEnhanced.md)
Gestión de sesiones de usuario.  
**8 métodos** | Contrato: `session`

#### 🎮 [useGameEnhanced](./useGameEnhanced.md)
Funciones consolidadas del juego (múltiples entidades).  
**20 métodos** | Contrato: `Game`

---

## 📊 Estadísticas Generales

| Métrica | Valor |
|---------|-------|
| **Total de Hooks** | 11 |
| **Total de Métodos** | 87 |
| **Métodos Query** | 65 |
| **Métodos Write** | 22 |
| **Métodos Deprecados** | 1 |
| **Contratos Cubiertos** | 7 |

---

## 🚀 Ejemplos Rápidos

### Registrar y Crear Primer Acuario

```typescript
import { usePlayer, useAquarium, useFish } from '@/hooks/dojo';

function OnboardingFlow() {
  const account = useAccount();
  const { registerPlayer } = usePlayer();
  const { newAquarium } = useAquarium();
  const { newFish } = useFish();
  
  const handleOnboarding = async () => {
    // 1. Registrar jugador
    await registerPlayer(account, "MiUsername");
    
    // 2. Crear acuario
    const aquariumId = await newAquarium(
      account,
      account.address,
      10,  // max peces
      5    // max decoraciones
    );
    
    // 3. Crear primer pez
    await newFish(account, aquariumId, species);
    
    console.log('¡Onboarding completado!');
  };
  
  return <button onClick={handleOnboarding}>Comenzar</button>;
}
```

### Dashboard de Jugador

```typescript
import { useGameEnhanced } from '@/hooks/dojo';

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
        
        setStats({ aquariums: aq, fishes: fi, decorations: dec, verified: ver });
      }
    };
    loadStats();
  }, [account]);
  
  return (
    <div>
      <h2>Mi Perfil {stats.verified && '✓'}</h2>
      <p>🏠 Acuarios: {stats.aquariums}</p>
      <p>🐠 Peces: {stats.fishes}</p>
      <p>🎨 Decoraciones: {stats.decorations}</p>
    </div>
  );
}
```

### Sistema de Trading

```typescript
import { useTrade } from '@/hooks/dojo';

function TradingMarketplace() {
  const { getAllActiveOffers, acceptTradeOffer } = useTrade();
  const [offers, setOffers] = useState([]);
  
  useEffect(() => {
    const load = async () => {
      const data = await getAllActiveOffers();
      setOffers(data);
    };
    load();
  }, []);
  
  const handleAccept = async (offerId, myFishId) => {
    await acceptTradeOffer(account, offerId, myFishId);
    alert('¡Intercambio exitoso!');
  };
  
  return (
    <div>
      <h2>Ofertas Disponibles ({offers.length})</h2>
      {offers.map(offer => (
        <div key={offer.id}>
          <p>Ofrece: Pez #{offer.offeredFishId}</p>
          <p>Solicita: {offer.requestedSpecies}</p>
          <button onClick={() => handleAccept(offer.id, myFishId)}>
            Aceptar
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔍 Búsqueda Rápida por Funcionalidad

¿Qué necesitas hacer?

| Tarea | Hook | Método |
|-------|------|--------|
| Registrar jugador | usePlayer | `registerPlayer()` |
| Crear acuario | useAquarium | `newAquarium()` |
| Crear pez | useFish | `newFish()` |
| Reproducir peces | useFish | `breedFishes()` |
| Ver árbol genealógico | useFish | `getFishFamilyTree()` |
| Listar pez para venta | useFish | `listFish()` |
| Comprar pez | useFish | `purchaseFish()` |
| Crear oferta de trade | useTrade | `createTradeOffer()` |
| Iniciar subasta | useAquaAuction | `startAuction()` |
| Pujar en subasta | useAquaAuction | `placeBid()` |
| Crear decoración | useDecoration | `newDecoration()` |
| Agregar item a tienda | useShopCatalog | `addNewItem()` |
| Crear sesión | useSessionEnhanced | `createSessionKey()` |
| Ver stats de jugador | useGameEnhanced | múltiples métodos |

---

## ⚠️ Avisos Importantes

### Métodos Deprecados
- ❌ `useAquarium.createAquariumId()` - Usar `newAquarium()` en su lugar

### Hooks Duplicados
- **useTrade** (snake_case) vs **useTradeEnhanced** (camelCase)  
  → Recomendado: useTradeEnhanced

- **useShop** vs **useShopCatalog** (en useAdditionalContracts)  
  → Recomendado: versión camelCase

### Métodos Sobrelapados
Algunos métodos existen en múltiples hooks:
- `getFish()` - en useFish y useGameEnhanced
- `getAquarium()` - en useAquarium y useGameEnhanced

**Recomendación:** Usar hooks específicos para operaciones individuales.

---

## 📁 Estructura de Archivos

```
/client/src/hooks/dojo/
├── docs/                          # 📚 Documentación
│   ├── README.md                  # Este archivo
│   ├── INDEX.md                   # Índice maestro
│   ├── useAquarium.md            # Doc de useAquarium
│   ├── usePlayer.md              # Doc de usePlayer
│   ├── useFish.md                # Doc de useFish
│   ├── useDecoration.md          # Doc de useDecoration
│   ├── useTrade.md               # Doc de useTrade
│   ├── useAquaAuction.md         # Doc de useAquaAuction
│   ├── useShopCatalog.md         # Doc de useShopCatalog
│   ├── useSessionEnhanced.md     # Doc de useSessionEnhanced
│   └── useGameEnhanced.md        # Doc de useGameEnhanced
│
├── index.ts                       # Exportaciones principales
├── useAquarium.ts                 # Hook de acuarios
├── usePlayer.ts                   # Hook de jugadores
├── useFish.ts                     # Hook de peces
├── useDecoration.ts               # Hook de decoraciones
├── useTrade.ts                    # Hook de trading (snake_case)
├── useTradeEnhanced.ts           # Hook de trading (camelCase)
├── useAquaAuction.ts             # Hook de subastas
├── useShop.ts                     # Hook de tienda (snake_case)
├── useSessionEnhanced.ts         # Hook de sesiones
└── useAdditionalContracts.ts     # Hooks adicionales
```

---

## 🛠️ Cómo Usar Esta Documentación

1. **Para desarrolladores nuevos:**
   - Lee el [INDEX.md](./INDEX.md) completo
   - Revisa los ejemplos rápidos
   - Consulta documentación específica de cada hook

2. **Para desarrollo específico:**
   - Busca la funcionalidad en "Búsqueda Rápida"
   - Ve directo al hook correspondiente
   - Sigue los ejemplos de "Cómo probar"

3. **Para debugging:**
   - Verifica métodos deprecados
   - Revisa problemas conocidos en INDEX.md
   - Consulta el resumen de cada hook

---

## 🤝 Contribuir

Para agregar o actualizar documentación:

1. Crea/edita el archivo `.md` del hook
2. Actualiza el [INDEX.md](./INDEX.md) con las nuevas entradas
3. Actualiza estadísticas en este README
4. Sigue el formato de documentación existente

---

## 📞 Soporte

Para preguntas o reportar problemas:
- Revisa la documentación completa
- Consulta ejemplos de código
- Verifica problemas conocidos en INDEX.md

---

**Documentación generada:** Octubre 2025  
**Versión:** 1.0.0  
**Total de páginas:** 10  
**Total de ejemplos de código:** 50+



import { SessionPolicies } from '@cartridge/controller';

// Direcciones de los contratos del sistema (obtenidas del manifest_sepolia.json)
const AQUA_AUCTION_ADDRESS =
  '0x89fdab2ddcd5d0b89a4e259c058336e92ff676df144d15a44bc537126d5151';
const AQUA_STARK_ADDRESS =
  '0x64ad1c0c34d3aa03feb1398c96925856165826c5cc44105be29e78bc650eff1';
const FISH_SYSTEM_ADDRESS =
  '0x48580459130d534aa2b7472b0e9df4d307e7fc1501dba93bcd9da1299757014';
const GAME_ADDRESS =
  '0x4195dc29e1c1ee877446706bd785599bb927d8f91a3499add6a41b54a306219';
const SHOP_CATALOG_ADDRESS =
  '0x683640ed180954374a7155b83795f1847a24c1c8824bd5febf58c5a83c8d038';
const TRADE_ADDRESS =
  '0x4270abe34ac2eca781119edac84946f2a064a918bdb414ce5e46a446ab4f1e9';
const TRANSACTION_ADDRESS =
  '0x5ce5aa9f4fdfbf7315a9e7bceace2c4a10638006c5434fd9488da780f81a66a';
const DAILY_CHALLENGE_ADDRESS =
  '0x645239430e89bf1351056f7baa240390da4f76a885b39e34b2a4213a7af09c2';
const SESSION_ADDRESS =
  '0x42962c7fe91399a4d3fae13910913b0f9e11e051ee468cd6830cebb41d5253c';

// Políticas de sesión para Aqua Stark
// Define qué acciones puede ejecutar automáticamente sin popups
export const GAME_POLICIES: SessionPolicies = {
  contracts: {
    // ===== AquaAuction System =====
    [AQUA_AUCTION_ADDRESS]: {
      name: 'Aqua Stark Auction',
      description: 'Sistema de subastas de Aqua Stark',
      methods: [
        {
          name: 'End Auction',
          entrypoint: 'end_auction',
          description: 'Finalizar una subasta',
        },
        {
          name: 'Place Bid',
          entrypoint: 'place_bid',
          description: 'Hacer una oferta en una subasta',
        },
        {
          name: 'Start Auction',
          entrypoint: 'start_auction',
          description: 'Iniciar una nueva subasta',
        },
      ],
    },

    // ===== AquaStark System (Core) =====
    [AQUA_STARK_ADDRESS]: {
      name: 'Aqua Stark Core',
      description: 'Funcionalidades principales de Aqua Stark',
      methods: [
        {
          name: 'Confirm Transaction',
          entrypoint: 'confirm_transaction',
          description: 'Confirmar una transacción',
        },
        {
          name: 'Initiate Transaction',
          entrypoint: 'initiate_transaction',
          description: 'Iniciar una nueva transacción',
        },
        {
          name: 'Log Event',
          entrypoint: 'log_event',
          description: 'Registrar un evento en el sistema',
        },
        {
          name: 'New Aquarium',
          entrypoint: 'new_aquarium',
          description: 'Crear un nuevo acuario',
        },
        {
          name: 'New Decoration',
          entrypoint: 'new_decoration',
          description: 'Crear una nueva decoración',
        },
        {
          name: 'Process Transaction',
          entrypoint: 'process_transaction',
          description: 'Procesar una transacción',
        },
        {
          name: 'Register',
          entrypoint: 'register',
          description: 'Registrar un nuevo jugador',
        },
        {
          name: 'Register Event Type',
          entrypoint: 'register_event_type',
          description: 'Registrar un nuevo tipo de evento',
        },
      ],
    },

    // ===== FishSystem =====
    [FISH_SYSTEM_ADDRESS]: {
      name: 'Aqua Stark Fish System',
      description: 'Gestión de peces y crianza',
      methods: [
        {
          name: 'Add Fish to Aquarium',
          entrypoint: 'add_fish_to_aquarium',
          description: 'Agregar un pez a un acuario',
        },
        {
          name: 'Breed Fishes',
          entrypoint: 'breed_fishes',
          description: 'Criar nuevos peces a partir de dos padres',
        },
        {
          name: 'Move Fish to Aquarium',
          entrypoint: 'move_fish_to_aquarium',
          description: 'Mover un pez entre acuarios',
        },
        {
          name: 'New Fish',
          entrypoint: 'new_fish',
          description: 'Crear un nuevo pez',
        },
        // Note: purchase_fish logic might be in Trade or Game, verify if needed here
      ],
    },

    // ===== Game System =====
    [GAME_ADDRESS]: {
      name: 'Aqua Stark Game',
      description: 'Mecánicas de juego principales',
      methods: [
        {
          name: 'Add Decoration to Aquarium',
          entrypoint: 'add_decoration_to_aquarium',
          description: 'Agregar decoración a un acuario',
        },
        {
          name: 'Add Fish to Aquarium',
          entrypoint: 'add_fish_to_aquarium',
          description: 'Agregar pez a acuario desde el sistema de juego',
        },
        {
          name: 'Breed Fishes',
          entrypoint: 'breed_fishes',
          description: 'Criar peces desde el sistema de juego',
        },
        {
          name: 'Move Decoration to Aquarium',
          entrypoint: 'move_decoration_to_aquarium',
          description: 'Mover decoración entre acuarios',
        },
        {
          name: 'Move Fish to Aquarium',
          entrypoint: 'move_fish_to_aquarium',
          description: 'Mover pez entre acuarios desde el sistema de juego',
        },
        {
          name: 'New Fish',
          entrypoint: 'new_fish',
          description: 'Crear nuevo pez desde el sistema de juego',
        },
        {
          name: 'Purchase Fish',
          entrypoint: 'purchase_fish',
          description: 'Comprar pez desde el sistema de juego',
        },
      ],
    },

    // ===== Trade System =====
    [TRADE_ADDRESS]: {
      name: 'Aqua Stark Trading',
      description: 'Sistema de intercambio',
      methods: [
        {
          name: 'Accept Trade Offer',
          entrypoint: 'accept_trade_offer',
          description: 'Aceptar una oferta de intercambio',
        },
        {
          name: 'Cancel Trade Offer',
          entrypoint: 'cancel_trade_offer',
          description: 'Cancelar una oferta de intercambio',
        },
        {
          name: 'Cleanup Expired Offers',
          entrypoint: 'cleanup_expired_offers',
          description: 'Limpiar ofertas de intercambio expiradas',
        },
        {
          name: 'Create Trade Offer',
          entrypoint: 'create_trade_offer',
          description: 'Crear una nueva oferta de intercambio',
        },
      ],
    },

    // ===== Shop Catalog System =====
    [SHOP_CATALOG_ADDRESS]: {
      name: 'Aqua Stark Shop',
      description: 'Catálogo de la tienda',
      methods: [
        // Add methods if players interact with it directly (e.g. buying items not via Game)
      ],
    },

    // ===== Transaction System =====
    [TRANSACTION_ADDRESS]: {
      name: 'Aqua Stark Transactions',
      description: 'Sistema de transacciones y eventos',
      methods: [
        {
          name: 'Confirm Transaction',
          entrypoint: 'confirm_transaction',
          description: 'Confirmar transacción',
        },
        {
          name: 'Initiate Transaction',
          entrypoint: 'initiate_transaction',
          description: 'Iniciar transacción',
        },
        {
          name: 'Log Event',
          entrypoint: 'log_event',
          description: 'Registrar evento',
        },
        {
          name: 'Process Transaction',
          entrypoint: 'process_transaction',
          description: 'Procesar transacción',
        },
        {
          name: 'Register Event Type',
          entrypoint: 'register_event_type',
          description: 'Registrar tipo de evento',
        },
      ],
    },

    // ===== Daily Challenge System =====
    [DAILY_CHALLENGE_ADDRESS]: {
      name: 'Aqua Stark Daily Challenges',
      description: 'Desafíos diarios y recompensas',
      methods: [
        {
          name: 'Claim Reward',
          entrypoint: 'claim_reward',
          description: 'Reclamar recompensa de un desafío diario',
        },
        {
          name: 'Complete Challenge',
          entrypoint: 'complete_challenge',
          description: 'Completar un desafío diario',
        },
        {
          name: 'Create Challenge',
          entrypoint: 'create_challenge',
          description: 'Crear un nuevo desafío diario',
        },
        {
          name: 'Join Challenge',
          entrypoint: 'join_challenge',
          description: 'Unirse a un desafío diario',
        },
      ],
    },

    // ===== Session System =====
    [SESSION_ADDRESS]: {
      name: 'Aqua Stark Session',
      description: 'Gestión de sesiones',
      methods: [
        {
          name: 'Create Session Key',
          entrypoint: 'create_session_key',
          description: 'Crear una nueva clave de sesión',
        },
        {
          name: 'Renew Session',
          entrypoint: 'renew_session',
          description: 'Renovar una sesión existente',
        },
        {
          name: 'Revoke Session',
          entrypoint: 'revoke_session',
          description: 'Revocar una sesión',
        },
        {
          name: 'Validate Session',
          entrypoint: 'validate_session',
          description: 'Validar una sesión',
        },
      ],
    },
  },
};

// Configuración adicional para Cartridge
export const CARTRIDGE_CONFIG = {
  // Opciones de registro y autenticación
  enableRegistration: true,
  showSignUp: true,
  redirectToSignUp: true,

  // Configuración de sesión
  sessionConfig: {
    autoRenewal: true,
    maxDuration: 24 * 60 * 60 * 1000, // 24 horas
    enablePasskey: true,
    enableBiometric: true,
  },

  // Configuración de UX
  uxConfig: {
    showGamingBadge: true,
    prioritizeGaming: true,
    showFallbackOptions: true,
  },

  // Configuración de red
  networkConfig: {
    defaultChain: 'sepolia',
    supportedChains: ['sepolia', 'mainnet'],
    rpcUrls: {
      sepolia: 'https://api.cartridge.gg/x/starknet/sepolia',
      mainnet: 'https://api.cartridge.gg/x/starknet/mainnet',
    },
  },
};

// Políticas simplificadas para desarrollo/testing
export const DEV_POLICIES: SessionPolicies = {
  contracts: {
    [AQUA_STARK_ADDRESS]: {
      name: 'Aqua Stark Dev',
      description: 'Acciones básicas para desarrollo',
      methods: [
        {
          name: 'New Aquarium',
          entrypoint: 'new_aquarium',
          description: 'Crear nuevo acuario',
        },
      ],
    },
  },
};

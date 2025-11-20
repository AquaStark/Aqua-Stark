import { SessionPolicies } from '@cartridge/controller';

// Dirección del mundo Dojo (todos los contratos están en el mundo)
// Esta es la dirección del mundo en Sepolia
const WORLD_ADDRESS = '0x3a11f54945c50816a7eb6088fa2dfbeca18e7f97cb0cb8c063505dd08d01c7d';

// Políticas de sesión para Aqua Stark
// Define qué acciones puede ejecutar automáticamente sin popups
// Incluye TODOS los contratos y métodos para evitar tener que firmar cada transacción
export const GAME_POLICIES: SessionPolicies = {
  contracts: {
    // Contrato principal del mundo Dojo - incluye todos los sistemas
    [WORLD_ADDRESS]: {
      name: 'Aqua Stark Game World',
      description: 'Sistema completo del juego de acuario - todos los contratos y métodos',
      methods: [
        // ===== AquaAuction System =====
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

        // ===== AquaStark System =====
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

        // ===== FishSystem =====
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
        {
          name: 'Purchase Fish',
          entrypoint: 'purchase_fish',
          description: 'Comprar un pez del mercado',
        },

        // ===== Game System =====
        {
          name: 'Add Decoration to Aquarium',
          entrypoint: 'add_decoration_to_aquarium',
          description: 'Agregar decoración a un acuario',
        },
        {
          name: 'Add Fish to Aquarium (Game)',
          entrypoint: 'add_fish_to_aquarium',
          description: 'Agregar pez a acuario desde el sistema de juego',
        },
        {
          name: 'Breed Fishes (Game)',
          entrypoint: 'breed_fishes',
          description: 'Criar peces desde el sistema de juego',
        },
        {
          name: 'Move Decoration to Aquarium',
          entrypoint: 'move_decoration_to_aquarium',
          description: 'Mover decoración entre acuarios',
        },
        {
          name: 'Move Fish to Aquarium (Game)',
          entrypoint: 'move_fish_to_aquarium',
          description: 'Mover pez entre acuarios desde el sistema de juego',
        },
        {
          name: 'New Fish (Game)',
          entrypoint: 'new_fish',
          description: 'Crear nuevo pez desde el sistema de juego',
        },
        {
          name: 'Purchase Fish (Game)',
          entrypoint: 'purchase_fish',
          description: 'Comprar pez desde el sistema de juego',
        },

        // ===== Trade System =====
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

        // ===== Transaction System =====
        {
          name: 'Confirm Transaction (Transaction)',
          entrypoint: 'confirm_transaction',
          description: 'Confirmar transacción desde el sistema de transacciones',
        },
        {
          name: 'Initiate Transaction (Transaction)',
          entrypoint: 'initiate_transaction',
          description: 'Iniciar transacción desde el sistema de transacciones',
        },
        {
          name: 'Log Event (Transaction)',
          entrypoint: 'log_event',
          description: 'Registrar evento desde el sistema de transacciones',
        },
        {
          name: 'Process Transaction (Transaction)',
          entrypoint: 'process_transaction',
          description: 'Procesar transacción desde el sistema de transacciones',
        },
        {
          name: 'Register Event Type (Transaction)',
          entrypoint: 'register_event_type',
          description: 'Registrar tipo de evento desde el sistema de transacciones',
        },

        // ===== Daily Challenge System =====
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

        // ===== Session System =====
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
    '0x0000000000000000000000000000000000000000000000000000000000000001': {
      name: 'Aqua Stark Dev',
      description: 'Acciones básicas para desarrollo',
      methods: [
        {
          name: 'Feed Fish',
          entrypoint: 'feed_fish',
          description: 'Alimentar peces',
        },
        {
          name: 'Clean Aquarium',
          entrypoint: 'clean_aquarium',
          description: 'Limpiar acuario',
        },
      ],
    },
  },
};

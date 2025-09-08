import { SessionPolicies } from '@cartridge/controller';

// Políticas de sesión para Aqua Stark
// Define qué acciones puede ejecutar automáticamente sin popups
export const GAME_POLICIES: SessionPolicies = {
  contracts: {
    // Contrato principal del juego (Dojo World)
    '0x0000000000000000000000000000000000000000000000000000000000000001': {
      name: 'Aqua Stark Game World',
      description: 'Acciones principales del juego de acuario',
      methods: [
        {
          name: 'Feed Fish',
          entrypoint: 'feed_fish',
          description: 'Alimentar peces en el acuario',
        },
        {
          name: 'Clean Aquarium',
          entrypoint: 'clean_aquarium',
          description: 'Limpiar el acuario',
        },
        {
          name: 'Collect Rewards',
          entrypoint: 'collect_rewards',
          description: 'Recolectar recompensas diarias',
        },
        {
          name: 'Breed Fish',
          entrypoint: 'breed_fish',
          description: 'Criar nuevos peces',
        },
        {
          name: 'Buy Fish',
          entrypoint: 'buy_fish',
          description: 'Comprar peces en la tienda',
        },
        {
          name: 'Sell Fish',
          entrypoint: 'sell_fish',
          description: 'Vender peces en el mercado',
        },
        {
          name: 'Upgrade Aquarium',
          entrypoint: 'upgrade_aquarium',
          description: 'Mejorar el acuario',
        },
        {
          name: 'Add Decoration',
          entrypoint: 'add_decoration',
          description: 'Agregar decoraciones al acuario',
        },
      ],
    },

    // Contrato de NFTs de peces
    '0x0000000000000000000000000000000000000000000000000000000000000002': {
      name: 'Fish NFTs',
      description: 'Gestión de NFTs de peces',
      methods: [
        {
          name: 'Mint Fish NFT',
          entrypoint: 'mint',
          description: 'Crear nuevo NFT de pez',
        },
        {
          name: 'Transfer Fish',
          entrypoint: 'transfer',
          description: 'Transferir pez a otro jugador',
        },
        {
          name: 'Approve Fish',
          entrypoint: 'approve',
          description: 'Aprobar transferencia de pez',
        },
      ],
    },

    // Contrato de marketplace
    '0x0000000000000000000000000000000000000000000000000000000000000003': {
      name: 'Fish Marketplace',
      description: 'Mercado de compra/venta de peces',
      methods: [
        {
          name: 'List Fish for Sale',
          entrypoint: 'list_fish',
          description: 'Poner pez en venta',
        },
        {
          name: 'Buy Fish from Market',
          entrypoint: 'buy_fish',
          description: 'Comprar pez del mercado',
        },
        {
          name: 'Cancel Listing',
          entrypoint: 'cancel_listing',
          description: 'Cancelar venta de pez',
        },
        {
          name: 'Update Price',
          entrypoint: 'update_price',
          description: 'Actualizar precio de venta',
        },
      ],
    },

    // Contrato de recompensas y logros
    '0x0000000000000000000000000000000000000000000000000000000000000004': {
      name: 'Achievements & Rewards',
      description: 'Sistema de logros y recompensas',
      methods: [
        {
          name: 'Claim Achievement',
          entrypoint: 'claim_achievement',
          description: 'Reclamar logro completado',
        },
        {
          name: 'Collect Daily Reward',
          entrypoint: 'collect_daily',
          description: 'Recolectar recompensa diaria',
        },
        {
          name: 'Claim Weekly Bonus',
          entrypoint: 'claim_weekly',
          description: 'Reclamar bonificación semanal',
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

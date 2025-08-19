

// Direcciones de contratos (actualizar con las reales)
const GAME_CONTRACT = "0x0000000000000000000000000000000000000000000000000000000000000001";
const NFT_CONTRACT = "0x0000000000000000000000000000000000000000000000000000000000000002";
const MARKETPLACE_CONTRACT = "0x0000000000000000000000000000000000000000000000000000000000000003";
const REWARDS_CONTRACT = "0x0000000000000000000000000000000000000000000000000000000000000004";

export function useGameActions() {
  // Por ahora, simulamos las acciones hasta que tengamos los contratos reales
  const executeAction = async ({ calls }: { calls: any[] }) => {
    console.log('Executing actions:', calls);
    // Simular delay de transacción
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { hash: '0x123...' };
  };

  // Acciones básicas del acuario
  const feedFish = async (fishId: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "feed_fish",
        calldata: [fishId]
      }]
    });
  };

  const cleanAquarium = async () => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT, 
        entrypoint: "clean_aquarium",
        calldata: []
      }]
    });
  };

  const collectRewards = async () => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "collect_rewards",
        calldata: []
      }]
    });
  };

  // Acciones de cría
  const breedFish = async (fish1Id: string, fish2Id: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "breed_fish",
        calldata: [fish1Id, fish2Id]
      }]
    });
  };

  // Acciones de compra/venta
  const buyFish = async (fishType: string, price: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "buy_fish",
        calldata: [fishType, price]
      }]
    });
  };

  const sellFish = async (fishId: string, price: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "sell_fish",
        calldata: [fishId, price]
      }]
    });
  };

  // Acciones de mejora
  const upgradeAquarium = async (upgradeType: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "upgrade_aquarium",
        calldata: [upgradeType]
      }]
    });
  };

  const addDecoration = async (decorationType: string, position: string) => {
    return await executeAction({
      calls: [{
        contractAddress: GAME_CONTRACT,
        entrypoint: "add_decoration",
        calldata: [decorationType, position]
      }]
    });
  };

  // Acciones de NFT
  const mintFishNFT = async (fishType: string) => {
    return await executeAction({
      calls: [{
        contractAddress: NFT_CONTRACT,
        entrypoint: "mint",
        calldata: [fishType]
      }]
    });
  };

  const transferFish = async (to: string, fishId: string) => {
    return await executeAction({
      calls: [{
        contractAddress: NFT_CONTRACT,
        entrypoint: "transfer",
        calldata: [to, fishId]
      }]
    });
  };

  // Acciones de marketplace
  const listFishForSale = async (fishId: string, price: string) => {
    return await executeAction({
      calls: [{
        contractAddress: MARKETPLACE_CONTRACT,
        entrypoint: "list_fish",
        calldata: [fishId, price]
      }]
    });
  };

  const buyFishFromMarket = async (listingId: string) => {
    return await executeAction({
      calls: [{
        contractAddress: MARKETPLACE_CONTRACT,
        entrypoint: "buy_fish",
        calldata: [listingId]
      }]
    });
  };

  // Acciones de logros
  const claimAchievement = async (achievementId: string) => {
    return await executeAction({
      calls: [{
        contractAddress: REWARDS_CONTRACT,
        entrypoint: "claim_achievement",
        calldata: [achievementId]
      }]
    });
  };

  const collectDailyReward = async () => {
    return await executeAction({
      calls: [{
        contractAddress: REWARDS_CONTRACT,
        entrypoint: "collect_daily",
        calldata: []
      }]
    });
  };

  // Acción por lotes (múltiples transacciones) - Perfecta para session keys
  const dailyMaintenance = async (fishIds: string[]) => {
    const calls = [
      // Limpiar acuario
      { 
        contractAddress: GAME_CONTRACT, 
        entrypoint: "clean_aquarium", 
        calldata: [] 
      },
      // Alimentar todos los peces
      ...fishIds.map(id => ({
        contractAddress: GAME_CONTRACT,
        entrypoint: "feed_fish", 
        calldata: [id]
      })),
      // Recolectar recompensas
      { 
        contractAddress: GAME_CONTRACT, 
        entrypoint: "collect_rewards", 
        calldata: [] 
      },
      // Recompensa diaria
      { 
        contractAddress: REWARDS_CONTRACT, 
        entrypoint: "collect_daily", 
        calldata: [] 
      }
    ];

    return await executeAction({ calls });
  };

  // Acción de onboarding para nuevos jugadores
  const newPlayerSetup = async (username: string) => {
    const calls = [
      // Crear cuenta de jugador
      {
        contractAddress: GAME_CONTRACT,
        entrypoint: "create_player",
        calldata: [username]
      },
      // Dar peces iniciales
      {
        contractAddress: NFT_CONTRACT,
        entrypoint: "mint",
        calldata: ["starter_fish_1"]
      },
      {
        contractAddress: NFT_CONTRACT,
        entrypoint: "mint", 
        calldata: ["starter_fish_2"]
      },
      // Configurar acuario básico
      {
        contractAddress: GAME_CONTRACT,
        entrypoint: "setup_aquarium",
        calldata: []
      }
    ];

    return await executeAction({ calls });
  };

  return {
    // Acciones básicas
    feedFish,
    cleanAquarium,
    collectRewards,
    
    // Cría
    breedFish,
    
    // Compra/venta
    buyFish,
    sellFish,
    
    // Mejoras
    upgradeAquarium,
    addDecoration,
    
    // NFTs
    mintFishNFT,
    transferFish,
    
    // Marketplace
    listFishForSale,
    buyFishFromMarket,
    
    // Logros
    claimAchievement,
    collectDailyReward,
    
    // Acciones por lotes
    dailyMaintenance,
    newPlayerSetup,
  };
}

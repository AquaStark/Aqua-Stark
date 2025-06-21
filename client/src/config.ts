// Configuration utility for wallet connection modes
export interface WalletConfig {
  useKatanaAccounts: boolean;
  isDevelopment: boolean;
  rpcUrl: string;
  toriiUrl: string;
  relayUrl: string;
  debug: boolean;
}

export const getWalletConfig = (): WalletConfig => {
  const isDevelopment = import.meta.env.DEV;

  // Use Vite environment variables instead of Next.js
  const useKatanaFromEnv = import.meta.env.VITE_USE_KATANA;

  // Add detailed debugging
  console.log("🔍 Environment Variable Debug:");
  console.log("  NODE_ENV:", import.meta.env.NODE_ENV);
  console.log("  VITE_USE_KATANA:", useKatanaFromEnv);
  console.log("  isDevelopment:", isDevelopment);
  console.log(
    "  useKatanaFromEnv !== undefined:",
    useKatanaFromEnv !== undefined
  );
  console.log('  useKatanaFromEnv === "true":', useKatanaFromEnv === "true");

  const useKatanaAccounts =
    useKatanaFromEnv !== undefined
      ? useKatanaFromEnv === "true"
      : isDevelopment;

  console.log("  Final useKatanaAccounts:", useKatanaAccounts);

  return {
    useKatanaAccounts,
    isDevelopment,
    rpcUrl: import.meta.env.VITE_RPC_URL || "http://localhost:5050",
    toriiUrl: import.meta.env.VITE_TORII_URL || "http://localhost:8080",
    relayUrl: import.meta.env.VITE_RELAY_URL || "/ip4/127.0.0.1/tcp/9092/ws",
    debug: import.meta.env.VITE_DEBUG === "true" || isDevelopment,
  };
};

// Cartridge Controller policies for your game - using the correct format
export const getCartridgePolicies = (worldAddress: string) => ({
  contracts: {
    [worldAddress]: {
      methods: [
        {
          name: "create_round",
          entrypoint: "create_round",
          description: "Create a new game round in LyricsFlip",
        },
        {
          name: "join_round",
          entrypoint: "join_round",
          description: "Join an existing game round",
        },
        {
          name: "start_round",
          entrypoint: "start_round",
          description: "Start a game round when ready",
        },
        {
          name: "add_lyrics_card",
          entrypoint: "add_lyrics_card",
          description: "Add lyrics card to the game collection",
        },
      ],
    },
  },
});

// Cartridge Controller chain configuration
export const getCartridgeChains = () => [
  { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
  { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
];

// Chain IDs for Cartridge Controller
export const CHAIN_IDS = {
  SEPOLIA: "0x534e5f5345504f4c4941",
  MAINNET: "0x534e5f4d41494e4e4554",
} as const;

export const WALLET_MODES = {
  KATANA: "katana",
  CARTRIDGE: "cartridge",
} as const;

export type WalletMode = (typeof WALLET_MODES)[keyof typeof WALLET_MODES];

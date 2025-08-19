"use client";
import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  braavos,
  useInjectedConnectors,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { GAME_POLICIES } from "../config/policies";
import { constants } from "starknet";

// IMPORTANTE: Crear conector de Cartridge FUERA del componente
const cartridgeConnector = new ControllerConnector({
  policies: GAME_POLICIES,
  theme: "aqua-stark",
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  chains: [
    {
      rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
    },
  ],
});

const provider = jsonRpcProvider({
  rpc: (chain) => ({
    nodeUrl: chain === mainnet 
      ? "https://api.cartridge.gg/x/starknet/mainnet"
      : "https://api.cartridge.gg/x/starknet/sepolia"
  }),
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors: injectedConnectors } = useInjectedConnectors({
    recommended: [braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  // Combinar Cartridge Controller con wallets detectadas (Ready, Braavos, etc.)
  const allConnectors = [cartridgeConnector, ...injectedConnectors];

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={allConnectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}

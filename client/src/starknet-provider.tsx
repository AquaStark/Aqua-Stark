// StarknetProvider.tsx
"use client";
import ControllerConnector from "@cartridge/connector/controller";
import { usePredeployedAccounts } from "@dojoengine/predeployed-connector/react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  jsonRpcProvider,
  StarknetConfig,
  useAccount,
  useConnect,
  voyager,
} from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import { dojoConfig } from "../dojoConfig";
import {
  CHAIN_IDS,
  getCartridgeChains,
  getCartridgePolicies,
  getWalletConfig,
} from "./config";

export default function StarknetProvider({ children }: PropsWithChildren) {
  const walletConfig = getWalletConfig();

  // Katana predeployed accounts connector
  const { connectors: katanaConnectors } = usePredeployedAccounts({
    rpc: dojoConfig.rpcUrl as string,
    id: "katana",
    name: "Katana",
  });

  // Cartridge Controller connector
  const cartridgeConnector = new ControllerConnector({
    policies: getCartridgePolicies(dojoConfig.manifest.world.address),
    defaultChainId: CHAIN_IDS.SEPOLIA, // Default to Sepolia for development
    chains: getCartridgeChains(),
  });

  // Choose connectors based on environment
  const connectors = walletConfig.useKatanaAccounts
    ? katanaConnectors
    : [cartridgeConnector as never as Connector];

  const provider = jsonRpcProvider({
    rpc: () => ({ nodeUrl: dojoConfig.rpcUrl as string }),
  });

  // Choose appropriate chain based on environment
  const chains = walletConfig.useKatanaAccounts
    ? [mainnet]
    : [sepolia, mainnet];

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={walletConfig.useKatanaAccounts} // Only auto-connect for Katana
    >
      <StarknetConnectionWrapper walletConfig={walletConfig}>
        {children}
      </StarknetConnectionWrapper>
    </StarknetConfig>
  );
}

function StarknetConnectionWrapper({
  children,
  walletConfig,
}: PropsWithChildren & { walletConfig: ReturnType<typeof getWalletConfig> }) {
  const { account } = useAccount();
  console.log("account", account);
  const { connect, connectors } = useConnect();

  if (!account) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">
          {walletConfig.useKatanaAccounts
            ? "Connect to a Predeployed Account"
            : "Connect Your Wallet"}
        </h2>
        <div className="space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 block w-full"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
        {walletConfig.useKatanaAccounts && (
          <p className="text-sm text-gray-600 mt-2">
            Development mode: Using Katana prefunded accounts
          </p>
        )}
        {walletConfig.debug && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug Info:</p>
            <p>
              Mode: {walletConfig.useKatanaAccounts ? "Katana" : "Cartridge"}
            </p>
            <p>RPC: {walletConfig.rpcUrl}</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

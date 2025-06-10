import type { PropsWithChildren } from "react";
import { sepolia } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import cartridgeConnector from "./cartredgeConnector";

export default function StarknetProvider({ children }: PropsWithChildren) {
  const provider = jsonRpcProvider({
    rpc: () => {
      return { nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" };
    },
  });

  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      provider={provider}
      connectors={[cartridgeConnector]}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}

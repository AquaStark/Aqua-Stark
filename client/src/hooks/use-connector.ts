import { useConnect, useAccount } from "@starknet-react/core";
import { useState, useCallback } from "react";

export function useStarknetConnect() {
  const { connect, connectors } = useConnect();
  const { status } = useAccount();
  const [hasTriedConnect, setHasTriedConnect] = useState(false);

  const handleConnect = useCallback(async () => {
    console.log(connectors);
    const connector = connectors[2];
    console.log(connector);
    if (!connector) return;
    setHasTriedConnect(true);
    await connect({ connector });
    console.log("exit");
  }, [connect, connectors]);

  return { status, handleConnect, hasTriedConnect, setHasTriedConnect };
}

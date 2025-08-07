import { createDojoConfig } from "@dojoengine/core";

import manifestDev from "../aqua_contract/manifest_dev.json";
import manifestSepolia from "../aqua_contract/manifest_sepolia.json";

const selectedManifest =
  (import.meta.env.VITE_DOJO_MANIFEST || "sepolia").toLowerCase() === "dev"
    ? manifestDev
    : manifestSepolia;

export const dojoConfig = createDojoConfig({
  manifest: selectedManifest,
  rpcUrl:
    import.meta.env.VITE_RPC_URL ||
    "https://api.cartridge.gg/x/starknet/sepolia",
});

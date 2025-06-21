import { createDojoConfig } from "@dojoengine/core";

import manifest from "../aqua_contract/manifest_dev.json";

export const dojoConfig = createDojoConfig({
  manifest,
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  
});

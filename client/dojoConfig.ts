import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contract/manifest_dev.json";

export const dojoConfig = createDojoConfig({
  manifest,
});

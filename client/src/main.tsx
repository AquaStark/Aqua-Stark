import { init } from "@dojoengine/sdk";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
// ModelNameInteface is exported from ./models.generated.ts
// This file contains mapping of your cairo contracts to torii client
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { dojoConfig } from "../dojoConfig";
import { setupWorld } from "./typescript/contracts.gen.ts";
import { SchemaType } from "./typescript/models.gen";

async function main() {
  const sdk = await init<SchemaType>({
    client: {
      toriiUrl: dojoConfig.toriiUrl, // defaults to http://localhost:8080
      relayUrl: dojoConfig.relayUrl, // defaults to /ip4/127.0.0.1/tcp/9090/tcp/80
      worldAddress: dojoConfig.manifest.world.address,
    },
    // Those values are used
    domain: {
      name: "AquaStark",
      revision: "1.0.0",
      chainId: "KATANA",
      version: "1.0.0",
    },
  });
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DojoSdkProvider>
    </React.StrictMode>
  );
}

main();

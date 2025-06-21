import { Account, constants } from "starknet";
import { dojoConfig } from "../../dojoConfig";
import AquaStarkService from "../dojoclient/index";
import { setupWorld } from "../typescript/contracts.gen";
import { useAccount } from "@starknet-react/core";

// Mock or real setup for Dojo client and account
// In a real test, you would use actual provider and account details
const providerUrl = dojoConfig.rpcUrl;
const manifest = dojoConfig.manifest;

async function main() {
  try {
    // Setup DojoProvider and client
    const { DojoProvider } = await import("@dojoengine/core");
    const dojoProvider = new DojoProvider(manifest, providerUrl);
    const client = setupWorld(dojoProvider);

    // Use a test account (replace with real keys for integration)
    const testAddress =
      "0x0620fd15e0b464c174933b5235c72a50376379ee1528719848e144385d0a1ed4";
    const testPrivateKey =
      "0x05d67e95f8d5913249452a410db389110c390a36eb0e2ecb092c670ba945b8b9";
    const account = new Account(
      dojoProvider.provider,
      testAddress,
      testPrivateKey,
      undefined,
      constants.TRANSACTION_VERSION.V3
    );
    const { account } = useAccount();

    // Instantiate the AquaStarkService
    const aquaService = new AquaStarkService(client, { account });

    // // Example: Test createAquariumId
    // console.log("\n--- Testing createAquariumId ---");
    // const aquariumIdResult = await aquaService.createAquariumId(account.address);
    // console.log("createAquariumId result:", aquariumIdResult);

    // // Example: Test register (with dummy data)
    // const testUsername = "123456"; // as BigNumberish (string or number)
    // const testSpecies: CairoCustomEnum = { kind: "Goldfish", value: 0 };
    // console.log("\n--- Testing register ---");
    // const registerResult = await aquaService.register(
    //   testUsername,
    //   testSpecies
    // );
    // console.log("register result:", registerResult);

    // // Example: Test newFish (with dummy data)
    // console.log("\n--- Testing newFish ---");
    // const newFishResult = await aquaService.newFish(testAddress, testSpecies);
    // console.log("newFish result:", newFishResult);

    // // Example: Test getAquarium (with dummy ID)
    // console.log("\n--- Testing getAquarium ---");
    // const aquariumInfo = await aquaService.getAquarium("1");
    // console.log("getAquarium result:", aquariumInfo);

    const aquarium = await aquaService.newAquarium(
      "0x0620fd15e0b464c174933b5235c72a50376379ee1528719848e144385d0a1ed4",
      10
    );
    console.log("aquarium:", aquarium);
  } catch (error) {
    console.error("AquaStarkService test failed:", error);
    process.exit(1);
  }
}

main();

//import { Account } from 'starknet';
import { dojoConfig } from '../../dojoConfig';
import { setupWorld } from '../typescript/contracts.gen';
// Placeholder client removed; this test is disabled until the client is implemented

// Mock or real setup for Dojo client and account
// In a real test, you would use actual provider and account details
const providerUrl = dojoConfig.rpcUrl;
const manifest = dojoConfig.manifest;

async function main() {
  try {
    // Setup DojoProvider and client
    const { DojoProvider } = await import('@dojoengine/core');
    const dojoProvider = new DojoProvider(manifest, providerUrl);
    const client = setupWorld(dojoProvider);

    // Use a test account (replace with real keys for integration)
    // const testAddress = '';
    // const testPrivateKey = '';
    // const account = null as unknown as Account;

    // Instantiate the AquaStarkService
    // const aquaService = new AquaStarkClient(client, { account });

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

    // Disabled until client is implemented
    console.log('Client not implemented; skipping calls', client ? '' : '');
  } catch (error) {
    console.error('AquaStarkService test failed:', error);
    process.exit(1);
  }
}

main();

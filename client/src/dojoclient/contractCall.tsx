import { useDojo } from "@/DojoContext";
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { ModelsMapping, schema } from "../typescript/models.gen.ts";
import { dojoConfig } from "../../dojoConfig.ts";
import { Account, constants } from "starknet";

export function DojeService = {
    const sdk = await init<ModelsMapping>()
    const { client, account, provider } = useDojo();
    const playerKey = account.account.address;
    



    const signMessage = async () => {
        const account0 = new Account(
            provider.provider,
            "account.address",
            "account.privateKey",
            undefined,
            constants.TRANSACTION_VERSION.V3
          );
const msg = sdk.generateTypedData("onchain_dash-Message", {
    // identity: account.account.address,
    // content: toValidAscii(data.message),
    // timestamp: Date.now(),
});

try {
    const signature = await account.signMessage(msg);

    try {
        await db.client.publishMessage(
            JSON.stringify(msg),
            signature as string[]
        );
        reset();
    } catch (error) {
        console.error("failed to publish message:", error);
    }
} catch (error) {
    console.error("failed to sign message:", error);
}
    }
}

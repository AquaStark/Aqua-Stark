import { ControllerConnector } from "@cartridge/connector";
import {
  default as ColorMode,
  ControllerOptions,
  default as SessionPolicies,
} from "@cartridge/controller";
import { Connector } from "@starknet-react/core";
import { constants } from "starknet";

const CONTRACT_ADDRESS_GAME =
  "0x681ea222117a7e68124fdb1dbbdee016a560fd453b846fb54bef34be325882d";

const policies: SessionPolicies = {
  contracts: {
    [CONTRACT_ADDRESS_GAME]: {
      methods: [],
    },
  },
};

// Controller basic configuration
const colorMode: ColorMode = "dark";
const theme = "aqua-stark";

const options: ControllerOptions = {
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  policies,
  theme,
  colorMode,

  namespace: "aqua_stark",
  slot: "aqua5",
};

const cartridgeConnector = new ControllerConnector(
  options
) as never as Connector;

export default cartridgeConnector;

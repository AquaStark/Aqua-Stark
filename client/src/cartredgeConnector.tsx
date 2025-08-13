import { ControllerConnector } from '@cartridge/connector';
import { ControllerOptions } from '@cartridge/controller';
import { Connector } from '@starknet-react/core';
import { constants } from 'starknet';

// Note: New controller versions handle policies internally; omit for now

// Controller basic configuration
const colorMode = 'dark' as const;
const theme = 'aqua-stark';

const options: ControllerOptions = {
  chains: [
    {
      rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
    },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  theme,
  colorMode,

  namespace: 'aqua_stark',
  slot: 'aqua5',
};

const cartridgeConnector = new ControllerConnector(
  options
) as never as Connector;

export default cartridgeConnector;

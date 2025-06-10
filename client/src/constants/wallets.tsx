import { Wallet, Currency, Shield, Gamepad, Rocket, Lock } from "lucide-react";

export interface Wallet {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  bgColor: string;
}

export const wallets: Wallet[] = [
  {
    id: "argentX",
    name: "Argent X",
    icon: <Currency className="text-purple-500" size={24} />,
    description: "The first StarkNet wallet with top-tier security and UX.",
    bgColor: "bg-purple-500/20",
  },
  {
    id: "braavos",
    name: "Braavos",
    icon: <Shield className="text-blue-500" size={24} />,
    description: "A secure wallet with 2FA/3FA and Bitcoin support.",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "controller",
    name: "Cartridge",
    icon: <Gamepad className="text-green-500" size={24} />,
    description: "Seamless gaming wallet with session keys support.",
    bgColor: "bg-green-500/20",
  },
  {
    id: "rhinoFi",
    name: "RhinoFi",
    icon: <Rocket className="text-orange-500" size={24} />,
    description: "Fast bridging and DeFi wallet for StarkNet.",
    bgColor: "bg-orange-500/20",
  },
  {
    id: "kass",
    name: "Kass",
    icon: <Lock className="text-red-500" size={24} />,
    description: "A secure wallet for advanced StarkNet users.",
    bgColor: "bg-red-500/20",
  },
];

export const WALLET_ERRORS = {
  NOT_INSTALLED: "Wallet extension not installed",
  CONNECTION_REFUSED: "Connection refused by user",
  UNKNOWN_ERROR: "Unknown connection error",
};

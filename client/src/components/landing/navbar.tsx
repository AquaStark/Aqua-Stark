"use client";

import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import WalletModal from "../modal/walletConnectModal";
import ControllerConnector from "@cartridge/connector/controller";
import { Wallet } from "lucide-react";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const controller = connectors.find(
    (c) => c.id === "controller"
  ) as ControllerConnector;

  useEffect(() => {
    if (isConnected && address && controller) {
      controller.username()?.then((name) => setUsername(name));
    } else {
      setUsername(null);
    }
  }, [isConnected, address, controller]);

  const handleConnectWallet = async (connector: Connector) => {
    try {
      await connect({ connector });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error instanceof Error) {
        if (error.message.includes("User rejected the request")) {
          alert("Connection was cancelled by user");
        } else {
          alert("Failed to connect: " + error.message);
        }
      }
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      setUsername(null);
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <nav className="relative z-10 flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-b from-black/20 to-transparent h-full">
      <div className="flex items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png"
          alt="Aqua Stark Logo"
          className="h-14 sm:h-18 md:h-20 lg:h-24 w-auto drop-shadow-2xl"
        />
      </div>

      <div className="flex gap-2 sm:gap-3 items-center">
        {isConnected ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-600/40 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-blue-400/50">
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                {username
                  ? `${username}`
                  : `${address?.slice(0, 4)}...${address?.slice(-3)}`}
              </span>
            </div>
            <button
              onClick={handleDisconnectWallet}
              className="text-sm sm:text-base font-bold py-1.5 sm:py-2 px-3 sm:px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border border-red-400"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm sm:text-base font-bold py-1.5 sm:py-2 px-3 sm:px-5 bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border border-purple-400 flex items-center gap-1 sm:gap-2"
          >
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Connect</span>
            <span className="xs:hidden">💰</span>
          </button>
        )}
        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectWallet={handleConnectWallet}
        />
      </div>
    </nav>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  useConnect,
  useDisconnect,
  useAccount,
  Connector,
} from "@starknet-react/core";
import WalletModal from "../modal/walletConnectModal";

import ControllerConnector from "@cartridge/connector/controller";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const controller = connectors[2] as ControllerConnector;

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
    <nav className="relative z-10 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png"
          alt="Aqua Stark Logo"
          width={180}
          height={80}
          className="drop-shadow-lg"
        />
      </div>

      <div className="flex gap-3 items-center">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              {username
                ? `${username}`
                : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </span>
            <button
              onClick={handleDisconnectWallet}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Connect Wallet
            </button>
          </>
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

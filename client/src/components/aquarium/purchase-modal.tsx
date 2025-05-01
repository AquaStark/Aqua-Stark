"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface PurchaseModalProps {
  onClose: () => void;
  onPurchase: () => void;
  coinBalance: number;
}

export function PurchaseModal({
  onClose,
  onPurchase,
  coinBalance,
}: PurchaseModalProps) {
  const [purchaseState, setPurchaseState] = useState<
    "initial" | "processing" | "complete"
  >("initial");

  const handlePurchase = () => {
    setPurchaseState("processing");

    // Simulate processing delay
    setTimeout(() => {
      setPurchaseState("complete");

      setTimeout(() => {
        onPurchase();
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-blue-800  overflow-y-auto border border-blue-700 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold text-white">
            {purchaseState === "initial" && "Purchase New Aquarium"}
            {purchaseState === "processing" && "Processing Payment..."}
            {purchaseState === "complete" && "Purchase Complete!"}
          </h2>
          <button onClick={onClose} className="text-blue-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {purchaseState === "initial" && (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                <div className="md:w-1/2">
                  <img
                    src="/items/aquarium.png"
                    alt="Standard Aquarium"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Standard Aquarium
                  </h3>
                  <p className="text-blue-200 mb-4">
                    A spacious environment for your aquatic friends
                  </p>
                  <div className="text-yellow-300 text-2xl font-bold mb-1 flex items-center">
                    <span className="mr-2">🪙</span> 3500
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Up to 15 fish",
                      "10 decorations max",
                      "High-quality water filtration",
                      "Multiple theme options",
                      "Temperature control",
                    ].map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-blue-100"
                      >
                        <Check className="h-5 w-5 mr-2 text-blue-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-blue-700 pt-3 mb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h4 className="text-lg font-medium text-white">
                    Purchase Summary
                  </h4>
                  <div className="bg-blue-700/50 px-3 py-1 rounded-full text-sm text-white">
                    Your balance: 🪙 {coinBalance}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Aquarium Price:</span>
                    <span className="text-white flex items-center">
                      <span className="text-yellow-300 mr-1">🪙</span> 3500
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Network Fee:</span>
                    <span className="text-white flex items-center">
                      <span className="text-yellow-300 mr-1">🪙</span> 35
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-blue-700">
                    <span className="text-white">Total:</span>
                    <span className="text-white flex items-center">
                      <span className="text-yellow-300 mr-1">🪙</span> 3535
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
              >
                <span className="mr-2">🛒</span>
                Purchase with 3535 Coins
              </button>
            </>
          )}

          {purchaseState === "processing" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-300 mb-6"></div>
              <p className="text-blue-100 text-lg">
                Processing your payment...
              </p>
            </div>
          )}

          {purchaseState === "complete" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-500 rounded-full p-4 mb-6">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Purchase Successful!
              </h3>
              <p className="text-blue-200 text-center mb-8">
                Your new aquarium has been added to your collection. Transaction
                confirmed on StarkNet.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                View My Aquariums
              </button>
            </div>
          )}
        </div>

        {purchaseState === "initial" && (
          <div className="bg-blue-900/30 px-6 py-3 flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-blue-200 duration-200 hover:bg-white/30 bg-white px-3 py-1.5 rounded-lg font-medium"
            >
              Cancel
            </button>
            <div className="text-blue-300 text-sm">
              Powered by <span className="font-bold text-white">StarkNet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

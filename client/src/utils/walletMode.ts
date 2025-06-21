import { getWalletConfig, WALLET_MODES, type WalletMode } from "../config";

/**
 * Utility functions for managing wallet modes
 */
export class WalletModeManager {
  public static config = getWalletConfig();

  /**
   * Get the current wallet mode
   */
  static getCurrentMode(): WalletMode {
    return this.config.useKatanaAccounts
      ? WALLET_MODES.KATANA
      : WALLET_MODES.CARTRIDGE;
  }

  /**
   * Check if currently using Katana prefunded accounts
   */
  static isKatanaMode(): boolean {
    return this.config.useKatanaAccounts;
  }

  /**
   * Check if currently using Cartridge Controller
   */
  static isCartridgeMode(): boolean {
    return !this.config.useKatanaAccounts;
  }

  /**
   * Get human-readable mode description
   */
  static getModeDescription(): string {
    return this.config.useKatanaAccounts
      ? "Development Mode (Katana Prefunded Accounts)"
      : "Production Mode (Cartridge Controller)";
  }

  /**
   * Get debug information about current configuration
   */
  static getDebugInfo() {
    const mode = this.getCurrentMode();
    const debugInfo = {
      mode,
      description: this.getModeDescription(),
      config: this.config,
      environment: process.env.NODE_ENV,
      useKatanaEnvVar: process.env.NEXT_PUBLIC_USE_KATANA,
    };

    // Add console logging for debugging
    console.log("🔗 Wallet Mode:", this.getModeDescription());
    console.log("📊 Debug Info:", debugInfo);

    return debugInfo;
  }

  /**
   * Get recommendations based on current mode
   */
  static getRecommendations(): string[] {
    if (this.isKatanaMode()) {
      return [
        "✅ Perfect for development and testing",
        "🚀 Fast iteration with no gas costs",
        "🔧 Easy debugging with known accounts",
        "⚠️ Remember to test with Cartridge before production",
      ];
    } else {
      return [
        "✅ Production-ready wallet experience",
        "🔐 Secure passkey authentication",
        "🎮 Optimized for gaming with session keys",
        "💰 Real transactions with gas costs",
      ];
    }
  }
}

/**
 * React hook to get current wallet mode information
 */
export function useWalletMode() {
  const debugInfo = WalletModeManager.getDebugInfo();

  return {
    mode: WalletModeManager.getCurrentMode(),
    description: WalletModeManager.getModeDescription(),
    isKatana: WalletModeManager.isKatanaMode(),
    isCartridge: WalletModeManager.isCartridgeMode(),
    config: WalletModeManager.config,
    debugInfo,
    recommendations: WalletModeManager.getRecommendations(),
  };
}

// Auto-log mode on import (only in debug mode)
if (WalletModeManager.config.debug) {
  WalletModeManager.getDebugInfo();
}

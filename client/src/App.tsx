import { ControllerConnector } from "@cartridge/connector";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  argent,
  braavos,
  publicProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { Route, Routes } from "react-router-dom";
import { constants } from "starknet";

// Landing & Onboarding Pages
import LandingPage from "./pages/landing";
import OnboardingPage from "./pages/onboarding/onboarding";
import StartPage from "./pages/onboarding/start";
import CreateAquariumPage from "./pages/onboarding/create-aquarium";

// Main Game Pages
import GamePage from "./pages/game";
import AquariumsPage from "./pages/aquariums";
import StoragePage from "./pages/storage";
import TradingMarketPage from "./pages/trading-market";
import BreedingLaboratoryPage from "./pages/breeding-laboratory";

// Community & Social Pages
import CommunityPage from "./pages/community";
import MyProfilePage from "./pages/my-profile";

// Information & Help Pages
import EncyclopediaPage from "./pages/encyclopedia";
import HelpCenterPage from "./pages/help-center";
import EventsCalendarPage from "./pages/events-calendar";
import AchievementsPage from "./pages/achievements";

// Mini Games Pages
import MiniGamesPage from "./pages/mini-games";
import FloppyFishGamePage from "./pages/floppy-fish";

// Utility Pages
import CreditsPage from "./pages/credits";
import Error404Page from "./pages/404";

// Extra Game Test
import { Game } from "./Game";

const cartridgeConnector = new ControllerConnector({
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
});

function App() {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos(), cartridgeConnector],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      <Routes>
        {/* Landing & Onboarding Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/create-aquarium" element={<CreateAquariumPage />} />

        {/* Main Game Routes */}
        <Route path="/game" element={<GamePage />} />
        <Route path="/aquariums" element={<AquariumsPage />} />
        <Route path="/store" element={<StoragePage />} />
        <Route path="/trading-market" element={<TradingMarketPage />} />
        <Route path="/breeding-laboratory" element={<BreedingLaboratoryPage />} />

        {/* Community & Social Routes */}
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />

        {/* Information & Help Routes */}
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/events-calendar" element={<EventsCalendarPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />

        {/* Mini Games Routes */}
        <Route path="/mini-games" element={<MiniGamesPage />} />
        <Route path="/mini-games/floppy-fish" element={<FloppyFishGamePage />} />

        {/* Utility Routes */}
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/test-game" element={<Game />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </StarknetConfig>
  );
}

export default App;

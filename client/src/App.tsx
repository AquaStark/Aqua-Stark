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

// Pages
import CreateAquariumPage from "./pages/create-aquarium.tsx";
import CreditsPage from "./pages/credits.tsx";
import EncyclopediaPage from "./pages/encyclopedia.tsx";
import Error404Page from "./pages/404.tsx";
import EventsCalendarPage from "./pages/events-calendar.tsx";
import GamePage from "./pages/game.tsx";
import HelpCenterPage from "./pages/help-center.tsx";
import LandingPage from "./pages/landing-page.tsx";
import MyProfilePage from "./pages/my-profile.tsx";
import OnboardingPage from "./pages/onboarding.tsx";
import StartPage from "./pages/start.tsx";
import StoragePage from "./pages/storage-page.tsx";
import TradingMarketPage from "./pages/trading-market.tsx";

// Extra Game Test
import { Game } from "./Game.tsx";

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-aquarium" element={<CreateAquariumPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/events-calendar" element={<EventsCalendarPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/storage-page" element={<StoragePage />} />
        <Route path="/store" element={<StoragePage />} />
        <Route path="/test-game" element={<Game />} />
        <Route path="/trading-market" element={<TradingMarketPage />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </StarknetConfig>
  );
}

export default App;

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
import Error404Page from "./pages/404.tsx";
import AchievementsPage from "./pages/achievements.tsx";
import AquariumsPage from "./pages/aquariums.tsx";
import CommunityPage from "./pages/community.tsx";
import EncyclopediaPage from "./pages/encyclopedia.tsx";
import EventsCalendarPage from "./pages/events-calendar.tsx";
import GamePage from "./pages/game.tsx";
import HelpCenter from "./pages/help-center.tsx";
import LandingPage from "./pages/landing-page.tsx";
import MyProfile from "./pages/my-profile.tsx";
import StorePage from "./pages/storage-page.tsx";
import { Game } from "./Game.tsx";

const cartridgeConnector = new ControllerConnector({
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
    },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
});

function App() {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos(), cartridgeConnector],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });
  return (
    <>
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={publicProvider()}
        connectors={connectors}
        explorer={voyager}
        autoConnect={true}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/aquariums" element={<AquariumsPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/test-game" element={<Game />} />
          {/* <Route
              path="/breeding-laboratory"
              element={<BreadingLaboratory />}
            /> */}
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/events" element={<EventsCalendarPage />} />
          {/* <Route path="/trading-market" element={<TradingMarketPage />} /> */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/storage-page" element={<StorePage />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
        {/* <Game /> */}
      </StarknetConfig>
    </>
  );
}

export default App;

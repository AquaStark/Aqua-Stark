
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import GamePage from "./pages/game-page";
import StorePage from "./pages/storage-page";
import AchievementsPage from "./pages/achievements-page";
import { FishEncyclopedia } from "./app/fish-encyclopedia";
import HelpCenter from "./pages/help-center";
import BreadingLaboratory from "./pages/breading-laboratory";
import EventsCalendar from "./pages/events-calendar";
import TradingMarketPage from "./pages/trading-market";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/breadingLaboratory" element={<BreadingLaboratory/>} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/encyclopedia" element={<FishEncyclopedia />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/events" element={<EventsCalendar/>} />
      <Route path="/trading-market" element={<TradingMarketPage />} />
    </Routes>
  );
}

export default App;

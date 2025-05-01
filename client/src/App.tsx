
import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing-page"
import GamePage from "./pages/game"
import StorePage from "./pages/storage-page"
import AchievementsPage from "./pages/achievements"
import HelpCenter from "./pages/help-center"
import BreadingLaboratory from "./pages/breeding-laboratory"
import EventsCalendar from "./pages/events-calendar"
import TradingMarketPage from "./pages/trading-market"
import CommunityPage from "./pages/community"
import MyProfile from "./pages/my-profile"
import EncyclopediaPage from "./pages/encyclopedia"
import AquariumsPage from "./pages/aquariums"
import Error404Page from "./pages/404";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/aquariums" element={<AquariumsPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/breeding-laboratory" element={<BreadingLaboratory />} />
      <Route path="/encyclopedia" element={<EncyclopediaPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/events" element={<EventsCalendar />} />
      <Route path="/trading-market" element={<TradingMarketPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/storage-page" element={<StorePage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;

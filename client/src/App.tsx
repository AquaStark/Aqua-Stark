import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing-page"
import GamePage from "./pages/game-page"
import StorePage from "./pages/storage-page"
import LaboratoryPage from "./pages/breeding-laboratory-page"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/breeding-laboratory-page" element={<LaboratoryPage />} />
    </Routes>
  )
}

export default App


import { Route, Routes } from 'react-router-dom';
import { StarknetProvider } from './providers/StarknetProvider';
import { SpeciesCatalogProvider } from './contexts/SpeciesCatalogContext';
import { SSEWrapper } from './components/sse-wrapper';
import { ErrorBoundary } from './components';

// Landing & Onboarding Pages
import { useResponsiveLanding } from './hooks/use-responsive-landing';
import { useResponsiveStore } from './hooks/use-responsive-store';
import { useResponsiveMiniGames } from './hooks/use-responsive-mini-games';
import { useResponsiveFloppyFish } from './hooks/use-responsive-floppy-fish';
import { ResponsiveBubbleJumper } from './hooks/use-responsive-bubble-jumper';
import { useResponsiveFishDodge } from './hooks/use-responsive-fish-dodge';
import OnboardingPage from './pages/onboarding/onboarding';
import StartPage from './pages/onboarding/start';
import LoadingPage from './pages/loading';

// Main Game Pages
import GamePage from './pages/game';
import AquariumsPage from './pages/aquariums';
import TradingMarketPage from './pages/trading-market';
import BreedingLaboratoryPage from './pages/breeding-laboratory';
import SettingsPage from './pages/settings';

// Community & Social Pages
import CommunityPage from './pages/community';
import MyProfilePage from './pages/my-profile';

// Information & Help Pages
import EncyclopediaPage from './pages/encyclopedia';
import HelpCenterPage from './pages/help-center';
import EventsCalendarPage from './pages/events-calendar';
import AchievementsPage from './pages/achievements';

// Utility Pages
import CreditsPage from './pages/credits';
import Error404Page from './pages/404';

// Extra Game Test
import { Game } from './Game';
import AquariumDemo from './pages/demo';

function App() {
  const ResponsiveLanding = useResponsiveLanding();
  const ResponsiveStore = useResponsiveStore();
  const ResponsiveMiniGames = useResponsiveMiniGames();
  const ResponsiveFloppyFish = useResponsiveFloppyFish();
  const ResponsiveFishDodge = useResponsiveFishDodge();

  return (
    <ErrorBoundary>
      <StarknetProvider>
        <SpeciesCatalogProvider>
          <SSEWrapper>
            <Routes>
              {/* Landing & Onboarding Routes */}
              <Route path='/' element={ResponsiveLanding} />
              <Route path='/onboarding' element={<OnboardingPage />} />
              <Route path='/start' element={<StartPage />} />
              <Route path='/loading' element={<LoadingPage />} />

              {/* Main Game Routes */}
              <Route path='/game' element={<GamePage />} />
              <Route path='/aquariums' element={<AquariumsPage />} />
              <Route path='/store' element={ResponsiveStore} />
              <Route path='/trading-market' element={<TradingMarketPage />} />
              <Route
                path='/breeding-laboratory'
                element={<BreedingLaboratoryPage />}
              />

              {/* Settings Route */}
              <Route path='/settings' element={<SettingsPage />} />

              {/* Community & Social Routes */}
              <Route path='/community' element={<CommunityPage />} />
              <Route path='/my-profile' element={<MyProfilePage />} />

              {/* Information & Help Routes */}
              <Route path='/encyclopedia' element={<EncyclopediaPage />} />
              <Route path='/help-center' element={<HelpCenterPage />} />
              <Route path='/events-calendar' element={<EventsCalendarPage />} />
              <Route path='/achievements' element={<AchievementsPage />} />

              {/* Mini Games Routes */}
              <Route path='/mini-games' element={ResponsiveMiniGames} />
              <Route
                path='/mini-games/floppy-fish'
                element={ResponsiveFloppyFish}
              />
              <Route
                path='/mini-games/bubble-jumper'
                element={<ResponsiveBubbleJumper />}
              />
              <Route
                path='/mini-games/fish-dodge'
                element={ResponsiveFishDodge}
              />

              {/* Utility Routes */}
              <Route path='/credits' element={<CreditsPage />} />
              <Route path='/test-game' element={<Game />} />
              <Route path='*' element={<Error404Page />} />

              {/* test page */}
              <Route path='/demo' element={<AquariumDemo />} />
            </Routes>
          </SSEWrapper>
        </SpeciesCatalogProvider>
      </StarknetProvider>
    </ErrorBoundary>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import PopularDestinations from './components/PopularDestinations';
import TravelInspiration from './components/TravelInspiration';
import ExplorePage from './components/ExplorePage';
import TripsPage from './components/TripsPage';
import TripDetailView from './components/TripDetailView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DataHubPage from './components/DataHubPage';
import PlanTripModal from './components/PlanTripModal';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState('Ladakh');
  const [tripsRefreshKey, setTripsRefreshKey] = useState(0);

  // Handle URL hash changes for browser history and bookmarking support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#explore') {
        setCurrentView('explore');
      } else if (hash === '#trips') {
        setCurrentView('trips');
      } else if (hash === '#analytics') {
        setCurrentView('analytics');
      } else if (hash === '#data-hub' || hash === '#data') {
        setCurrentView('data-hub');
      } else if (hash === '#plan' || hash === '#planner') {
        setIsPlanModalOpen(true);
      } else if (hash === '' || hash === '#hero' || hash === '#home') {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlanModal = (destName = 'Ladakh') => {
    setSelectedDestinationForModal(destName);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    if (window.location.hash === '#plan' || window.location.hash === '#planner') {
      window.location.hash = currentView === 'explore' ? 'explore' : '';
    }
  };

  const handleSelectTrip = (id) => {
    setSelectedTripId(id);
    setCurrentView('trip-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripCreated = () => {
    setTripsRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E7EDF5] font-sans selection:bg-[#73DACA] selection:text-[#0B0F14] flex flex-col">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenPlanModal={() => handleOpenPlanModal('Ladakh')}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'explore' && (
          <ExplorePage
            onPlanTrip={(destName) => handleOpenPlanModal(destName)}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'trips' && (
          <TripsPage
            key={tripsRefreshKey}
            onSelectTrip={handleSelectTrip}
            onOpenPlanModal={() => handleOpenPlanModal('Ladakh')}
          />
        )}

        {currentView === 'trip-detail' && (
          <TripDetailView
            tripId={selectedTripId}
            onBack={() => handleNavigate('trips')}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {currentView === 'data-hub' && (
          <DataHubPage />
        )}

        {currentView === 'home' && (
          <>
            {/* Cinematic Hero & Destination Slider */}
            <HeroSlider onOpenPlanModal={(name) => handleOpenPlanModal(name)} />

            {/* Popular Destinations - 4 Photographic Cards */}
            <PopularDestinations onSelectDestination={(name) => handleOpenPlanModal(name)} />

            {/* Cinematic Mountain & Starry-Sky Travel Inspiration Section */}
            <TravelInspiration onOpenPlanModal={(name) => handleOpenPlanModal(name)} />
          </>
        )}
      </main>

      {/* Interactive Trip Planner Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={handleClosePlanModal}
        initialDestination={selectedDestinationForModal}
        onTripCreated={handleTripCreated}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <Footer
        onOpenPlanModal={() => handleOpenPlanModal('Custom Route')}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

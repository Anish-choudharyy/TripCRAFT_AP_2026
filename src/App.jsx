import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import PopularDestinations from './components/PopularDestinations';
import TravelInspiration from './components/TravelInspiration';
import ExplorePage from './components/ExplorePage';
import PlanTripModal from './components/PlanTripModal';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState('Ladakh');

  // Handle URL hash changes for browser history and bookmarking support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#explore') {
        setCurrentView('explore');
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
    if (view === 'explore') {
      window.location.hash = 'explore';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlanModal = (destName = 'Ladakh') => {
    setSelectedDestinationForModal(destName);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
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
        {currentView === 'explore' ? (
          <ExplorePage
            onPlanTrip={(destName) => handleOpenPlanModal(destName)}
            onBackToHome={() => handleNavigate('home')}
          />
        ) : (
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
      />

      {/* Footer */}
      <Footer
        onOpenPlanModal={() => handleOpenPlanModal('Custom Route')}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import PopularDestinations from './components/PopularDestinations';
import TravelInspiration from './components/TravelInspiration';
import PlanTripModal from './components/PlanTripModal';
import Footer from './components/Footer';

export default function App() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState('Ladakh');

  const handleOpenPlanModal = (destName = 'Ladakh') => {
    setSelectedDestinationForModal(destName);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#E5E7EB] font-sans selection:bg-[#E05A2B] selection:text-white flex flex-col">
      {/* Navigation */}
      <Navbar onOpenPlanModal={() => handleOpenPlanModal('Ladakh')} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Cinematic Hero & Destination Slider */}
        <HeroSlider onOpenPlanModal={() => handleOpenPlanModal('Ladakh')} />

        {/* Popular Destinations - 4 Photographic Cards */}
        <PopularDestinations onSelectDestination={(name) => handleOpenPlanModal(name)} />

        {/* Cinematic Mountain & Starry-Sky Travel Inspiration Section */}
        <TravelInspiration onOpenPlanModal={() => handleOpenPlanModal('Ladakh')} />
      </main>

      {/* Interactive Trip Planner Modal */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={handleClosePlanModal}
        initialDestination={selectedDestinationForModal}
      />

      {/* Footer */}
      <Footer onOpenPlanModal={() => handleOpenPlanModal('Custom Route')} />
    </div>
  );
}

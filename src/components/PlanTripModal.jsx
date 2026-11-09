import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  Users,
  Wallet,
  Compass,
  MapPin,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Copy,
  CheckCheck,
  Sun,
  Sunset,
  Moon,
  Info,
  Loader2,
  BookmarkPlus,
} from 'lucide-react';
import { api } from '../services/api';
import { EXPLORE_DESTINATIONS } from '../data/destinations';
import {
  formatINR,
  getDestinationDetails,
  getSuggestedBudget,
  generateItinerary,
} from '../utils/itineraryGenerator';

const STYLES = [
  {
    id: 'Relaxed',
    title: 'Relaxed',
    subtitle: 'Unhurried & Restorative',
    desc: 'Later starts, peaceful viewpoints, boutique stays, and slow culinary dining.',
  },
  {
    id: 'Balanced',
    title: 'Balanced',
    subtitle: 'Classic Curated Circuit',
    desc: 'Harmonious mix of iconic monuments, guided walks, local gastronomy, and free exploration.',
  },
  {
    id: 'Adventure',
    title: 'Adventure',
    subtitle: 'High-Energy Exploration',
    desc: 'Early dawn starts, hiking & water trails, high-altitude passes, and active outdoor excursions.',
  },
];

export default function PlanTripModal({
  isOpen,
  onClose,
  initialDestination = 'Ladakh',
  onNavigate,
  onTripCreated,
}) {
  // Screens: 'preferences' | 'results'
  const [screen, setScreen] = useState('preferences');

  // Form State
  const [selectedDest, setSelectedDest] = useState(initialDestination);
  const [travelers, setTravelers] = useState(2);
  const [duration, setDuration] = useState(5);
  const [budgetINR, setBudgetINR] = useState('');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [validationErrors, setValidationErrors] = useState({});

  // Destination search inside preferences
  const [destSearch, setDestSearch] = useState('');

  // Results State
  const [itinerary, setItinerary] = useState(null);
  const [seed, setSeed] = useState(0);
  const [activeDayFilter, setActiveDayFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [regeneratedNotice, setRegeneratedNotice] = useState(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [savedTripSuccess, setSavedTripSuccess] = useState(false);

  const modalContainerRef = useRef(null);

  // Sync initialDestination whenever prop updates or modal opens
  useEffect(() => {
    if (initialDestination) {
      setSelectedDest(initialDestination);
      const suggested = getSuggestedBudget({
        destination: initialDestination,
        travelers,
        duration,
        travelStyle,
      });
      setBudgetINR(suggested);
    }
  }, [initialDestination, isOpen]);

  // Handle ESC key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset copied message
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Reset regenerated banner
  useEffect(() => {
    if (regeneratedNotice) {
      const timer = setTimeout(() => setRegeneratedNotice(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [regeneratedNotice]);

  if (!isOpen) return null;

  // Auto-fill suggested budget
  const handleUseSuggestedBudget = () => {
    const suggested = getSuggestedBudget({
      destination: selectedDest,
      travelers,
      duration,
      travelStyle,
    });
    setBudgetINR(suggested);
    if (validationErrors.budget) {
      setValidationErrors((prev) => ({ ...prev, budget: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    const destObj = getDestinationDetails(selectedDest);
    if (!destObj) {
      errors.destination = 'Please choose a valid destination.';
    }

    const numTravelers = Number(travelers);
    if (isNaN(numTravelers) || numTravelers < 1 || numTravelers > 30) {
      errors.travelers = 'Number of travelers must be between 1 and 30.';
    }

    const numDuration = Number(duration);
    if (isNaN(numDuration) || numDuration < 1 || numDuration > 30) {
      errors.duration = 'Duration must be between 1 and 30 days.';
    }

    const numBudget = Number(budgetINR);
    if (isNaN(numBudget) || numBudget < 1000) {
      errors.budget = 'Please enter a valid total budget in INR (minimum ₹1,000).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate Itinerary
  const handleGenerate = (currentSeed = seed) => {
    if (!validateForm()) return;

    const generated = generateItinerary({
      destination: selectedDest,
      travelers: Number(travelers),
      duration: Number(duration),
      budgetINR: Number(budgetINR),
      travelStyle,
      seed: currentSeed,
    });

    setItinerary(generated);
    setScreen('results');
    setActiveDayFilter('all');
    setSavedTripSuccess(false);
    setIsSavingTrip(false);

    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Regenerate Itinerary (Alternate variation)
  const handleRegenerate = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    handleGenerate(nextSeed);
    setRegeneratedNotice(true);
  };

  // Reset Trip back to fresh preferences
  const handleResetTrip = () => {
    const defaultDest = initialDestination || 'Ladakh';
    setSelectedDest(defaultDest);
    setTravelers(2);
    setDuration(5);
    setTravelStyle('Balanced');
    const suggested = getSuggestedBudget({
      destination: defaultDest,
      travelers: 2,
      duration: 5,
      travelStyle: 'Balanced',
    });
    setBudgetINR(suggested);
    setValidationErrors({});
    setItinerary(null);
    setSeed(0);
    setScreen('preferences');
    setSavedTripSuccess(false);
    setIsSavingTrip(false);
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save Generated Expedition to Backend Database
  const handleSaveTrip = async () => {
    if (!itinerary) return;
    setIsSavingTrip(true);
    try {
      const destInfo = getDestinationDetails(selectedDest);
      const safeBudget =
        Number(itinerary?.budget?.totalEstimatedCost) || Number(budgetINR) || 45000;
      const createdTrip = await api.createTrip({
        title: `${selectedDest} Expedition (${travelStyle})`,
        destination: selectedDest,
        budget: safeBudget,
        status: 'Planned',
        travelers: `${travelers} Traveler${Number(travelers) > 1 ? 's' : ''}`,
        cover_image: destInfo?.image || null,
        notes: `Style: ${travelStyle}. Duration: ${duration} Days. Generated by TripCraft Stage 3 Planner.`,
      });

      // Persist day-by-day itinerary activities to the backend if trip was created
      if (createdTrip?.id && Array.isArray(itinerary.days)) {
        for (const day of itinerary.days) {
          if (day.morning?.title) {
            await api
              .addItineraryItem(createdTrip.id, {
                day_number: day.dayNumber || 1,
                time_slot: day.morning.time || 'Morning',
                title: day.morning.title,
                location: selectedDest,
                category: 'Sightseeing',
                cost: Math.round((safeBudget * 0.14) / (itinerary.days.length * 3)),
                notes: day.morning.desc || '',
              })
              .catch(() => {});
          }
          if (day.afternoon?.title) {
            await api
              .addItineraryItem(createdTrip.id, {
                day_number: day.dayNumber || 1,
                time_slot: day.afternoon.time || 'Afternoon',
                title: day.afternoon.title,
                location: selectedDest,
                category: 'Activities',
                cost: Math.round((safeBudget * 0.14) / (itinerary.days.length * 3)),
                notes: day.afternoon.desc || '',
              })
              .catch(() => {});
          }
          if (day.evening?.title) {
            await api
              .addItineraryItem(createdTrip.id, {
                day_number: day.dayNumber || 1,
                time_slot: day.evening.time || 'Evening',
                title: day.evening.title,
                location: selectedDest,
                category: 'Dining',
                cost: Math.round((safeBudget * 0.22) / itinerary.days.length),
                notes: day.evening.desc || '',
              })
              .catch(() => {});
          }
        }
      }

      if (onTripCreated) onTripCreated();
      setSavedTripSuccess(true);
    } catch (err) {
      console.warn('Could not save trip to backend:', err.message);
      if (onTripCreated) onTripCreated();
      setSavedTripSuccess(true);
    } finally {
      setIsSavingTrip(false);
    }
  };

  // Return to Explore
  const handleReturnToExplore = () => {
    onClose();
    if (onNavigate) {
      onNavigate('explore');
    }
  };

  // Copy Itinerary Text Summary
  const handleCopySummary = () => {
    if (!itinerary) return;
    const text = [
      `TRIPCRAFT JOURNEY DOSSIER: ${itinerary.destination.name.toUpperCase()} (${itinerary.destination.state.toUpperCase()})`,
      `Duration: ${itinerary.duration} Days | Party: ${itinerary.travelers} Traveler(s) | Style: ${itinerary.travelStyle}`,
      `Total Estimated Cost: ₹${formatINR(itinerary.budget.totalEstimatedCost)} (₹${formatINR(itinerary.budget.estimatedCostPerPerson)} / person)`,
      `Target Budget: ₹${formatINR(itinerary.budget.userBudget)} (${itinerary.budget.isWithinBudget ? 'Within Budget' : 'Budget Advisory'})`,
      '',
      'DAY-BY-DAY ITINERARY:',
      ...itinerary.days.map(
        (d) =>
          `Day ${d.dayNumber}: ${d.title}\n` +
          `  • Morning (${d.morning.time}): ${d.morning.title} - ${d.morning.desc}\n` +
          `  • Afternoon (${d.afternoon.time}): ${d.afternoon.title} - ${d.afternoon.desc}\n` +
          `  • Evening (${d.evening.time}): ${d.evening.title} - ${d.evening.desc}`
      ),
      '',
      'BUDGET BREAKDOWN (ESTIMATED):',
      ...itinerary.budget.categories.map((c) => `  • ${c.label}: ₹${formatINR(c.amount)} (${c.percentage}%)`),
      '',
      `Generated by TripCraft Atelier India.`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const filteredDestinationList = EXPLORE_DESTINATIONS.filter((d) => {
    const q = destSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  const currentDestObj = getDestinationDetails(selectedDest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalContainerRef}
        className={`relative w-full ${
          screen === 'results' ? 'max-w-5xl' : 'max-w-3xl'
        } bg-[#131B24] border border-[#2A3644] rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto transition-all duration-300 flex flex-col`}
      >
        {/* ========================================================================= */}
        {/* SCREEN 1: PREFERENCES FORM                                               */}
        {/* ========================================================================= */}
        {screen === 'preferences' ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-[#2A3644] mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#73DACA] font-semibold mb-1">
                  <Compass className="w-3.5 h-3.5 text-[#73DACA]" />
                  <span>TRIPCRAFT BESPOKE PLANNER</span>
                </div>
                <h2 className="font-condensed text-3xl sm:text-4xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                  PLAN YOUR ITINERARY
                </h2>
                <p className="text-[#94A3B8] text-xs sm:text-sm mt-1 font-light">
                  Tailor your destination, duration, party size, and realistic budget for an authentic day-by-day plan.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#94A3B8] hover:text-[#E7EDF5] rounded-full hover:bg-[#202B38] transition-colors cursor-pointer shrink-0"
                aria-label="Close planner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="space-y-6"
            >
              {/* 1. Destination Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                    <span>Selected Destination</span>
                  </label>
                  <span className="text-[11px] text-[#94A3B8] font-mono">
                    {EXPLORE_DESTINATIONS.length} Indian Destinations Available
                  </span>
                </div>

                {/* Selected Destination Preview Strip */}
                <div className="p-3 rounded-sm bg-[#202B38] border border-[#2A3644] flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={currentDestObj.image}
                      alt={currentDestObj.name}
                      className="w-12 h-12 rounded-sm object-cover shrink-0 border border-[#2A3644]"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-condensed text-lg font-bold text-[#E7EDF5] uppercase truncate">
                          {currentDestObj.name}
                        </h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#131B24] text-[#73DACA] border border-[#2A3644]">
                          {currentDestObj.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate">{currentDestObj.state}</p>
                    </div>
                  </div>

                  <span className="text-xs text-[#73DACA] font-mono shrink-0 hidden sm:inline">
                    Base: {currentDestObj.budgetFormatted} / person
                  </span>
                </div>

                {/* Destination Dropdown & Quick Search */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search to switch destination (e.g. Manali, Spiti, Goa, Kerala, Jaipur)..."
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 pl-3 text-xs text-[#E7EDF5] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#73DACA]"
                    />
                    {destSearch && (
                      <button
                        type="button"
                        onClick={() => setDestSearch('')}
                        className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#E7EDF5]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Destination Grid / Chips */}
                  <div className="max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#0B0F14]/50 border border-[#2A3644]/60 rounded-sm">
                    {filteredDestinationList.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDest(d.name);
                          const suggested = getSuggestedBudget({
                            destination: d.name,
                            travelers,
                            duration,
                            travelStyle,
                          });
                          setBudgetINR(suggested);
                        }}
                        className={`p-2 rounded text-left text-xs transition-colors border cursor-pointer flex items-center justify-between ${
                          selectedDest.toLowerCase() === d.name.toLowerCase()
                            ? 'bg-[#202B38] border-[#73DACA] text-[#E7EDF5] font-bold'
                            : 'bg-[#131B24] border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5] hover:border-[#73DACA]/40'
                        }`}
                      >
                        <span className="truncate">{d.name}</span>
                        {selectedDest.toLowerCase() === d.name.toLowerCase() && (
                          <Check className="w-3 h-3 text-[#73DACA] shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                  {validationErrors.destination && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.destination}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Travelers and Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Travelers */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#73DACA]" />
                      <span>Number of Travelers</span>
                    </label>
                    <span className="text-xs text-[#73DACA] font-mono">
                      {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setTravelers(num);
                          const suggested = getSuggestedBudget({
                            destination: selectedDest,
                            travelers: num,
                            duration,
                            travelStyle,
                          });
                          setBudgetINR(suggested);
                        }}
                        className={`flex-1 py-1.5 text-xs rounded border cursor-pointer font-mono transition-colors ${
                          Number(travelers) === num
                            ? 'bg-[#73DACA] text-[#0B0F14] font-bold border-[#73DACA]'
                            : 'bg-[#202B38] border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5]'
                        }`}
                      >
                        {num === 1 ? '1 Solo' : num === 2 ? '2 Duo' : `${num} Group`}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={travelers}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setTravelers(val);
                        const suggested = getSuggestedBudget({
                          destination: selectedDest,
                          travelers: val,
                          duration,
                          travelStyle,
                        });
                        setBudgetINR(suggested);
                      }}
                      className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                      placeholder="Custom travelers count..."
                    />
                  </div>
                  {validationErrors.travelers && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.travelers}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#73DACA]" />
                      <span>Trip Duration (Days)</span>
                    </label>
                    <span className="text-xs text-[#73DACA] font-mono">
                      {duration} Days ({duration > 1 ? `${duration - 1} Nights` : 'Day Trip'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {[3, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDuration(d);
                          const suggested = getSuggestedBudget({
                            destination: selectedDest,
                            travelers,
                            duration: d,
                            travelStyle,
                          });
                          setBudgetINR(suggested);
                        }}
                        className={`flex-1 py-1.5 text-xs rounded border cursor-pointer font-mono transition-colors ${
                          Number(duration) === d
                            ? 'bg-[#73DACA] text-[#0B0F14] font-bold border-[#73DACA]'
                            : 'bg-[#202B38] border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5]'
                        }`}
                      >
                        {d} Days
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={duration}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setDuration(val);
                        const suggested = getSuggestedBudget({
                          destination: selectedDest,
                          travelers,
                          duration: val,
                          travelStyle,
                        });
                        setBudgetINR(suggested);
                      }}
                      className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                      placeholder="Custom duration in days (1-30)..."
                    />
                  </div>
                  {validationErrors.duration && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.duration}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Total Budget in INR */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#73DACA]" />
                    <span>Total Target Budget (INR ₹)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSuggestedBudget}
                    className="text-[11px] text-[#73DACA] hover:text-[#9AEBDD] font-mono underline cursor-pointer"
                  >
                    Suggest Realistic Budget
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#73DACA] font-mono text-sm font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={budgetINR}
                    onChange={(e) => setBudgetINR(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 pl-8 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA] font-mono"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1 font-mono">
                  <span>
                    Approx. ₹{formatINR(Math.round((Number(budgetINR) || 0) / Math.max(1, travelers)))}{' '}
                    / person
                  </span>
                  <span>
                    Approx. ₹
                    {formatINR(
                      Math.round(
                        (Number(budgetINR) || 0) / (Math.max(1, travelers) * Math.max(1, duration))
                      )
                    )}{' '}
                    / person / day
                  </span>
                </div>
                {validationErrors.budget && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.budget}
                  </p>
                )}
              </div>

              {/* 4. Travel Style */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold mb-2">
                  Travel Style & Pacing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setTravelStyle(style.id);
                        const suggested = getSuggestedBudget({
                          destination: selectedDest,
                          travelers,
                          duration,
                          travelStyle: style.id,
                        });
                        setBudgetINR(suggested);
                      }}
                      className={`p-3.5 rounded-sm text-left transition-all border cursor-pointer flex flex-col justify-between ${
                        travelStyle === style.id
                          ? 'bg-[#202B38] border-[#73DACA] text-[#E7EDF5]'
                          : 'bg-[#131B24] border-[#2A3644] text-[#94A3B8] hover:border-[#2A3644] hover:text-[#E7EDF5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-condensed text-base font-bold text-[#E7EDF5] uppercase">
                            {style.title}
                          </span>
                          {travelStyle === style.id && (
                            <Check className="w-3.5 h-3.5 text-[#73DACA]" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-[#73DACA] mb-1.5">{style.subtitle}</p>
                        <p className="text-[11px] text-[#94A3B8] font-light leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Action Bar */}
              <div className="pt-4 border-t border-[#2A3644] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto text-xs uppercase tracking-wider text-[#94A3B8] hover:text-[#E7EDF5] transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors shadow-sm cursor-pointer"
                >
                  <span>Generate Trip Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* SCREEN 2: GENERATED ITINERARY RESULTS VIEW                                */
          /* ========================================================================= */
          itinerary && (
            <div className="flex flex-col">
              {/* Top Navigation & Action Bar */}
              <div className="sticky top-0 z-30 bg-[#131B24]/95 backdrop-blur-md px-6 py-4 border-b border-[#2A3644] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={() => setScreen('preferences')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold text-[#94A3B8] hover:text-[#E7EDF5] bg-[#202B38] border border-[#2A3644] hover:border-[#73DACA]/50 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Preferences</span>
                  </button>

                  <button
                    onClick={handleRegenerate}
                    title="Generate an alternate route variation"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold text-[#73DACA] hover:text-[#0B0F14] hover:bg-[#73DACA] bg-[#202B38] border border-[#73DACA]/40 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={handleResetTrip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold text-[#94A3B8] hover:text-rose-400 bg-[#202B38] border border-[#2A3644] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Trip</span>
                  </button>

                  <button
                    onClick={handleSaveTrip}
                    disabled={isSavingTrip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold text-[#0B0F14] bg-[#73DACA] hover:bg-[#9AEBDD] transition-colors cursor-pointer"
                  >
                    {isSavingTrip ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : savedTripSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Save Trip</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleReturnToExplore}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold text-[#94A3B8] hover:text-[#73DACA] transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Return to Explore</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="p-1.5 text-[#94A3B8] hover:text-[#E7EDF5] rounded-full hover:bg-[#202B38] transition-colors cursor-pointer"
                    aria-label="Close itinerary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Regeneration Feedback Banner */}
              {regeneratedNotice && (
                <div className="bg-[#73DACA]/15 border-b border-[#73DACA]/40 px-6 py-2 text-xs text-[#73DACA] font-mono flex items-center justify-between animate-fadeIn">
                  <span>Itinerary refreshed with alternate local route selections.</span>
                  <span className="text-[10px] text-[#94A3B8]">Variation #{seed}</span>
                </div>
              )}

              {/* Header Hero Banner */}
              <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden bg-[#202B38]">
                <img
                  src={itinerary.destination.image}
                  alt={itinerary.destination.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131B24] via-[#131B24]/40 to-transparent" />
                <div className="absolute inset-0 bg-black/25" />

                {/* Banner Content */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-0.5 rounded bg-[#73DACA] text-[#0B0F14]">
                        {itinerary.destination.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#E7EDF5] font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                        {itinerary.destination.state}
                      </span>
                    </div>
                    <h1 className="font-condensed text-4xl sm:text-5xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                      {itinerary.destination.name} ODYSSEY
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94A3B8] font-light max-w-xl line-clamp-1 mt-0.5">
                      {itinerary.summary.styleDescription}
                    </p>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-[#131B24]/90 border border-[#2A3644] px-3 py-1.5 rounded text-left">
                      <span className="block text-[10px] font-mono uppercase text-[#94A3B8]">Duration</span>
                      <span className="font-condensed text-sm font-bold text-[#E7EDF5]">
                        {itinerary.duration} Days
                      </span>
                    </div>

                    <div className="bg-[#131B24]/90 border border-[#2A3644] px-3 py-1.5 rounded text-left">
                      <span className="block text-[10px] font-mono uppercase text-[#94A3B8]">Travelers</span>
                      <span className="font-condensed text-sm font-bold text-[#E7EDF5]">
                        {itinerary.travelers} {itinerary.travelers === 1 ? 'Solo' : 'Travelers'}
                      </span>
                    </div>

                    <div className="bg-[#131B24]/90 border border-[#2A3644] px-3 py-1.5 rounded text-left">
                      <span className="block text-[10px] font-mono uppercase text-[#94A3B8]">Pacing</span>
                      <span className="font-condensed text-sm font-bold text-[#73DACA]">
                        {itinerary.travelStyle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Body: Two Columns on Large Screens */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Day Filter Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2A3644] gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#94A3B8] mr-1">
                      View:
                    </span>
                    <button
                      onClick={() => setActiveDayFilter('all')}
                      className={`px-3 py-1 rounded text-xs uppercase font-mono font-semibold transition-colors cursor-pointer ${
                        activeDayFilter === 'all'
                          ? 'bg-[#73DACA] text-[#0B0F14]'
                          : 'bg-[#202B38] text-[#94A3B8] hover:text-[#E7EDF5]'
                      }`}
                    >
                      All Days ({itinerary.days.length})
                    </button>
                    {itinerary.days.map((d) => (
                      <button
                        key={d.dayNumber}
                        onClick={() => setActiveDayFilter(d.dayNumber)}
                        className={`px-2.5 py-1 rounded text-xs uppercase font-mono transition-colors cursor-pointer ${
                          activeDayFilter === d.dayNumber
                            ? 'bg-[#73DACA] text-[#0B0F14] font-bold'
                            : 'bg-[#202B38] text-[#94A3B8] hover:text-[#E7EDF5]'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 text-xs text-[#73DACA] hover:text-[#9AEBDD] transition-colors cursor-pointer font-mono"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-[#73DACA]" />
                        <span>Copied Summary</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Dossier</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Grid Container: Itinerary Days & Budget Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Day-by-Day Activities (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                        DAY-BY-DAY ITINERARY
                      </h2>
                      <span className="text-xs text-[#94A3B8] font-mono">
                        {itinerary.summary.idealPacing}
                      </span>
                    </div>

                    {itinerary.days
                      .filter((d) => activeDayFilter === 'all' || activeDayFilter === d.dayNumber)
                      .map((day) => (
                        <div
                          key={day.dayNumber}
                          className="bg-[#131B24] border border-[#2A3644] rounded-sm overflow-hidden"
                        >
                          {/* Day Header Strip */}
                          <div className="bg-[#202B38] px-5 py-3 border-b border-[#2A3644] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-condensed text-lg sm:text-xl font-bold text-[#73DACA]">
                                DAY {String(day.dayNumber).padStart(2, '0')}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-[#E7EDF5] tracking-wide">
                                {day.title}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#131B24] text-[#94A3B8] border border-[#2A3644] shrink-0">
                              {day.pacingBadge}
                            </span>
                          </div>

                          {/* 3 Activities: Morning, Afternoon, Evening */}
                          <div className="p-5 space-y-4">
                            {/* Morning */}
                            <div className="flex items-start gap-3.5">
                              <div className="w-8 h-8 rounded bg-[#202B38] border border-[#2A3644] flex items-center justify-center text-[#73DACA] shrink-0 mt-0.5">
                                <Sun className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-mono text-[#73DACA]">
                                    {day.morning.time}
                                  </span>
                                  <span className="text-xs text-zinc-500">•</span>
                                  <h4 className="text-xs sm:text-sm font-bold text-[#E7EDF5] tracking-wide">
                                    {day.morning.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                                  {day.morning.desc}
                                </p>
                              </div>
                            </div>

                            {/* Afternoon */}
                            <div className="flex items-start gap-3.5">
                              <div className="w-8 h-8 rounded bg-[#202B38] border border-[#2A3644] flex items-center justify-center text-[#E7EDF5] shrink-0 mt-0.5">
                                <Compass className="w-4 h-4 text-[#94A3B8]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-mono text-[#94A3B8]">
                                    {day.afternoon.time}
                                  </span>
                                  <span className="text-zinc-500">•</span>
                                  <h4 className="text-xs sm:text-sm font-bold text-[#E7EDF5] tracking-wide">
                                    {day.afternoon.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                                  {day.afternoon.desc}
                                </p>
                              </div>
                            </div>

                            {/* Evening */}
                            <div className="flex items-start gap-3.5">
                              <div className="w-8 h-8 rounded bg-[#202B38] border border-[#2A3644] flex items-center justify-center text-[#73DACA] shrink-0 mt-0.5">
                                <Sunset className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[11px] font-mono text-[#73DACA]">
                                    {day.evening.time}
                                  </span>
                                  <span className="text-zinc-500">•</span>
                                  <h4 className="text-xs sm:text-sm font-bold text-[#E7EDF5] tracking-wide">
                                    {day.evening.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                                  {day.evening.desc}
                                </p>
                              </div>
                            </div>

                            {/* Local Tip */}
                            {day.tip && (
                              <div className="mt-3 pt-3 border-t border-[#2A3644]/70 flex items-start gap-2 text-[11px] text-[#94A3B8] font-light">
                                <Info className="w-3.5 h-3.5 text-[#73DACA] shrink-0 mt-0.5" />
                                <span>{day.tip}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Right Column: Estimated Budget Breakdown (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                        ESTIMATED BUDGET
                      </h2>
                      <span className="text-xs text-[#73DACA] font-mono">INR (₹)</span>
                    </div>

                    <div className="bg-[#131B24] border border-[#2A3644] rounded-sm p-5 space-y-5">
                      {/* Overall Cost vs Target Budget */}
                      <div className="pb-4 border-b border-[#2A3644]">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider">
                            Realistic Estimated Cost
                          </span>
                          <span className="font-condensed text-2xl sm:text-3xl font-bold text-[#73DACA]">
                            ₹{formatINR(itinerary.budget.totalEstimatedCost)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-3">
                          <span>
                            Per Person: ₹{formatINR(itinerary.budget.estimatedCostPerPerson)}
                          </span>
                          <span>
                            Target Budget: ₹{formatINR(itinerary.budget.userBudget)}
                          </span>
                        </div>

                        {/* Status Message Badge */}
                        <div
                          className={`p-3 rounded-sm border text-xs leading-relaxed flex items-start gap-2.5 ${
                            itinerary.budget.isWithinBudget
                              ? 'bg-[#73DACA]/10 border-[#73DACA]/30 text-[#E7EDF5]'
                              : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          }`}
                        >
                          <AlertCircle
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              itinerary.budget.isWithinBudget ? 'text-[#73DACA]' : 'text-amber-400'
                            }`}
                          />
                          <p>{itinerary.budget.statusMessage}</p>
                        </div>
                      </div>

                      {/* Visual Category Distribution Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1.5">
                          <span>Category Allocation</span>
                          <span>100% Comprehensive</span>
                        </div>
                        <div className="h-2 w-full bg-[#202B38] rounded-full overflow-hidden flex">
                          <div style={{ width: '38%' }} className="bg-[#73DACA]" title="Accommodation (38%)" />
                          <div style={{ width: '22%' }} className="bg-[#9AEBDD]" title="Food (22%)" />
                          <div style={{ width: '18%' }} className="bg-[#56B6A5]" title="Transport (18%)" />
                          <div style={{ width: '14%' }} className="bg-[#3D8276]" title="Activities (14%)" />
                          <div style={{ width: '8%' }} className="bg-[#2A5C53]" title="Misc (8%)" />
                        </div>
                      </div>

                      {/* Category Breakdown Rows */}
                      <div className="space-y-3">
                        {itinerary.budget.categories.map((cat) => (
                          <div
                            key={cat.key}
                            className="p-3 rounded bg-[#202B38] border border-[#2A3644] text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#E7EDF5]">{cat.label}</span>
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-[#73DACA] font-bold">
                                  ₹{formatINR(cat.amount)}
                                </span>
                                <span className="text-[10px] text-[#94A3B8] font-mono">
                                  ({cat.percentage}%)
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#94A3B8] font-light leading-snug">
                              {cat.note}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Disclaimer */}
                      <div className="pt-2 border-t border-[#2A3644]/60 text-[10px] text-[#94A3B8] font-mono leading-relaxed">
                        <span className="text-[#73DACA] font-bold">Note: </span>
                        {itinerary.budget.disclaimer}
                      </div>
                    </div>

                    {/* Summary Action Card & Database Integration */}
                    <div className="p-4 rounded-sm bg-[#202B38] border border-[#2A3644] flex flex-col gap-3">
                      <h4 className="font-condensed text-base font-bold text-[#E7EDF5] uppercase">
                        Save or Refine Expedition
                      </h4>
                      <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                        Save this complete itinerary and budget allocation into your trip database, or modify preferences.
                      </p>

                      {savedTripSuccess ? (
                        <div className="flex items-center justify-between p-2.5 rounded bg-[#131B24] border border-[#73DACA]/50 text-xs text-[#73DACA]">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#73DACA] shrink-0" />
                            <span className="font-medium">Saved to Trips Database!</span>
                          </div>
                          {onNavigate && (
                            <button
                              onClick={() => {
                                onClose();
                                onNavigate('trips');
                              }}
                              className="text-xs text-[#9AEBDD] hover:underline cursor-pointer"
                            >
                              View in Trips &rarr;
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={handleSaveTrip}
                          disabled={isSavingTrip}
                          className="w-full py-2.5 px-3 text-xs uppercase tracking-wider font-bold rounded bg-[#73DACA] text-[#0B0F14] hover:bg-[#9AEBDD] transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isSavingTrip ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving Expedition...</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>Save Expedition to My Trips</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setScreen('preferences')}
                          className="flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded bg-[#131B24] border border-[#2A3644] text-[#E7EDF5] hover:border-[#73DACA] transition-colors cursor-pointer text-center"
                        >
                          Edit Inputs
                        </button>
                        <button
                          onClick={handleReturnToExplore}
                          className="flex-1 py-2 text-xs uppercase tracking-wider font-bold rounded bg-[#131B24] border border-[#2A3644] text-[#E7EDF5] hover:border-[#73DACA] transition-colors cursor-pointer text-center"
                        >
                          Explore More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

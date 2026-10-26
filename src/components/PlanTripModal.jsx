import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';

const DESTINATIONS = [
  'Ladakh',
  'Kashmir',
  'Rajasthan',
  'Meghalaya',
  'Kerala',
  'Manali & Spiti',
  'Varanasi',
  'Hampi',
  'Jodhpur',
];

const STYLES = [
  { id: 'heritage', title: 'Royal Heritage & Palaces', desc: 'Private palace stays & candlelit courtyards' },
  { id: 'celestial', title: 'High Altitude & Stargazing', desc: 'Heated luxury domes at 14,000 ft' },
  { id: 'scenic', title: 'Backwaters & Cloud Forests', desc: 'Silent cedar houseboats & misty cascades' },
  { id: 'wellness', title: 'Ayurveda & Soul Retreats', desc: 'Holistic therapies & mountain silence' },
];

export default function PlanTripModal({ isOpen, onClose, initialDestination = 'Ladakh' }) {
  const [step, setStep] = useState(1);
  const [selectedDest, setSelectedDest] = useState(initialDestination);
  const [selectedStyle, setSelectedStyle] = useState('Royal Heritage & Palaces');
  const [duration, setDuration] = useState('7 — 10 Days (Recommended Grand Route)');
  const [travelers, setTravelers] = useState('Couple (2 Travelers)');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#131B24] border border-[#2A3644] rounded-sm p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-[#94A3B8] hover:text-[#E7EDF5] rounded-full hover:bg-[#202B38] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#73DACA]/15 border border-[#73DACA]/40 flex items-center justify-center text-[#73DACA] mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#E7EDF5] mb-2 tracking-wide">
              Bespoke Route Initiated
            </h3>
            <p className="text-[#94A3B8] text-sm max-w-md font-light leading-relaxed mb-6">
              Thank you. Our private concierge has mapped your custom itinerary for{' '}
              <strong className="text-[#73DACA] font-semibold">{selectedDest}</strong> ({duration},{' '}
              {travelers}).
            </p>
            <div className="p-4 rounded bg-[#202B38] border border-[#2A3644] text-xs text-[#94A3B8] max-w-md w-full text-left mb-6 font-mono space-y-1">
              <div>• Destination: {selectedDest}</div>
              <div>• Journey Style: {selectedStyle}</div>
              <div>• Target Window: Upcoming Season</div>
              <div>• Concierge Reference: TC-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <button
              onClick={resetAndClose}
              className="px-8 py-3 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              Return To Experience
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-[#2A3644]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#73DACA] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TripCraft Planner</span>
              </div>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                CURATE YOUR INDIAN ODYSSEY
              </h3>
              <p className="text-[#94A3B8] text-xs mt-1 font-light">
                Tailored pacing, private ground logistics, and hand-selected heritage sanctuaries.
              </p>
            </div>

            {/* Stepper Tabs */}
            <div className="flex items-center gap-2 mb-6 text-xs font-mono">
              <span className={`px-3 py-1 rounded ${step === 1 ? 'bg-[#73DACA] text-[#0B0F14] font-bold' : 'bg-[#202B38] text-[#94A3B8]'}`}>
                01. DESTINATION
              </span>
              <span className="text-[#94A3B8]">→</span>
              <span className={`px-3 py-1 rounded ${step === 2 ? 'bg-[#73DACA] text-[#0B0F14] font-bold' : 'bg-[#202B38] text-[#94A3B8]'}`}>
                02. STYLE & DURATION
              </span>
            </div>

            {/* Step 1: Destination Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold">
                  Select Target Region
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setSelectedDest(dest)}
                      className={`p-3 rounded text-left text-xs uppercase tracking-wider transition-all border cursor-pointer ${
                        selectedDest === dest
                          ? 'bg-[#202B38] border-[#73DACA] text-[#E7EDF5] font-bold'
                          : 'bg-[#202B38]/60 border-[#2A3644] text-[#94A3B8] hover:border-[#2A3644] hover:text-[#E7EDF5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{dest}</span>
                        {selectedDest === dest && <Check className="w-3.5 h-3.5 text-[#73DACA]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
                  >
                    <span>Next: Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Style, Duration & Contact */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold mb-2">
                    Journey Atmosphere
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.title)}
                        className={`p-3 rounded text-left text-xs transition-all border cursor-pointer ${
                          selectedStyle === style.title
                            ? 'bg-[#202B38] border-[#73DACA] text-[#E7EDF5] font-semibold'
                            : 'bg-[#202B38]/60 border-[#2A3644] text-[#94A3B8] hover:border-[#2A3644]'
                        }`}
                      >
                        <div className="font-semibold text-[#E7EDF5] mb-0.5">{style.title}</div>
                        <div className="text-[11px] text-[#94A3B8] font-light">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold mb-1.5">
                      Desired Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                    >
                      <option>4 — 6 Days (Essential Circuit)</option>
                      <option>7 — 10 Days (Recommended Grand Route)</option>
                      <option>12 — 15 Days (Slow Immersion Expedition)</option>
                      <option>16+ Days (Pan-India Master Circuit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold mb-1.5">
                      Travel Party
                    </label>
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                    >
                      <option>Solo Traveler</option>
                      <option>Couple (2 Travelers)</option>
                      <option>Family (3 — 5 Travelers)</option>
                      <option>Private Group (6+ Travelers)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#E7EDF5] font-semibold mb-1.5">
                    Your Email for Itinerary Dossier
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2.5 text-xs text-[#E7EDF5] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#73DACA]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#94A3B8] hover:text-[#E7EDF5] uppercase tracking-wider cursor-pointer"
                  >
                    ← Back to destination
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
                  >
                    <span>Receive Custom Plan</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

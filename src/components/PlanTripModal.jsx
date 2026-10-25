import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles, MapPin, Calendar, Users, Compass } from 'lucide-react';

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
  const [selectedStyle, setSelectedStyle] = useState('heritage');
  const [duration, setDuration] = useState('7 — 10 Days');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#111418] border border-white/15 rounded-sm p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#E05A2B]/20 border border-[#E05A2B]/40 flex items-center justify-center text-[#E05A2B] mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-white mb-2 tracking-wide">
              Bespoke Route Initiated
            </h3>
            <p className="text-zinc-300 text-sm max-w-md font-light leading-relaxed mb-6">
              Thank you! Our private concierge has mapped your custom itinerary for{' '}
              <strong className="text-[#E05A2B] font-semibold">{selectedDest}</strong> ({duration},{' '}
              {travelers}).
            </p>
            <div className="p-4 rounded bg-[#161A20] border border-white/10 text-xs text-zinc-400 max-w-md w-full text-left mb-6 font-mono space-y-1">
              <div>• Destination: {selectedDest}</div>
              <div>• Journey Style: {selectedStyle}</div>
              <div>• Target Window: Upcoming Season</div>
              <div>• Concierge Reference: TC-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <button
              onClick={resetAndClose}
              className="px-8 py-3 rounded-sm bg-[#E05A2B] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F26A3B] transition-colors"
            >
              Return To Experience
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E05A2B] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TripCraft Planner</span>
              </div>
              <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
                CURATE YOUR INDIAN ODYSSEY
              </h3>
              <p className="text-zinc-400 text-xs mt-1 font-light">
                Tailored pacing, private ground logistics, and hand-selected heritage sanctuaries.
              </p>
            </div>

            {/* Stepper Tabs */}
            <div className="flex items-center gap-2 mb-6 text-xs font-mono">
              <span className={`px-3 py-1 rounded ${step === 1 ? 'bg-[#E05A2B] text-white font-bold' : 'bg-white/5 text-zinc-400'}`}>
                01. DESTINATION
              </span>
              <span className="text-zinc-600">→</span>
              <span className={`px-3 py-1 rounded ${step === 2 ? 'bg-[#E05A2B] text-white font-bold' : 'bg-white/5 text-zinc-400'}`}>
                02. STYLE & DURATION
              </span>
            </div>

            {/* Step 1: Destination Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                  Select Target Region
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setSelectedDest(dest)}
                      className={`p-3 rounded text-left text-xs uppercase tracking-wider transition-all border ${
                        selectedDest === dest
                          ? 'bg-[#E05A2B]/15 border-[#E05A2B] text-white font-bold shadow-[0_0_15px_rgba(224,90,43,0.3)]'
                          : 'bg-[#161A20] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{dest}</span>
                        {selectedDest === dest && <Check className="w-3.5 h-3.5 text-[#E05A2B]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#E05A2B] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F26A3B] transition-colors"
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
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-2">
                    Journey Atmosphere
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.title)}
                        className={`p-3 rounded text-left text-xs transition-all border ${
                          selectedStyle === style.title
                            ? 'bg-[#E05A2B]/15 border-[#E05A2B] text-white font-semibold'
                            : 'bg-[#161A20] border-white/10 text-zinc-400 hover:border-white/30'
                        }`}
                      >
                        <div className="font-semibold text-white mb-0.5">{style.title}</div>
                        <div className="text-[11px] text-zinc-400 font-light">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                      Desired Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#161A20] border border-white/15 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#E05A2B]"
                    >
                      <option>4 — 6 Days (Essential Circuit)</option>
                      <option>7 — 10 Days (Recommended Grand Route)</option>
                      <option>12 — 15 Days (Slow Immersion Expedition)</option>
                      <option>16+ Days (Pan-India Master Circuit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                      Travel Party
                    </label>
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full bg-[#161A20] border border-white/15 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#E05A2B]"
                    >
                      <option>Solo Traveler</option>
                      <option>Couple (2 Travelers)</option>
                      <option>Family (3 — 5 Travelers)</option>
                      <option>Private Group (6+ Travelers)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
                    Your Email for Itinerary Dossier
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#161A20] border border-white/15 rounded p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E05A2B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider"
                  >
                    ← Back to destination
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-sm bg-[#E05A2B] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F26A3B] transition-colors shadow-[0_0_20px_rgba(224,90,43,0.4)] cursor-pointer"
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

import React, { useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Sparkles, ArrowRight, Check } from 'lucide-react';

export default function DestinationDetailModal({ destination, isOpen, onClose, onPlanTrip }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
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

  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#131B24] border border-[#2A3644] rounded-sm overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#202B38] border border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cinematic Header Image */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 overflow-hidden bg-[#202B38]">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131B24] via-[#131B24]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Bottom Badges on Image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-0.5 rounded bg-[#73DACA] text-[#0B0F14]">
                  {destination.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#94A3B8] font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                  {destination.state}
                </span>
              </div>
              <h2 className="font-condensed text-4xl sm:text-5xl font-bold uppercase text-[#E7EDF5] tracking-wide">
                {destination.name}
              </h2>
            </div>

            {/* Estimated Budget Highlight */}
            <div className="bg-[#202B38] border border-[#2A3644] px-4 py-2 rounded-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                Est. Per Person
              </span>
              <span className="font-condensed text-xl sm:text-2xl font-bold text-[#73DACA]">
                {destination.budgetFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#73DACA] font-semibold mb-2">
              The Journey
            </h3>
            <p className="text-[#94A3B8] text-sm sm:text-base font-light leading-relaxed">
              {destination.shortDescription}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2A3644]">
            <div className="p-3 rounded bg-[#202B38] border border-[#2A3644]">
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#73DACA]" />
                <span>Best Season</span>
              </div>
              <span className="font-medium text-xs sm:text-sm text-[#E7EDF5]">
                {destination.bestSeason}
              </span>
            </div>

            <div className="p-3 rounded bg-[#202B38] border border-[#2A3644]">
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1">
                <Clock className="w-3.5 h-3.5 text-[#73DACA]" />
                <span>Recommended</span>
              </div>
              <span className="font-medium text-xs sm:text-sm text-[#E7EDF5]">
                {destination.duration}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded bg-[#202B38] border border-[#2A3644]">
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#73DACA]" />
                <span>Travel Style</span>
              </div>
              <span className="font-medium text-xs sm:text-sm text-[#E7EDF5]">
                Private Expedition
              </span>
            </div>
          </div>

          {/* Highlights */}
          {destination.highlights && (
            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] font-semibold mb-3">
                Key Experiences & Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <Check className="w-3.5 h-3.5 text-[#73DACA] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-[#2A3644] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-xs uppercase tracking-wider text-[#94A3B8] hover:text-[#E7EDF5] transition-colors cursor-pointer"
            >
              ← Back to Destinations
            </button>
            <button
              onClick={() => {
                onClose();
                onPlanTrip(destination.name);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

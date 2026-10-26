import React from 'react';
import { Play } from 'lucide-react';
import { INSPIRATION_DATA } from '../data/destinations';

export default function TravelInspiration({ onOpenPlanModal }) {
  return (
    <section id="inspiration" className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between py-24 sm:py-32 bg-[#0B0F14] overflow-hidden select-none border-t border-[#2A3644]">
      {/* Background Panoramic Starry Sky and Himalayan Mountain Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={INSPIRATION_DATA.image}
          alt="Himalayan starry sky over mountain peaks"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.1]"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Layered Subtle Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/85 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full flex-grow flex flex-col justify-between">
        {/* Top/Middle Left: Monumental Condensed Typography */}
        <div className="max-w-2xl pt-10 sm:pt-16">
          <h2 className="font-condensed text-5xl sm:text-7xl lg:text-8xl font-bold uppercase text-[#E7EDF5] tracking-tight leading-[0.92] drop-shadow-md">
            <span>{INSPIRATION_DATA.titleLine1}</span> <br />
            <span>{INSPIRATION_DATA.titleLine2}</span> <br />
            <span>{INSPIRATION_DATA.titleLine3}</span>
          </h2>

          {/* Thin Divider Line */}
          <div className="w-20 h-[1.5px] bg-[#2A3644] my-6 sm:my-8" />

          {/* Play / Explore Button with Arctic Teal hover */}
          <button
            onClick={() => onOpenPlanModal('Ladakh Celestial Expedition')}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-[#2A3644] bg-[#131B24]/80 flex items-center justify-center text-[#E7EDF5] group-hover:bg-[#73DACA] group-hover:border-[#73DACA] group-hover:text-[#0B0F14] transition-all duration-300">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
            <span className="text-xs sm:text-[13px] tracking-wider text-[#94A3B8] group-hover:text-[#E7EDF5] transition-colors font-medium">
              {INSPIRATION_DATA.actionLabel}
            </span>
          </button>
        </div>

        {/* Bottom Area: Short Description (Left) & Two Small Preview Cards (Right) */}
        <div className="pt-16 sm:pt-24 flex flex-col md:flex-row items-end justify-between gap-10">
          {/* Left: Concise natural description text */}
          <div className="max-w-sm">
            <p className="text-[#94A3B8] text-xs sm:text-[13px] font-light leading-relaxed">
              {INSPIRATION_DATA.shortDesc}
            </p>
          </div>

          {/* Right: Two Small Landscape Video/Preview Thumbnails */}
          <div className="flex items-center gap-4">
            {INSPIRATION_DATA.previews.map((prev) => (
              <div
                key={prev.id}
                onClick={() => onOpenPlanModal(prev.title)}
                className="group relative w-36 sm:w-44 h-24 sm:h-28 rounded-sm overflow-hidden bg-[#131B24] border border-[#2A3644] cursor-pointer shadow-sm hover:border-[#73DACA]/60 transition-all duration-300"
              >
                <img
                  src={prev.image}
                  alt={prev.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#131B24]/80 border border-[#2A3644] flex items-center justify-center text-[#E7EDF5] group-hover:bg-[#73DACA] group-hover:border-[#73DACA] group-hover:text-[#0B0F14] transition-all">
                    <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

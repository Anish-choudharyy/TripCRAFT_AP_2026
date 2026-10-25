import React from 'react';
import { Play } from 'lucide-react';
import { INSPIRATION_DATA } from '../data/destinations';

export default function TravelInspiration({ onOpenPlanModal }) {
  return (
    <section id="inspiration" className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between py-24 sm:py-32 bg-[#0b0d10] overflow-hidden select-none border-t border-white/10">
      {/* Background Panoramic Starry Sky and Himalayan Mountain Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={INSPIRATION_DATA.image}
          alt="Himalayan starry sky over mountain peaks"
          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1]"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Layered Subtle Overlays matching Image 1 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-[#111419]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d10]/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full flex-grow flex flex-col justify-between">
        {/* Top/Middle Left: Monumental Condensed Typography matching Image 1 */}
        <div className="max-w-2xl pt-10 sm:pt-16">
          <h2 className="font-condensed text-5xl sm:text-7xl lg:text-8xl font-bold uppercase text-white tracking-tight leading-[0.92] drop-shadow-md">
            <span>{INSPIRATION_DATA.titleLine1}</span> <br />
            <span>{INSPIRATION_DATA.titleLine2}</span> <br />
            <span>{INSPIRATION_DATA.titleLine3}</span>
          </h2>

          {/* Thin Diagonal/Horizontal Accent Line matching Image 1 */}
          <div className="w-20 h-[1.5px] bg-white/40 my-6 sm:my-8" />

          {/* Play / Explore Button matching Image 1 */}
          <button
            onClick={() => onOpenPlanModal('Ladakh Celestial Expedition')}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-[#E05A2B] group-hover:border-[#E05A2B] transition-all duration-300">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
            <span className="text-xs sm:text-[13px] tracking-wider text-zinc-300 group-hover:text-white transition-colors font-medium">
              {INSPIRATION_DATA.actionLabel}
            </span>
          </button>
        </div>

        {/* Bottom Area: Short Description (Left) & Two Small Preview Cards (Right) matching Image 1 */}
        <div className="pt-16 sm:pt-24 flex flex-col md:flex-row items-end justify-between gap-10">
          {/* Left: Concise natural description text */}
          <div className="max-w-sm">
            <p className="text-zinc-400 text-xs sm:text-[13px] font-light leading-relaxed">
              {INSPIRATION_DATA.shortDesc}
            </p>
          </div>

          {/* Right: Two Small Landscape Video/Preview Thumbnails matching Image 1 */}
          <div className="flex items-center gap-4">
            {INSPIRATION_DATA.previews.map((prev) => (
              <div
                key={prev.id}
                onClick={() => onOpenPlanModal(prev.title)}
                className="group relative w-36 sm:w-44 h-24 sm:h-28 rounded-sm overflow-hidden bg-black/50 border border-white/15 cursor-pointer shadow-xl hover:border-white/40 transition-all duration-300"
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
                  <div className="w-7 h-7 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white group-hover:bg-[#E05A2B] group-hover:border-[#E05A2B] transition-all">
                    <Play className="w-2.5 h-2.5 fill-white translate-x-0.5" />
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

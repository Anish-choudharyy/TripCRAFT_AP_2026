import React from 'react';
import { POPULAR_TOURS } from '../data/destinations';

export default function PopularDestinations({ onSelectDestination }) {
  return (
    <section id="tours" className="relative py-24 sm:py-32 bg-[#0B0F14] border-t border-[#2A3644]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header: Centered Subtitle & Clean Bold Title */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light tracking-wider lowercase mb-2">
            and experience unforgettable journeys
          </p>
          <h2 className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-[#E7EDF5]">
            POPULAR TOURS
          </h2>
        </div>

        {/* 4 Photographic Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {POPULAR_TOURS.map((tour) => (
            <div
              key={tour.id}
              onClick={() => onSelectDestination && onSelectDestination(tour.destination)}
              className="group relative rounded-sm overflow-hidden bg-[#131B24] border border-[#2A3644] hover:border-[#73DACA]/50 cursor-pointer flex flex-col justify-end aspect-[3/4.2] shadow-sm transition-all duration-500 hover:-translate-y-1"
            >
              {/* Background Photo */}
              <img
                src={tour.image}
                alt={tour.destination}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />

              {/* Clean Dark Gradient Overlay at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/40 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />

              {/* Card Bottom Text */}
              <div className="relative z-10 p-5 text-center flex flex-col items-center">
                <h3 className="font-condensed text-lg sm:text-xl font-bold uppercase text-[#E7EDF5] tracking-wider mb-1 group-hover:text-[#73DACA] transition-colors">
                  {tour.label}
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-light tracking-wide leading-tight">
                  {tour.caption}
                </p>
              </div>

              {/* Thin subtle bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2A3644] group-hover:bg-[#73DACA] transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Thin Divider Line */}
        <div className="mt-20 w-32 mx-auto h-[1px] bg-[#2A3644]" />
      </div>
    </section>
  );
}

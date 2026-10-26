import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, ArrowRight, RotateCcw, Filter, Compass } from 'lucide-react';
import { EXPLORE_CATEGORIES, EXPLORE_DESTINATIONS } from '../data/destinations';
import DestinationDetailModal from './DestinationDetailModal';

export default function ExplorePage({ onPlanTrip, onBackToHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter destinations based on search query (name or state) and category
  const filteredDestinations = useMemo(() => {
    return EXPLORE_DESTINATIONS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.state.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCardClick = (destination) => {
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="pt-24 pb-28 min-h-screen bg-[#0B0F14] text-[#E7EDF5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-condensed tracking-[0.2em] text-[#94A3B8] hover:text-[#E7EDF5] transition-colors cursor-pointer"
          >
            <span>← RETURN TO HOME</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-12 border-b border-[#2A3644] pb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#73DACA] font-semibold mb-3">
            <span className="w-2 h-0.5 bg-[#73DACA]" />
            <span>DISCOVER THE SUBCONTINENT</span>
          </div>

          <h1 className="font-condensed text-4xl sm:text-6xl lg:text-7xl font-bold uppercase text-[#E7EDF5] tracking-tight leading-[0.95] mb-4">
            EXPLORE DESTINATIONS
          </h1>

          <p className="text-[#94A3B8] text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            From high Himalayan glacial sanctuaries to golden Thar desert citadels and emerald tropical backwaters — discover authentic circuits tailored across India.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-6 mb-12">
          {/* Search Input Bar with Elevated Surface */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, state, or region (e.g. Manali, Rajasthan, Goa)..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#202B38] border border-[#2A3644] rounded-sm text-sm text-[#E7EDF5] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#73DACA] transition-colors"
              id="destination-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#E7EDF5] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-[#94A3B8] mr-2">
              <Filter className="w-3.5 h-3.5 text-[#73DACA]" />
              Filter:
            </span>

            {EXPLORE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#73DACA] text-[#0B0F14]'
                      : 'bg-[#131B24] border border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5] hover:border-[#73DACA]/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results Count & Active Filter Indicator */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono pt-2">
            <div>
              Showing <span className="text-[#E7EDF5] font-bold">{filteredDestinations.length}</span> of{' '}
              {EXPLORE_DESTINATIONS.length} Indian destinations
              {(searchQuery || selectedCategory !== 'All') && (
                <span className="text-[#73DACA] ml-2 font-normal">
                  (Filtered by {selectedCategory !== 'All' ? `"${selectedCategory}"` : ''}
                  {searchQuery ? ` matching "${searchQuery}"` : ''})
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#73DACA] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Destination Card Grid or Empty State */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleCardClick(dest)}
                className="group relative rounded-sm overflow-hidden bg-[#131B24] border border-[#2A3644] hover:border-[#73DACA]/50 transition-all duration-500 cursor-pointer flex flex-col justify-end aspect-[3/4] shadow-sm"
              >
                {/* Background Photo */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.9] contrast-[1.05]"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Clean Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/50 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 bg-black/15" />
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-1 rounded bg-[#202B38] text-[#73DACA] border border-[#2A3644]">
                    {dest.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#E7EDF5] px-2.5 py-0.5 rounded bg-[#131B24]/90 border border-[#2A3644]">
                    {dest.budgetFormatted}
                  </span>
                </div>

                {/* Card Content at Bottom */}
                <div className="relative z-10 p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono tracking-wider uppercase mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                    <span>{dest.state}</span>
                  </div>

                  <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#E7EDF5] tracking-wide group-hover:text-[#73DACA] transition-colors mb-2">
                    {dest.name}
                  </h3>

                  <p className="text-[#94A3B8] text-xs font-light line-clamp-2 leading-relaxed mb-4">
                    {dest.shortDescription}
                  </p>

                  <div className="pt-3 border-t border-[#2A3644] flex items-center justify-between text-[11px] font-condensed tracking-[0.16em] uppercase">
                    <span className="text-[#94A3B8] group-hover:text-[#E7EDF5] transition-colors">
                      VIEW DETAILS
                    </span>
                    <span className="text-[#73DACA] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>

                  {/* Thin Bottom Arctic Teal Accent Line on Hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#73DACA] group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 px-6 text-center rounded-sm bg-[#131B24] border border-[#2A3644] flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#202B38] border border-[#2A3644] flex items-center justify-center text-[#73DACA] mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-[#E7EDF5] tracking-wide mb-2">
              NO DESTINATIONS FOUND
            </h3>
            <p className="text-[#94A3B8] text-xs sm:text-sm font-light max-w-md leading-relaxed mb-6">
              We couldn't find any Indian destinations matching "{searchQuery}" in the "
              {selectedCategory}" category.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onPlanTrip={onPlanTrip}
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Mountain, Compass, Plane } from 'lucide-react';
import { HERO_SLIDES } from '../data/destinations';

export default function HeroSlider({ onOpenPlanModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION = 6000;
  const progressIntervalRef = useRef(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  const goToSlide = (index) => {
    setCurrentIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);

  // Auto-play progress loop
  useEffect(() => {
    const intervalStep = 50;
    const increment = (intervalStep / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalStep);

    return () => clearInterval(progressIntervalRef.current);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 bg-[#0B0F14] overflow-hidden select-none">
      {/* Background Cinematic Photography Container */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Calibrated Cinematic Overlays */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0B0F14]/75 via-[#0B0F14]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/65 via-35% to-transparent" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        ))}
      </div>

      {/* Middle Content Row: Bold Condensed Heading (Left) + Vertical Number Slider (Right) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full my-auto py-8 sm:py-12">
        <div className="flex items-center justify-between">
          {/* Left: Bold Condensed Headline */}
          <div className="max-w-3xl">
            <h1 className="font-condensed text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] font-bold text-[#E7EDF5] uppercase tracking-tight leading-[0.88] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              <span className="block text-[#E7EDF5]/90">{currentSlide.label}</span>
              <span className="block text-[#E7EDF5]">{currentSlide.title}</span>
            </h1>

            {/* Three Minimal Line-Art Icons Below Title */}
            <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-10 text-[#94A3B8]">
              <div className="flex items-center justify-center text-[#73DACA]">
                <Mountain className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="flex items-center justify-center text-[#94A3B8] hover:text-[#E7EDF5] transition-colors">
                <Compass className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="flex items-center justify-center text-[#94A3B8] hover:text-[#E7EDF5] transition-colors">
                <Plane className="w-5 h-5 stroke-[1.5]" />
              </div>
            </div>
          </div>

          {/* Right: Vertical Number Slider */}
          <div className="hidden sm:flex flex-col items-end gap-2 pr-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className="flex items-center justify-end gap-3 sm:gap-4 py-1 cursor-pointer group transition-all"
                  aria-label={`Slide ${slide.number} ${slide.title}`}
                >
                  <span
                    className={`font-condensed tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'text-[#E7EDF5] text-2xl sm:text-3xl font-bold'
                        : 'text-[#94A3B8] hover:text-[#E7EDF5] text-xs sm:text-sm font-medium'
                    }`}
                  >
                    {slide.number}
                  </span>
                  {/* Active Slide Extension Line */}
                  <span
                    className={`transition-all duration-500 ${
                      isActive
                        ? 'w-10 sm:w-16 h-[1.5px] bg-[#E7EDF5] opacity-100'
                        : 'w-0 h-[1px] bg-[#2A3644] opacity-0 group-hover:w-4 group-hover:opacity-50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Slide Indicator */}
        <div className="sm:hidden flex items-center justify-between pt-6 border-b border-[#2A3644] mt-6">
          <div className="flex items-center gap-3">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`font-condensed text-xs font-semibold py-1 transition-colors ${
                  idx === currentIndex ? 'text-[#E7EDF5] border-b-2 border-[#73DACA]' : 'text-[#94A3B8]'
                }`}
              >
                {slide.number}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-condensed tracking-wider uppercase text-[#94A3B8]">
            {currentSlide.title}
          </span>
        </div>
      </div>

      {/* Bottom Hero Bar: 3 Minimalist Columns with Active Arctic Teal Progress Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full">
        <div className="border-t border-[#2A3644] pt-6 sm:pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-14">
          {/* Column 1: Active Route Details & Underline Progress */}
          <div className="flex flex-col justify-between">
            <p className="text-[#94A3B8] text-xs sm:text-[13px] font-light leading-relaxed mb-3 sm:min-h-[2.5rem]">
              {currentSlide.detailsCol1}
            </p>
            <div className="relative inline-block w-fit">
              <button
                onClick={() => onOpenPlanModal(currentSlide.title)}
                className="flex items-center gap-2 font-condensed text-xs sm:text-sm tracking-[0.18em] uppercase text-[#E7EDF5] hover:text-[#73DACA] transition-colors pb-2 cursor-pointer font-bold"
              >
                <span>EXPLORE →</span>
              </button>
              {/* Arctic Teal Active Progress Line directly under the active link */}
              <div className="w-32 sm:w-36 h-[2px] bg-[#202B38] relative overflow-hidden rounded-full">
                <div
                  className="h-full bg-[#73DACA] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Route Highlights */}
          <div className="hidden md:flex flex-col justify-between">
            <p className="text-[#94A3B8] text-xs sm:text-[13px] font-light leading-relaxed mb-3 sm:min-h-[2.5rem]">
              {currentSlide.detailsCol2}
            </p>
            <div>
              <button
                onClick={() => onOpenPlanModal(currentSlide.title)}
                className="flex items-center gap-2 font-condensed text-xs sm:text-sm tracking-[0.18em] uppercase text-[#94A3B8] hover:text-[#E7EDF5] transition-colors pb-2 cursor-pointer"
              >
                <span>DETAILS →</span>
              </button>
            </div>
          </div>

          {/* Column 3: Season & Overland Notes */}
          <div className="hidden md:flex flex-col justify-between">
            <p className="text-[#94A3B8] text-xs sm:text-[13px] font-light leading-relaxed mb-3 sm:min-h-[2.5rem]">
              {currentSlide.detailsCol3}
            </p>
            <div>
              <button
                onClick={() => onOpenPlanModal(currentSlide.title)}
                className="flex items-center gap-2 font-condensed text-xs sm:text-sm tracking-[0.18em] uppercase text-[#94A3B8] hover:text-[#E7EDF5] transition-colors pb-2 cursor-pointer"
              >
                <span>DETAILS →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

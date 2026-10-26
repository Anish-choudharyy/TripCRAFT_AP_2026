import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar({ currentView = 'home', onNavigate, onOpenPlanModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.view) {
      if (onNavigate) onNavigate(link.view);
      return;
    }

    if (link.href.startsWith('#')) {
      if (currentView !== 'home' && onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'EXPLORE', view: 'explore' },
    { label: 'ABOUT', href: '#about' },
    { label: 'TOURS', href: '#tours' },
    { label: 'STORIES', href: '#inspiration' },
    { label: 'CONTACT', href: '#about' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-16 border-b border-[#2A3644]">
          {/* Logo with restrained teal dot indicator */}
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <span className="w-2 h-2 rounded-full bg-[#73DACA] ring-2 ring-[#73DACA]/30" />
            <span className="font-condensed text-lg sm:text-xl font-bold tracking-[0.16em] text-[#E7EDF5]">
              TRIPCRAFT
            </span>
          </button>

          {/* Minimal Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-11">
            {navLinks.map((link) => {
              const isExploreActive = link.view === 'explore' && currentView === 'explore';
              return (
                <a
                  key={link.label}
                  href={link.href || '#'}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`relative text-[11px] font-medium tracking-[0.18em] transition-colors duration-200 py-1 ${
                    isExploreActive ? 'text-[#E7EDF5]' : 'text-[#94A3B8] hover:text-[#E7EDF5]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isExploreActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#73DACA]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Minimal Search Icon & Plan Trigger */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavigate && onNavigate('explore')}
              className={`transition-colors p-1 cursor-pointer ${
                currentView === 'explore' ? 'text-[#73DACA]' : 'text-[#94A3B8] hover:text-[#E7EDF5]'
              }`}
              aria-label="Search destinations"
              title="Explore and search destinations"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#94A3B8] hover:text-[#E7EDF5] p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131B24]/98 backdrop-blur-md border-b border-[#2A3644] px-6 py-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('home');
              }}
              className="text-left text-xs font-semibold tracking-[0.2em] text-[#94A3B8] hover:text-[#73DACA] py-1 transition-colors"
            >
              HOME
            </button>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || '#'}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-xs font-semibold tracking-[0.2em] py-1 transition-colors ${
                  link.view === 'explore' && currentView === 'explore'
                    ? 'text-[#73DACA]'
                    : 'text-[#94A3B8] hover:text-[#73DACA]'
                }`}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlanModal();
              }}
              className="mt-2 text-left text-xs font-bold tracking-[0.2em] text-[#73DACA] hover:text-[#9AEBDD] uppercase py-1 cursor-pointer"
            >
              Plan Your Trip →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

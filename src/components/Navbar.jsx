import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenPlanModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'EXPLORE', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'TOURS', href: '#tours' },
    { label: 'GALLERY', href: '#tours' },
    { label: 'STORIES', href: '#inspiration' },
    { label: 'CONTACT', href: '#about' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-16 border-b border-white/10">
          {/* Logo matching Image 1: small burnt-orange circle + clean uppercase text */}
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="w-2 h-2 rounded-full bg-[#E05A2B] ring-2 ring-[#E05A2B]/40" />
            <span className="font-condensed text-lg sm:text-xl font-bold tracking-[0.16em] text-white">
              TRIPCRAFT
            </span>
          </a>

          {/* Minimal Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-11">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Minimal Search Icon & Plan Trigger */}
          <div className="flex items-center gap-5">
            <button
              onClick={onOpenPlanModal}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Search or Plan"
              title="Plan your journey"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-300 hover:text-white p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111419]/95 backdrop-blur-md border-b border-white/10 px-6 py-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold tracking-[0.2em] text-zinc-300 hover:text-[#E05A2B] py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlanModal();
              }}
              className="mt-2 text-left text-xs font-bold tracking-[0.2em] text-[#E05A2B] uppercase py-1"
            >
              Plan Your Trip →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState } from 'react';
import { Compass, ArrowRight, Check } from 'lucide-react';

export default function Footer({ onOpenPlanModal, onNavigate }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="about" className="bg-[#0B0F14] border-t border-[#2A3644] pt-20 pb-12 text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A3644]">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer text-left"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#73DACA]" />
              <span className="font-condensed text-xl font-bold tracking-[0.15em] text-[#E7EDF5]">
                TRIPCRAFT
              </span>
            </button>

            <p className="text-[#94A3B8] text-xs sm:text-[13px] font-light leading-relaxed max-w-sm">
              TripCraft curates private, slow-paced journeys across the Indian subcontinent. Exploring wild landscapes, sacred architecture, and remote routes.
            </p>

            <div className="flex items-center gap-4 text-[#94A3B8]">
              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#131B24] border border-[#2A3644] flex items-center justify-center hover:text-[#73DACA] hover:border-[#73DACA]/50 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* X / Twitter SVG */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#131B24] border border-[#2A3644] flex items-center justify-center hover:text-[#73DACA] hover:border-[#73DACA]/50 transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* YouTube SVG */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#131B24] border border-[#2A3644] flex items-center justify-center hover:text-[#73DACA] hover:border-[#73DACA]/50 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#E7EDF5] font-semibold">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider">
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">All Destinations</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Ladakh & Zanskar</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Kashmir Valleys</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Rajasthan Citadels</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Kerala Backwaters</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Himachal & Spiti</button></li>
            </ul>
          </div>

          {/* Experiences (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#E7EDF5] font-semibold">
              Journeys
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider">
              <li><a href="#inspiration" className="hover:text-[#E7EDF5] transition-colors">Celestial Camps</a></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Palace Odysseys</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Himalayan Treks</button></li>
              <li><button onClick={() => onNavigate && onNavigate('explore')} className="hover:text-[#E7EDF5] transition-colors cursor-pointer text-left">Ayurvedic Sanctuaries</button></li>
              <li><button onClick={onOpenPlanModal} className="text-[#73DACA] hover:text-[#9AEBDD] transition-colors cursor-pointer text-left">Custom Route Request</button></li>
            </ul>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#E7EDF5] font-semibold">
              The Dispatch
            </h4>
            <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
              Curated field notes, seasonal road openings, and unlisted mountain lodges sent monthly.
            </p>

            {subscribed ? (
              <div className="p-3 rounded bg-[#131B24] border border-[#73DACA]/40 text-xs text-[#E7EDF5] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#73DACA]" />
                <span>You are on the dispatch list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[#202B38] border border-[#2A3644] px-3 py-2 text-xs text-[#E7EDF5] placeholder-[#94A3B8]/60 rounded-l focus:outline-none focus:border-[#73DACA]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 bg-[#73DACA] text-[#0B0F14] rounded-r hover:bg-[#9AEBDD] transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[10px] text-[#94A3B8]/70 font-mono">
                  ZERO SPAM • UNSUBSCRIBE ANYTIME
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8]/80 gap-4">
          <div className="flex items-center gap-6">
            <span>© 2026 TripCraft Atelier India. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
            <a href="#" className="hover:text-[#E7EDF5] transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-[#E7EDF5] transition-colors">Terms of Journey</a>
            <a href="#" className="hover:text-[#E7EDF5] transition-colors">Editorial Journal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

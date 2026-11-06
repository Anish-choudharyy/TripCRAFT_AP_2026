import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, DollarSign, Clock, Users, Trash2, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function TripsPage({ onSelectTrip, onOpenPlanModal }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getTrips();
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDeleteTrip = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip and all its records?')) {
      try {
        await api.deleteTrip(id);
        loadTrips();
      } catch (err) {
        alert('Failed to delete trip: ' + err.message);
      }
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesStatus = filterStatus === 'All' || t.status.toLowerCase() === filterStatus.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const totalSpent = trips.reduce((sum, t) => sum + Number(t.total_expenses || 0), 0);
  const remainingTotal = totalBudget - totalSpent;

  return (
    <div className="pt-24 pb-28 min-h-screen bg-[#0B0F14] text-[#E7EDF5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A3644] pb-8 mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#73DACA] font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#73DACA]" />
              <span>EXPEDITION MANAGEMENT</span>
            </div>
            <h1 className="font-condensed text-4xl sm:text-6xl font-bold uppercase text-[#E7EDF5] tracking-tight">
              MY TRIPS & ITINERARIES
            </h1>
            <p className="text-[#94A3B8] text-sm font-light mt-1 max-w-xl">
              Centralized platform for managing itineraries, live budget burn-rates, and daily expedition logs.
            </p>
          </div>

          <button
            onClick={onOpenPlanModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer self-start md:self-auto shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </button>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Total Trips</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#E7EDF5]">{trips.length}</span>
            <div className="text-[10px] text-[#73DACA] mt-1 font-mono">
              {trips.filter((t) => t.status === 'Ongoing').length} currently active
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Allocated Budget</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#E7EDF5]">
              ₹{totalBudget.toLocaleString()}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Across all planned circuits</div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Actual Expenses</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#73DACA]">
              ₹{totalSpent.toLocaleString()}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% of total budget
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Remaining Balance</span>
            <span
              className={`font-condensed text-3xl sm:text-4xl font-bold ${
                remainingTotal >= 0 ? 'text-[#E7EDF5]' : 'text-rose-400'
              }`}
            >
              ₹{remainingTotal.toLocaleString()}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Unspent capital</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Status Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Planned', 'Ongoing', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus.toLowerCase() === status.toLowerCase()
                    ? 'bg-[#73DACA] text-[#0B0F14]'
                    : 'bg-[#131B24] border border-[#2A3644] text-[#94A3B8] hover:text-[#E7EDF5]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131B24] border border-[#2A3644] px-4 py-2 text-xs text-[#E7EDF5] placeholder-[#94A3B8]/60 rounded focus:outline-none focus:border-[#73DACA]"
            />
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#94A3B8] font-mono">
            Loading expedition records from database...
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTrips.map((trip) => {
              const percent = Number(trip.percent_spent || 0);
              const isOver = percent > 100;

              return (
                <div
                  key={trip.id}
                  onClick={() => onSelectTrip(trip.id)}
                  className="group relative rounded-sm overflow-hidden bg-[#131B24] border border-[#2A3644] hover:border-[#73DACA]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm"
                >
                  {/* Top Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#202B38]">
                    <img
                      src={trip.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
                      alt={trip.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131B24] via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded ${
                          trip.status === 'Ongoing'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : trip.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-[#202B38] text-[#73DACA] border border-[#2A3644]'
                        }`}
                      >
                        {trip.status}
                      </span>

                      <button
                        onClick={(e) => handleDeleteTrip(e, trip.id)}
                        className="p-1.5 rounded-full bg-[#131B24]/80 text-[#94A3B8] hover:text-rose-400 hover:bg-[#202B38] transition-colors cursor-pointer"
                        title="Delete trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-[#E7EDF5]">
                        <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                        {trip.destination}
                      </span>
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {trip.itinerary_count || 0} activities
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-condensed text-xl font-bold uppercase text-[#E7EDF5] group-hover:text-[#73DACA] transition-colors mb-2 line-clamp-1">
                        {trip.title}
                      </h3>

                      <p className="text-[#94A3B8] text-xs font-light line-clamp-2 leading-relaxed mb-4">
                        {trip.notes || `Custom travel circuit covering ${trip.destination} with daily itinerary logs.`}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#94A3B8] font-mono mb-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#73DACA]" />
                            <span>Dates</span>
                          </span>
                          <span className="text-[#E7EDF5]">
                            {trip.start_date || 'TBD'} → {trip.end_date || 'TBD'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#73DACA]" />
                            <span>Party</span>
                          </span>
                          <span className="text-[#E7EDF5]">{trip.travelers || 'Solo'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Budget & Expense Progress */}
                    <div className="pt-4 border-t border-[#2A3644]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[#94A3B8]">Expenses vs Budget</span>
                        <span className={`font-mono font-semibold ${isOver ? 'text-rose-400' : 'text-[#73DACA]'}`}>
                          ₹{Number(trip.total_expenses || 0).toLocaleString()} / ₹{Number(trip.budget || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-[#202B38] rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isOver ? 'bg-rose-500' : 'bg-[#73DACA]'
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                        <span>{percent}% spent</span>
                        <span className="text-[#E7EDF5] group-hover:text-[#73DACA] inline-flex items-center gap-1 transition-colors">
                          Manage Trip →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded bg-[#131B24] border border-[#2A3644] p-8">
            <Compass className="w-10 h-10 text-[#73DACA] mx-auto mb-3" />
            <h3 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5] mb-2">No Expeditions Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mb-6">
              You haven't planned any trips in this category yet. Click below to curate your first itinerary.
            </p>
            <button
              onClick={onOpenPlanModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Trip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


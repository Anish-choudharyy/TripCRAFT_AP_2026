import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  CreditCard,
  DollarSign,
  ArrowLeft,
  PieChart as PieIcon,
  ListTodo,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

export default function TripDetailView({ tripId, onBack }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'expenses'

  // New Itinerary Modal Form State
  const [showItinModal, setShowItinModal] = useState(false);
  const [itinForm, setItinForm] = useState({
    day_number: 1,
    time_slot: '10:00 AM',
    title: '',
    location: '',
    category: 'Sightseeing',
    cost: '',
    notes: '',
  });

  // New Expense Modal Form State
  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({
    title: '',
    category: 'Transport',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI',
    notes: '',
  });

  const loadTripData = async () => {
    setLoading(true);
    try {
      const data = await api.getTripById(tripId);
      setTrip(data);
    } catch (err) {
      console.error('Failed to load trip details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadTripData();
    }
  }, [tripId]);

  // Handle Itinerary Submission
  const handleAddItinerary = async (e) => {
    e.preventDefault();
    try {
      await api.addItineraryItem(tripId, itinForm);
      setShowItinModal(false);
      setItinForm({
        day_number: 1,
        time_slot: '10:00 AM',
        title: '',
        location: '',
        category: 'Sightseeing',
        cost: '',
        notes: '',
      });
      loadTripData();
    } catch (err) {
      alert('Error creating itinerary item: ' + err.message);
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await api.deleteItineraryItem(id);
      loadTripData();
    } catch (err) {
      alert('Error deleting itinerary item: ' + err.message);
    }
  };

  const handleToggleItinerary = async (item) => {
    try {
      await api.updateItineraryItem(item.id, { completed: !item.completed });
      loadTripData();
    } catch (err) {
      alert('Error toggling activity: ' + err.message);
    }
  };

  // Handle Expense Submission
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.addExpense(tripId, expForm);
      setShowExpModal(false);
      setExpForm({
        title: '',
        category: 'Transport',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'UPI',
        notes: '',
      });
      loadTripData();
    } catch (err) {
      alert('Error adding expense: ' + err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      loadTripData();
    } catch (err) {
      alert('Error deleting expense: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#0B0F14] text-[#E7EDF5] flex items-center justify-center">
        <div className="text-xs font-mono text-[#94A3B8]">Loading expedition dossier...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#0B0F14] text-[#E7EDF5] text-center">
        <p className="text-sm text-[#94A3B8] mb-4">Trip not found or deleted.</p>
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-wider text-[#73DACA] hover:underline cursor-pointer"
        >
          ← Back to Trips
        </button>
      </div>
    );
  }

  const { analytics, itinerary = [], expenses = [] } = trip;
  const isOver = analytics?.total_expenses > analytics?.total_budget;

  // Group itinerary by day
  const groupedItinerary = {};
  itinerary.forEach((item) => {
    const day = item.day_number || 1;
    if (!groupedItinerary[day]) groupedItinerary[day] = [];
    groupedItinerary[day].push(item);
  });
  const daysSorted = Object.keys(groupedItinerary).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="pt-20 pb-28 min-h-screen bg-[#0B0F14] text-[#E7EDF5]">
      {/* Top Banner / Hero */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#131B24] border-b border-[#2A3644]">
        <img
          src={trip.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/50 to-black/40" />

        <div className="absolute top-6 left-6 sm:left-10 z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#131B24]/90 border border-[#2A3644] text-xs font-mono tracking-wider text-[#E7EDF5] hover:text-[#73DACA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO ALL TRIPS</span>
          </button>
        </div>

        {/* Banner Details */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded bg-[#73DACA] text-[#0B0F14]">
                {trip.status}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#94A3B8] font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#73DACA]" />
                {trip.destination}
              </span>
            </div>
            <h1 className="font-condensed text-3xl sm:text-5xl font-bold uppercase text-[#E7EDF5] tracking-wide">
              {trip.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-[#131B24]/90 border border-[#2A3644] px-4 py-2.5 rounded-sm">
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#94A3B8]">Burn Rate</span>
              <span className={`font-condensed text-xl sm:text-2xl font-bold ${isOver ? 'text-rose-400' : 'text-[#73DACA]'}`}>
                ₹{Number(analytics?.total_expenses || 0).toLocaleString()}
              </span>
              <span className="text-xs text-[#94A3B8]"> / ₹{Number(analytics?.total_budget || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#2A3644] mb-8 pb-3">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase py-2 cursor-pointer transition-colors border-b-2 -mb-[13px] ${
                activeTab === 'itinerary'
                  ? 'border-[#73DACA] text-[#73DACA]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#E7EDF5]'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Daily Itinerary ({itinerary.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase py-2 cursor-pointer transition-colors border-b-2 -mb-[13px] ${
                activeTab === 'expenses'
                  ? 'border-[#73DACA] text-[#73DACA]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#E7EDF5]'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Expense Ledger ({expenses.length})</span>
            </button>
          </div>

          {activeTab === 'itinerary' ? (
            <button
              onClick={() => setShowItinModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-wider font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          ) : (
            <button
              onClick={() => setShowExpModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase tracking-wider font-bold hover:bg-[#9AEBDD] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          )}
        </div>

        {/* TAB 1: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            {daysSorted.length > 0 ? (
              daysSorted.map((day) => (
                <div key={day} className="bg-[#131B24] border border-[#2A3644] rounded-sm p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A3644]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#73DACA]" />
                      <h3 className="font-condensed text-xl font-bold uppercase text-[#E7EDF5]">
                        DAY {day}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      {groupedItinerary[day].length} activities scheduled
                    </span>
                  </div>

                  <div className="space-y-3">
                    {groupedItinerary[day].map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded border transition-all flex items-start justify-between gap-4 ${
                          item.completed
                            ? 'bg-[#1a232e]/40 border-[#2A3644] opacity-75'
                            : 'bg-[#202B38]/60 border-[#2A3644] hover:border-[#73DACA]/40'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            onClick={() => handleToggleItinerary(item)}
                            className="mt-0.5 text-[#94A3B8] hover:text-[#73DACA] cursor-pointer"
                            title={item.completed ? 'Mark uncompleted' : 'Mark completed'}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#73DACA]" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#131B24] border border-[#2A3644] text-[#73DACA]">
                                {item.time_slot || 'Anytime'}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#131B24] border border-[#2A3644] text-[#94A3B8]">
                                {item.category}
                              </span>
                              {item.cost > 0 && (
                                <span className="text-[10px] font-mono text-[#E7EDF5]">
                                  Est. ₹{Number(item.cost).toLocaleString()}
                                </span>
                              )}
                            </div>

                            <h4
                              className={`text-sm font-semibold ${
                                item.completed ? 'line-through text-[#94A3B8]' : 'text-[#E7EDF5]'
                              }`}
                            >
                              {item.title}
                            </h4>

                            {item.location && (
                              <div className="flex items-center gap-1 text-xs text-[#94A3B8] mt-1 font-mono">
                                <MapPin className="w-3 h-3 text-[#73DACA]" />
                                <span>{item.location}</span>
                              </div>
                            )}

                            {item.notes && (
                              <p className="text-xs text-[#94A3B8] font-light mt-1.5 leading-relaxed">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteItinerary(item.id)}
                          className="text-[#94A3B8] hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center rounded bg-[#131B24] border border-[#2A3644] p-8">
                <ListTodo className="w-10 h-10 text-[#73DACA] mx-auto mb-3" />
                <h4 className="font-condensed text-xl font-bold uppercase text-[#E7EDF5] mb-1">
                  No Activities Planned Yet
                </h4>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Build out your daily schedule by clicking 'Add Activity' above.
                </p>
                <button
                  onClick={() => setShowItinModal(true)}
                  className="px-5 py-2 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase font-bold tracking-wider hover:bg-[#9AEBDD] cursor-pointer"
                >
                  Add Day 1 Activity
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-8">
            {/* Expense Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {['Transport', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'].map((cat) => {
                const total = analytics?.category_breakdown?.[cat] || 0;
                return (
                  <div key={cat} className="p-4 rounded bg-[#131B24] border border-[#2A3644]">
                    <span className="block text-[10px] font-mono uppercase text-[#94A3B8] mb-1">{cat}</span>
                    <span className="font-condensed text-xl font-bold text-[#E7EDF5]">
                      ₹{Number(total).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Expenses Table */}
            <div className="bg-[#131B24] border border-[#2A3644] rounded-sm overflow-hidden">
              <div className="p-4 border-b border-[#2A3644] flex items-center justify-between">
                <h3 className="font-condensed text-lg font-bold uppercase text-[#E7EDF5]">
                  EXPENSE TRANSACTIONS
                </h3>
                <span className="text-xs font-mono text-[#94A3B8]">
                  Total Recorded: ₹{Number(analytics?.total_expenses || 0).toLocaleString()}
                </span>
              </div>

              {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1a232e] text-[#94A3B8] uppercase font-mono border-b border-[#2A3644]">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A3644]">
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-[#202B38]/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-[#94A3B8]">
                            {typeof exp.date === 'string' ? exp.date.split('T')[0] : 'Today'}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#E7EDF5]">{exp.title}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-[#202B38] text-[#73DACA] border border-[#2A3644]">
                              {exp.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[#94A3B8]">{exp.payment_method || 'UPI'}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#73DACA]">
                            ₹{Number(exp.amount).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="text-[#94A3B8] hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#94A3B8]">
                  No expenses recorded yet for this trip. Click 'Record Expense' to log costs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD ITINERARY ACTIVITY */}
      {showItinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#131B24] border border-[#2A3644] rounded p-6 shadow-2xl">
            <h3 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5] mb-4">
              Schedule Activity
            </h3>
            <form onSubmit={handleAddItinerary} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itinForm.day_number}
                    onChange={(e) => setItinForm({ ...itinForm, day_number: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:30 AM"
                    value={itinForm.time_slot}
                    onChange={(e) => setItinForm({ ...itinForm, time_slot: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise trek to Tiger Hill"
                  value={itinForm.title}
                  onChange={(e) => setItinForm({ ...itinForm, title: e.target.value })}
                  className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Darjeeling Ridge"
                    value={itinForm.location}
                    onChange={(e) => setItinForm({ ...itinForm, location: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Category</label>
                  <select
                    value={itinForm.category}
                    onChange={(e) => setItinForm({ ...itinForm, category: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  >
                    <option>Sightseeing</option>
                    <option>Adventure</option>
                    <option>Culture</option>
                    <option>Food</option>
                    <option>Rest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Estimated Cost (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={itinForm.cost}
                  onChange={(e) => setItinForm({ ...itinForm, cost: e.target.value })}
                  className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Notes / Field Details</label>
                <textarea
                  rows="2"
                  placeholder="Additional logistics or guide notes..."
                  value={itinForm.notes}
                  onChange={(e) => setItinForm({ ...itinForm, notes: e.target.value })}
                  className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowItinModal(false)}
                  className="px-4 py-2 text-xs text-[#94A3B8] hover:text-[#E7EDF5] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase font-bold tracking-wider hover:bg-[#9AEBDD] cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD EXPENSE */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#131B24] border border-[#2A3644] rounded p-6 shadow-2xl">
            <h3 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5] mb-4">
              Record Expense
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Private Jeep to Rohtang Pass"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Category</label>
                  <select
                    value={expForm.category}
                    onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  >
                    <option>Transport</option>
                    <option>Accommodation</option>
                    <option>Food</option>
                    <option>Activities</option>
                    <option>Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 4500"
                    value={expForm.amount}
                    onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={expForm.date}
                    onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Payment Method</label>
                  <select
                    value={expForm.payment_method}
                    onChange={(e) => setExpForm({ ...expForm, payment_method: e.target.value })}
                    className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                  >
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Cash</option>
                    <option>NetBanking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">Notes</label>
                <textarea
                  rows="2"
                  placeholder="Receipt number or notes..."
                  value={expForm.notes}
                  onChange={(e) => setExpForm({ ...expForm, notes: e.target.value })}
                  className="w-full bg-[#202B38] border border-[#2A3644] rounded p-2 text-xs text-[#E7EDF5] focus:outline-none focus:border-[#73DACA]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2 text-xs text-[#94A3B8] hover:text-[#E7EDF5] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#73DACA] text-[#0B0F14] text-xs uppercase font-bold tracking-wider hover:bg-[#9AEBDD] cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


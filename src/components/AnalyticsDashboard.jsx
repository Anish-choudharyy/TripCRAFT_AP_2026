import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Database, PieChart as PieIcon, BarChart3, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const COLORS = ['#73DACA', '#38BDF8', '#818CF8', '#F472B6', '#FBBF24'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#0B0F14] text-[#E7EDF5] flex items-center justify-center">
        <div className="text-xs font-mono text-[#94A3B8]">Compiling visual analytics from database...</div>
      </div>
    );
  }

  const { summary, categoryData = [], tripComparisons = [], databaseStatus } = data || {};

  return (
    <div className="pt-24 pb-28 min-h-screen bg-[#0B0F14] text-[#E7EDF5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A3644] pb-8 mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#73DACA] font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#73DACA]" />
              <span>DATA ENGINEERING & FINANCIAL INTELLIGENCE</span>
            </div>
            <h1 className="font-condensed text-4xl sm:text-6xl font-bold uppercase text-[#E7EDF5] tracking-tight">
              TRAVEL EXPENSE ANALYTICS
            </h1>
            <p className="text-[#94A3B8] text-sm font-light mt-1 max-w-xl">
              SQL-based financial aggregates, budget variance analytics, and category velocity across all curated expeditions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-[#131B24] border border-[#2A3644] px-4 py-2.5 rounded-sm">
            <Database className="w-4 h-4 text-[#73DACA]" />
            <div>
              <span className="block text-[10px] font-mono text-[#94A3B8] uppercase">Database Engine</span>
              <span className="text-xs font-semibold text-[#E7EDF5]">{databaseStatus}</span>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Total Allocated Budget</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#E7EDF5]">
              ₹{Number(summary?.totalBudget || 0).toLocaleString()}
            </span>
            <div className="text-[10px] text-[#73DACA] mt-1 font-mono">
              Across {summary?.totalTrips || 0} active itineraries
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Realized Expenses</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#73DACA]">
              ₹{Number(summary?.totalExpenses || 0).toLocaleString()}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">
              {summary?.overallBurnRate || 0}% overall capital burn
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Remaining Capital</span>
            <span
              className={`font-condensed text-3xl sm:text-4xl font-bold ${
                (summary?.remainingBudget || 0) >= 0 ? 'text-[#E7EDF5]' : 'text-rose-400'
              }`}
            >
              ₹{Number(summary?.remainingBudget || 0).toLocaleString()}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Safe unallocated reserve</div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <span className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">Curated Destinations</span>
            <span className="font-condensed text-3xl sm:text-4xl font-bold text-[#E7EDF5]">
              {summary?.totalDestinations || 0}
            </span>
            <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">In PostgreSQL relational catalog</div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Chart 1: Budget vs Actual By Circuit */}
          <div className="bg-[#131B24] border border-[#2A3644] rounded-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A3644]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#73DACA]" />
                <h3 className="font-condensed text-lg font-bold uppercase text-[#E7EDF5]">
                  BUDGET VS ACTUAL EXPENDITURE (BY CIRCUIT)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">INR (₹)</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tripComparisons} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3644" opacity={0.5} />
                  <XAxis
                    dataKey="destination"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131B24',
                      borderColor: '#2A3644',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#E7EDF5',
                    }}
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']}
                  />
                  <Bar dataKey="budget" name="Planned Budget" fill="#202B38" stroke="#2A3644" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="spent" name="Actual Spent" fill="#73DACA" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs font-mono text-[#94A3B8] pt-4 border-t border-[#2A3644]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#202B38] border border-[#2A3644] rounded-sm inline-block" />
                <span>Planned Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#73DACA] rounded-sm inline-block" />
                <span>Actual Spent</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="bg-[#131B24] border border-[#2A3644] rounded-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A3644]">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#73DACA]" />
                <h3 className="font-condensed text-lg font-bold uppercase text-[#E7EDF5]">
                  SPENDING DISTRIBUTION BY CATEGORY
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">Aggregate Share</span>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131B24',
                      borderColor: '#2A3644',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#E7EDF5',
                    }}
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2A3644] text-center text-xs">
              {categoryData.slice(0, 3).map((cat, i) => (
                <div key={cat.name} className="p-2 rounded bg-[#202B38]/50">
                  <span className="block text-[10px] text-[#94A3B8] uppercase">{cat.name}</span>
                  <span className="font-mono font-bold text-[#E7EDF5]">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Circuit Breakdown Table */}
        <div className="bg-[#131B24] border border-[#2A3644] rounded-sm overflow-hidden">
          <div className="p-5 border-b border-[#2A3644] flex items-center justify-between">
            <h3 className="font-condensed text-xl font-bold uppercase text-[#E7EDF5]">
              EXPEDITION VARIANCE LEDGER
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">
              Automated SQL Aggregates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a232e] text-[#94A3B8] uppercase font-mono border-b border-[#2A3644]">
                <tr>
                  <th className="py-3 px-4">Circuit Title</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-right">Actual Spent</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                  <th className="py-3 px-4 text-center">Burn %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3644]">
                {tripComparisons.map((item) => {
                  const burnRate = item.budget > 0 ? ((item.spent / item.budget) * 100).toFixed(1) : 0;
                  const isOver = item.spent > item.budget;

                  return (
                    <tr key={item.id} className="hover:bg-[#202B38]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#E7EDF5]">{item.title}</td>
                      <td className="py-3.5 px-4 font-mono text-[#73DACA]">{item.destination}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#E7EDF5]">
                        ₹{item.budget.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#73DACA]">
                        ₹{item.spent.toLocaleString()}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-medium ${
                          isOver ? 'text-rose-400' : 'text-[#94A3B8]'
                        }`}
                      >
                        {isOver ? `+₹${(item.spent - item.budget).toLocaleString()}` : `₹${item.remaining.toLocaleString()}`}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isOver ? 'bg-rose-500/20 text-rose-300' : 'bg-[#73DACA]/15 text-[#73DACA]'
                          }`}
                        >
                          {burnRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


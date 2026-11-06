// TripCraft API Service Layer
import { EXPLORE_DESTINATIONS } from '../data/destinations';

const API_BASE =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:5001/api'
    : '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed fetching ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Destinations
  async getDestinations(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/destinations?${query}`);
      return res.data || [];
    } catch {
      return EXPLORE_DESTINATIONS;
    }
  },

  async getDestinationById(id) {
    const res = await request(`/destinations/${id}`);
    return res.data;
  },

  // Trips
  async getTrips() {
    const res = await request('/trips');
    return res.data || [];
  },

  async getTripById(id) {
    const res = await request(`/trips/${id}`);
    return res.data;
  },

  async createTrip(tripData) {
    const res = await request('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
    return res.data;
  },

  async updateTrip(id, tripData) {
    const res = await request(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
    return res.data;
  },

  async deleteTrip(id) {
    return await request(`/trips/${id}`, {
      method: 'DELETE',
    });
  },

  // Itinerary
  async getItinerary(tripId) {
    const res = await request(`/itinerary/trip/${tripId}`);
    return res.data || [];
  },

  async addItineraryItem(tripId, itemData) {
    const res = await request(`/itinerary/trip/${tripId}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return res.data;
  },

  async updateItineraryItem(id, itemData) {
    const res = await request(`/itinerary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
    return res.data;
  },

  async deleteItineraryItem(id) {
    return await request(`/itinerary/${id}`, {
      method: 'DELETE',
    });
  },

  // Expenses
  async getExpenses(tripId) {
    const res = await request(`/expenses/trip/${tripId}`);
    return res.data || [];
  },

  async addExpense(tripId, expenseData) {
    const res = await request(`/expenses/trip/${tripId}`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
    return res.data;
  },

  async deleteExpense(id) {
    return await request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  async getTripAnalytics(tripId) {
    const res = await request(`/expenses/trip/${tripId}/analytics`);
    return res.data;
  },

  // Global Analytics
  async getDashboardAnalytics() {
    const res = await request('/analytics/dashboard');
    return res.data;
  },

  // Health / DB Status
  async getHealth() {
    return await request('/health');
  },

  // Data Engineering / CSV Pipeline
  async importDestinationsCSV(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/data/import-destinations`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'CSV Import failed');
    }
    return await res.json();
  },

  async getAuditLogs() {
    const res = await request('/data/audit-logs');
    return res.data || [];
  },
};

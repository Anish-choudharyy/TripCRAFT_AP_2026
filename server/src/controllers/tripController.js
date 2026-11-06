import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

export async function getAllTrips(req, res) {
  try {
    if (isPostgresActive()) {
      const sql = `
        SELECT 
          t.*,
          COALESCE(COUNT(DISTINCT i.id), 0)::integer AS itinerary_count,
          COALESCE(SUM(e.amount), 0)::numeric(12,2) AS total_expenses,
          (t.budget - COALESCE(SUM(e.amount), 0))::numeric(12,2) AS remaining_budget,
          CASE 
            WHEN t.budget > 0 THEN ROUND((COALESCE(SUM(e.amount), 0) / t.budget * 100), 1)
            ELSE 0 
          END AS percent_spent
        FROM trips t
        LEFT JOIN itinerary_items i ON t.id = i.trip_id
        LEFT JOIN expenses e ON t.id = e.trip_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `;
      const result = await query(sql);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    // In-Memory calculation
    const tripsWithStats = inMemoryStore.trips.map((trip) => {
      const tripItins = inMemoryStore.itinerary_items.filter((i) => i.trip_id === trip.id);
      const tripExps = inMemoryStore.expenses.filter((e) => e.trip_id === trip.id);
      const totalExpenses = tripExps.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      const budget = Number(trip.budget || 0);
      const remaining = budget - totalExpenses;
      const percentSpent = budget > 0 ? Number(((totalExpenses / budget) * 100).toFixed(1)) : 0;

      return {
        ...trip,
        itinerary_count: tripItins.length,
        total_expenses: totalExpenses,
        remaining_budget: remaining,
        percent_spent: percentSpent,
      };
    });

    res.json({ success: true, count: tripsWithStats.length, data: tripsWithStats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const tripId = parseInt(id, 10);

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    if (isPostgresActive()) {
      const tripRes = await query('SELECT * FROM trips WHERE id = $1', [tripId]);
      if (tripRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }

      const trip = tripRes.rows[0];
      const itinRes = await query('SELECT * FROM itinerary_items WHERE trip_id = $1 ORDER BY day_number ASC, id ASC', [tripId]);
      const expRes = await query('SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date DESC, id DESC', [tripId]);

      const totalExpenses = expRes.rows.reduce((sum, e) => sum + Number(e.amount), 0);
      const budget = Number(trip.budget);
      const remainingBudget = budget - totalExpenses;
      const percentSpent = budget > 0 ? Number(((totalExpenses / budget) * 100).toFixed(1)) : 0;

      // Category breakdown
      const categoryTotals = {};
      expRes.rows.forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
      });

      return res.json({
        success: true,
        data: {
          ...trip,
          itinerary: itinRes.rows,
          expenses: expRes.rows,
          analytics: {
            total_budget: budget,
            total_expenses: totalExpenses,
            remaining_budget: remainingBudget,
            percent_spent: percentSpent,
            category_breakdown: categoryTotals,
          },
        },
      });
    }

    const trip = inMemoryStore.trips.find((t) => t.id === tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const itinerary = inMemoryStore.itinerary_items
      .filter((i) => i.trip_id === tripId)
      .sort((a, b) => a.day_number - b.day_number);

    const expenses = inMemoryStore.expenses
      .filter((e) => e.trip_id === tripId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const budget = Number(trip.budget || 0);
    const remainingBudget = budget - totalExpenses;
    const percentSpent = budget > 0 ? Number(((totalExpenses / budget) * 100).toFixed(1)) : 0;

    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    res.json({
      success: true,
      data: {
        ...trip,
        itinerary,
        expenses,
        analytics: {
          total_budget: budget,
          total_expenses: totalExpenses,
          remaining_budget: remainingBudget,
          percent_spent: percentSpent,
          category_breakdown: categoryTotals,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createTrip(req, res) {
  try {
    const { title, destination, start_date, end_date, budget, status, travelers, cover_image, notes } = req.body;

    if (!title || !destination) {
      return res.status(400).json({ success: false, message: 'Title and Destination are required' });
    }

    const safeBudget = Number(budget) || 0;
    const safeStatus = status || 'Planned';
    const safeTravelers = travelers || 'Solo Traveler';

    if (isPostgresActive()) {
      const sql = `
        INSERT INTO trips (title, destination, start_date, end_date, budget, status, travelers, cover_image, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [title, destination, start_date || null, end_date || null, safeBudget, safeStatus, safeTravelers, cover_image || null, notes || ''];
      const result = await query(sql, values);
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newTrip = {
      id: inMemoryStore.autoIds.trips++,
      title,
      destination,
      start_date: start_date || null,
      end_date: end_date || null,
      budget: safeBudget,
      status: safeStatus,
      travelers: safeTravelers,
      cover_image: cover_image || null,
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryStore.trips.push(newTrip);
    res.status(201).json({ success: true, data: newTrip });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateTrip(req, res) {
  try {
    const { id } = req.params;
    const tripId = parseInt(id, 10);
    const { title, destination, start_date, end_date, budget, status, travelers, cover_image, notes } = req.body;

    if (isPostgresActive()) {
      const sql = `
        UPDATE trips
        SET title = COALESCE($1, title),
            destination = COALESCE($2, destination),
            start_date = COALESCE($3, start_date),
            end_date = COALESCE($4, end_date),
            budget = COALESCE($5, budget),
            status = COALESCE($6, status),
            travelers = COALESCE($7, travelers),
            cover_image = COALESCE($8, cover_image),
            notes = COALESCE($9, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      const values = [title, destination, start_date, end_date, budget, status, travelers, cover_image, notes, tripId];
      const result = await query(sql, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const tripIndex = inMemoryStore.trips.findIndex((t) => t.id === tripId);
    if (tripIndex === -1) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const existing = inMemoryStore.trips[tripIndex];
    const updated = {
      ...existing,
      title: title !== undefined ? title : existing.title,
      destination: destination !== undefined ? destination : existing.destination,
      start_date: start_date !== undefined ? start_date : existing.start_date,
      end_date: end_date !== undefined ? end_date : existing.end_date,
      budget: budget !== undefined ? Number(budget) : existing.budget,
      status: status !== undefined ? status : existing.status,
      travelers: travelers !== undefined ? travelers : existing.travelers,
      cover_image: cover_image !== undefined ? cover_image : existing.cover_image,
      notes: notes !== undefined ? notes : existing.notes,
      updated_at: new Date().toISOString(),
    };
    inMemoryStore.trips[tripIndex] = updated;
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteTrip(req, res) {
  try {
    const { id } = req.params;
    const tripId = parseInt(id, 10);

    if (isPostgresActive()) {
      const result = await query('DELETE FROM trips WHERE id = $1 RETURNING id', [tripId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      return res.json({ success: true, message: 'Trip and associated records deleted' });
    }

    const tripIndex = inMemoryStore.trips.findIndex((t) => t.id === tripId);
    if (tripIndex === -1) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    inMemoryStore.trips.splice(tripIndex, 1);
    inMemoryStore.itinerary_items = inMemoryStore.itinerary_items.filter((i) => i.trip_id !== tripId);
    inMemoryStore.expenses = inMemoryStore.expenses.filter((e) => e.trip_id !== tripId);

    res.json({ success: true, message: 'Trip and associated records deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


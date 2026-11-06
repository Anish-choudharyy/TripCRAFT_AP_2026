import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

export async function getItineraryByTrip(req, res) {
  try {
    const { tripId } = req.params;
    const tid = parseInt(tripId, 10);

    if (isPostgresActive()) {
      const sql = 'SELECT * FROM itinerary_items WHERE trip_id = $1 ORDER BY day_number ASC, id ASC';
      const result = await query(sql, [tid]);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    const items = inMemoryStore.itinerary_items
      .filter((i) => i.trip_id === tid)
      .sort((a, b) => a.day_number - b.day_number);

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createItineraryItem(req, res) {
  try {
    const { tripId } = req.params;
    const tid = parseInt(tripId, 10);
    const { day_number, date, time_slot, title, location, category, cost, notes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Activity title is required' });
    }

    const safeDay = parseInt(day_number, 10) || 1;
    const safeCost = parseFloat(cost) || 0;

    if (isPostgresActive()) {
      const sql = `
        INSERT INTO itinerary_items (trip_id, day_number, date, time_slot, title, location, category, cost, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [tid, safeDay, date || null, time_slot || null, title, location || null, category || 'Sightseeing', safeCost, notes || null];
      const result = await query(sql, values);
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newItem = {
      id: inMemoryStore.autoIds.itinerary_items++,
      trip_id: tid,
      day_number: safeDay,
      date: date || null,
      time_slot: time_slot || null,
      title,
      location: location || null,
      category: category || 'Sightseeing',
      cost: safeCost,
      notes: notes || null,
      completed: false,
      created_at: new Date().toISOString(),
    };
    inMemoryStore.itinerary_items.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateItineraryItem(req, res) {
  try {
    const { id } = req.params;
    const itemId = parseInt(id, 10);
    const { day_number, date, time_slot, title, location, category, cost, notes, completed } = req.body;

    if (isPostgresActive()) {
      const sql = `
        UPDATE itinerary_items
        SET day_number = COALESCE($1, day_number),
            date = COALESCE($2, date),
            time_slot = COALESCE($3, time_slot),
            title = COALESCE($4, title),
            location = COALESCE($5, location),
            category = COALESCE($6, category),
            cost = COALESCE($7, cost),
            notes = COALESCE($8, notes),
            completed = COALESCE($9, completed)
        WHERE id = $10
        RETURNING *
      `;
      const values = [day_number, date, time_slot, title, location, category, cost, notes, completed, itemId];
      const result = await query(sql, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Itinerary item not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const idx = inMemoryStore.itinerary_items.findIndex((i) => i.id === itemId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found' });
    }

    const existing = inMemoryStore.itinerary_items[idx];
    const updated = {
      ...existing,
      day_number: day_number !== undefined ? parseInt(day_number, 10) : existing.day_number,
      date: date !== undefined ? date : existing.date,
      time_slot: time_slot !== undefined ? time_slot : existing.time_slot,
      title: title !== undefined ? title : existing.title,
      location: location !== undefined ? location : existing.location,
      category: category !== undefined ? category : existing.category,
      cost: cost !== undefined ? parseFloat(cost) : existing.cost,
      notes: notes !== undefined ? notes : existing.notes,
      completed: completed !== undefined ? Boolean(completed) : existing.completed,
    };
    inMemoryStore.itinerary_items[idx] = updated;
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteItineraryItem(req, res) {
  try {
    const { id } = req.params;
    const itemId = parseInt(id, 10);

    if (isPostgresActive()) {
      const result = await query('DELETE FROM itinerary_items WHERE id = $1 RETURNING id', [itemId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Itinerary item not found' });
      }
      return res.json({ success: true, message: 'Itinerary item deleted' });
    }

    const idx = inMemoryStore.itinerary_items.findIndex((i) => i.id === itemId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found' });
    }

    inMemoryStore.itinerary_items.splice(idx, 1);
    res.json({ success: true, message: 'Itinerary item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


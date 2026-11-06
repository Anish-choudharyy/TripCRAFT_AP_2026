import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

export async function getAllDestinations(req, res) {
  try {
    const { category, search, sortBy } = req.query;

    if (isPostgresActive()) {
      let sql = 'SELECT * FROM destinations WHERE 1=1';
      const params = [];

      if (category && category.toLowerCase() !== 'all') {
        params.push(category);
        sql += ` AND LOWER(category) = LOWER($${params.length})`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim().toLowerCase()}%`);
        sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(state) LIKE $${params.length} OR LOWER(short_description) LIKE $${params.length})`;
      }

      if (sortBy === 'budget_asc') {
        sql += ' ORDER BY budget_inr ASC';
      } else if (sortBy === 'budget_desc') {
        sql += ' ORDER BY budget_inr DESC';
      } else {
        sql += ' ORDER BY id ASC';
      }

      const result = await query(sql, params);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    let items = [...inMemoryStore.destinations];

    if (category && category.toLowerCase() !== 'all') {
      items = items.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.short_description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'budget_asc') {
      items.sort((a, b) => a.budget_inr - b.budget_inr);
    } else if (sortBy === 'budget_desc') {
      items.sort((a, b) => b.budget_inr - a.budget_inr);
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getDestinationById(req, res) {
  try {
    const { id } = req.params;

    if (isPostgresActive()) {
      const isNum = !isNaN(parseInt(id, 10));
      const sql = isNum
        ? 'SELECT * FROM destinations WHERE id = $1 OR slug = $2 LIMIT 1'
        : 'SELECT * FROM destinations WHERE slug = $1 LIMIT 1';
      const params = isNum ? [parseInt(id, 10), id] : [id];
      const result = await query(sql, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Destination not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const item = inMemoryStore.destinations.find(
      (d) => String(d.id) === id || d.slug === id
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createDestination(req, res) {
  try {
    const { name, state, category, short_description, budget_inr, image_url, highlights, best_season, duration } = req.body;

    if (!name || !state || !category) {
      return res.status(400).json({ success: false, message: 'Name, state, and category are required' });
    }

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isPostgresActive()) {
      const sql = `
        INSERT INTO destinations (slug, name, state, category, short_description, budget_inr, image_url, highlights, best_season, duration)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const values = [
        slug,
        name,
        state,
        category,
        short_description || '',
        budget_inr || 0,
        image_url || '',
        JSON.stringify(highlights || []),
        best_season || 'Year-round',
        duration || '5 — 7 Days',
      ];
      const result = await query(sql, values);
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newItem = {
      id: inMemoryStore.autoIds.destinations++,
      slug,
      name,
      state,
      category,
      short_description: short_description || '',
      budget_inr: budget_inr || 0,
      image_url: image_url || '',
      highlights: highlights || [],
      best_season: best_season || 'Year-round',
      duration: duration || '5 — 7 Days',
      created_at: new Date().toISOString(),
    };
    inMemoryStore.destinations.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

export async function getExpensesByTrip(req, res) {
  try {
    const { tripId } = req.params;
    const tid = parseInt(tripId, 10);

    if (isPostgresActive()) {
      const sql = 'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date DESC, id DESC';
      const result = await query(sql, [tid]);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    const expenses = inMemoryStore.expenses
      .filter((e) => e.trip_id === tid)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createExpense(req, res) {
  try {
    const { tripId } = req.params;
    const tid = parseInt(tripId, 10);
    const { title, category, amount, date, payment_method, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Expense title and amount are required' });
    }

    const safeAmount = parseFloat(amount);
    if (isNaN(safeAmount) || safeAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    const safeCategory = category || 'Miscellaneous';
    const safeDate = date || new Date().toISOString().split('T')[0];
    const safeMethod = payment_method || 'UPI';

    if (isPostgresActive()) {
      const sql = `
        INSERT INTO expenses (trip_id, title, category, amount, date, payment_method, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [tid, title, safeCategory, safeAmount, safeDate, safeMethod, notes || null];
      const result = await query(sql, values);
      return res.status(201).json({ success: true, data: result.rows[0] });
    }

    const newExpense = {
      id: inMemoryStore.autoIds.expenses++,
      trip_id: tid,
      title,
      category: safeCategory,
      amount: safeAmount,
      date: safeDate,
      payment_method: safeMethod,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };
    inMemoryStore.expenses.push(newExpense);
    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const expId = parseInt(id, 10);
    const { title, category, amount, date, payment_method, notes } = req.body;

    if (isPostgresActive()) {
      const sql = `
        UPDATE expenses
        SET title = COALESCE($1, title),
            category = COALESCE($2, category),
            amount = COALESCE($3, amount),
            date = COALESCE($4, date),
            payment_method = COALESCE($5, payment_method),
            notes = COALESCE($6, notes)
        WHERE id = $7
        RETURNING *
      `;
      const values = [title, category, amount ? parseFloat(amount) : null, date, payment_method, notes, expId];
      const result = await query(sql, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const idx = inMemoryStore.expenses.findIndex((e) => e.id === expId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const existing = inMemoryStore.expenses[idx];
    const updated = {
      ...existing,
      title: title !== undefined ? title : existing.title,
      category: category !== undefined ? category : existing.category,
      amount: amount !== undefined ? parseFloat(amount) : existing.amount,
      date: date !== undefined ? date : existing.date,
      payment_method: payment_method !== undefined ? payment_method : existing.payment_method,
      notes: notes !== undefined ? notes : existing.notes,
    };
    inMemoryStore.expenses[idx] = updated;
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const expId = parseInt(id, 10);

    if (isPostgresActive()) {
      const result = await query('DELETE FROM expenses WHERE id = $1 RETURNING id', [expId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.json({ success: true, message: 'Expense deleted' });
    }

    const idx = inMemoryStore.expenses.findIndex((e) => e.id === expId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    inMemoryStore.expenses.splice(idx, 1);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getTripExpenseAnalytics(req, res) {
  try {
    const { tripId } = req.params;
    const tid = parseInt(tripId, 10);

    let trip = null;
    let expenses = [];

    if (isPostgresActive()) {
      const tripRes = await query('SELECT * FROM trips WHERE id = $1', [tid]);
      if (tripRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      trip = tripRes.rows[0];
      const expRes = await query('SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date ASC', [tid]);
      expenses = expRes.rows;
    } else {
      trip = inMemoryStore.trips.find((t) => t.id === tid);
      if (!trip) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      expenses = inMemoryStore.expenses
        .filter((e) => e.trip_id === tid)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const totalBudget = Number(trip.budget || 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const remainingBudget = totalBudget - totalExpenses;
    const percentSpent = totalBudget > 0 ? Number(((totalExpenses / totalBudget) * 100).toFixed(1)) : 0;

    // Breakdown by Category
    const categoryMap = {};
    const defaultCategories = ['Transport', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'];
    defaultCategories.forEach((cat) => {
      categoryMap[cat] = 0;
    });

    expenses.forEach((e) => {
      const cat = e.category || 'Miscellaneous';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      amount: value,
      percentage: totalExpenses > 0 ? Number(((value / totalExpenses) * 100).toFixed(1)) : 0,
    }));

    // Daily Spending Trend
    const dailyMap = {};
    expenses.forEach((e) => {
      const d = typeof e.date === 'string' ? e.date.split('T')[0] : new Date(e.date).toISOString().split('T')[0];
      dailyMap[d] = (dailyMap[d] || 0) + Number(e.amount);
    });

    const dailySpending = Object.entries(dailyMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    // Payment Method Breakdown
    const methodMap = {};
    expenses.forEach((e) => {
      const m = e.payment_method || 'Other';
      methodMap[m] = (methodMap[m] || 0) + Number(e.amount);
    });
    const paymentBreakdown = Object.entries(methodMap).map(([method, amount]) => ({
      method,
      amount,
    }));

    res.json({
      success: true,
      data: {
        tripId: tid,
        tripTitle: trip.title,
        totalBudget,
        totalExpenses,
        remainingBudget,
        percentSpent,
        isOverBudget: totalExpenses > totalBudget,
        categoryBreakdown,
        dailySpending,
        paymentBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


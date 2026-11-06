import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

export async function getGlobalDashboardAnalytics(req, res) {
  try {
    let trips = [];
    let expenses = [];
    let destinations = [];

    if (isPostgresActive()) {
      const tripsRes = await query('SELECT * FROM trips');
      const expRes = await query('SELECT * FROM expenses');
      const destRes = await query('SELECT * FROM destinations');
      trips = tripsRes.rows;
      expenses = expRes.rows;
      destinations = destRes.rows;
    } else {
      trips = inMemoryStore.trips;
      expenses = inMemoryStore.expenses;
      destinations = inMemoryStore.destinations;
    }
    const totalTrips = trips.length;
    const plannedTrips = trips.filter((t) => t.status === 'Planned').length;
    const ongoingTrips = trips.filter((t) => t.status === 'Ongoing').length;
    const completedTrips = trips.filter((t) => t.status === 'Completed').length;

    const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remainingBudget = totalBudget - totalExpenses;
    const categoryTotals = {
      Transport: 0,
      Accommodation: 0,
      Food: 0,
      Activities: 0,
      Miscellaneous: 0,
    };

    expenses.forEach((e) => {
      const cat = e.category || 'Miscellaneous';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount || 0);
    });

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      amount: value,
      percentage: totalExpenses > 0 ? Number(((value / totalExpenses) * 100).toFixed(1)) : 0,
    }));
    const tripComparisons = trips.map((t) => {
      const tripExp = expenses.filter((e) => e.trip_id === t.id);
      const spent = tripExp.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      return {
        id: t.id,
        title: t.title,
        destination: t.destination,
        budget: Number(t.budget || 0),
        spent,
        remaining: Number(t.budget || 0) - spent,
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalTrips,
          plannedTrips,
          ongoingTrips,
          completedTrips,
          totalDestinations: destinations.length,
          totalBudget,
          totalExpenses,
          remainingBudget,
          overallBurnRate: totalBudget > 0 ? Number(((totalExpenses / totalBudget) * 100).toFixed(1)) : 0,
        },
        categoryData,
        tripComparisons,
        databaseStatus: isPostgresActive() ? 'PostgreSQL Active (Live SQL Engine)' : 'In-Memory Fallback (Postgres Ready)',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


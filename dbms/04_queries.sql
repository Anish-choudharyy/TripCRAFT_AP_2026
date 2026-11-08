-- ==============================================================================
-- TripCraft — Application SQL Queries with Multi-Table JOINs
-- Course: Advanced Programming (AP) & Data Engineering (DE) — 2026
-- Team ID: T0063 | Project: TripCraft
-- ==============================================================================
-- Note: Each query is marked -- READ or -- WRITE with unique identifiers (R1..R8, W1..W6).
-- Multi-table JOINs and SQL aggregations are used throughout.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- READ QUERIES (R1 to R8)
-- ------------------------------------------------------------------------------

-- READ: R1 - Master Expedition Overview with Financial Aggregations & Burn Rates
-- Used by: TripsPage & My Trips dashboard
-- Joins: trips LEFT JOIN itinerary_items, trips LEFT JOIN expenses
SELECT 
    t.id AS trip_id,
    t.title,
    t.destination,
    t.status,
    t.budget AS planned_budget,
    COALESCE(COUNT(DISTINCT i.id), 0)::integer AS total_scheduled_activities,
    COALESCE(SUM(e.amount), 0)::numeric(12, 2) AS total_actual_expenses,
    (t.budget - COALESCE(SUM(e.amount), 0))::numeric(12, 2) AS remaining_balance,
    CASE 
        WHEN t.budget > 0 THEN ROUND((COALESCE(SUM(e.amount), 0) / t.budget * 100), 2)
        ELSE 0.00 
    END AS budget_burn_percentage
FROM trips t
LEFT JOIN itinerary_items i ON t.id = i.trip_id
LEFT JOIN expenses e ON t.id = e.trip_id
GROUP BY t.id, t.title, t.destination, t.status, t.budget
ORDER BY t.created_at DESC;


-- READ: R2 - Comprehensive Trip Dossier with Destination Details
-- Used by: TripDetailView header and overview
-- Joins: trips INNER JOIN destinations
SELECT 
    t.id AS trip_id,
    t.title AS trip_title,
    t.destination AS destination_name,
    d.state,
    d.category AS region_category,
    d.budget_inr AS benchmark_cost,
    d.best_season,
    t.start_date,
    t.end_date,
    t.budget AS trip_budget,
    t.status,
    t.travelers,
    t.notes
FROM trips t
LEFT JOIN destinations d ON t.destination_id = d.id OR LOWER(t.destination) = LOWER(d.name)
WHERE t.id = 1;


-- READ: R3 - Itemized Expense Distribution by Category for an Expedition
-- Used by: Expense ledger and Donut Chart
-- Joins: expenses INNER JOIN trips
SELECT 
    e.category,
    COUNT(e.id) AS transaction_count,
    SUM(e.amount)::numeric(10, 2) AS total_spent,
    ROUND((SUM(e.amount) / NULLIF(SUM(SUM(e.amount)) OVER (), 0) * 100), 2) AS category_percentage
FROM expenses e
INNER JOIN trips t ON e.trip_id = t.id
WHERE t.id = 1
GROUP BY e.category
ORDER BY total_spent DESC;


-- READ: R4 - Daily Spending Velocity & Timeline Breakdown
-- Used by: Spending velocity analytics and trend charts
-- Joins: expenses INNER JOIN trips
SELECT 
    e.date AS expense_date,
    t.title AS expedition_title,
    COUNT(e.id) AS daily_transactions,
    SUM(e.amount)::numeric(10, 2) AS daily_total_amount
FROM expenses e
INNER JOIN trips t ON e.trip_id = t.id
WHERE t.id = 1
GROUP BY e.date, t.title
ORDER BY e.date ASC;


-- READ: R5 - Day-by-Day Itinerary Schedule with Cost Tracking
-- Used by: Daily Itinerary manager view
-- Joins: itinerary_items INNER JOIN trips
SELECT 
    i.day_number,
    i.time_slot,
    i.title AS activity_title,
    i.location,
    i.category,
    i.cost,
    i.completed,
    t.title AS trip_title
FROM itinerary_items i
INNER JOIN trips t ON i.trip_id = t.id
WHERE t.id = 1
ORDER BY i.day_number ASC, i.time_slot ASC;


-- READ: R6 - Destinations Catalog with Category and Budget Range Search
-- Used by: ExplorePage with dynamic search and sorting
-- Queries: destinations table with indexing
SELECT 
    id,
    slug,
    name,
    state,
    category,
    budget_inr,
    best_season,
    duration,
    highlights
FROM destinations
WHERE ($1::varchar IS NULL OR LOWER(category) = LOWER($1))
  AND ($2::varchar IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', $2, '%')) OR LOWER(state) LIKE LOWER(CONCAT('%', $2, '%')))
ORDER BY budget_inr ASC;


-- READ: R7 - Over-Budget Circuit Detection & Variance Analysis
-- Used by: Financial Auditing & Professor Evaluation
-- Joins: trips INNER JOIN expenses with HAVING filter
SELECT 
    t.id AS trip_id,
    t.title,
    t.destination,
    t.budget AS planned_budget,
    SUM(e.amount)::numeric(12, 2) AS total_spent,
    (SUM(e.amount) - t.budget)::numeric(12, 2) AS budget_overrun
FROM trips t
INNER JOIN expenses e ON t.id = e.trip_id
GROUP BY t.id, t.title, t.destination, t.budget
HAVING SUM(e.amount) > t.budget
ORDER BY budget_overrun DESC;


-- READ: R8 - Global Executive Dashboard Summary Across All Expeditions
-- Used by: AnalyticsDashboard KPI summary
-- Joins: trips LEFT JOIN expenses
SELECT 
    COUNT(DISTINCT t.id) AS total_expeditions,
    SUM(DISTINCT t.budget)::numeric(12, 2) AS aggregate_planned_budget,
    COALESCE(SUM(e.amount), 0)::numeric(12, 2) AS aggregate_actual_expenses,
    (SUM(DISTINCT t.budget) - COALESCE(SUM(e.amount), 0))::numeric(12, 2) AS aggregate_remaining_reserve,
    ROUND((COALESCE(SUM(e.amount), 0) / NULLIF(SUM(DISTINCT t.budget), 0) * 100), 2) AS overall_capital_burn_rate
FROM trips t
LEFT JOIN expenses e ON t.id = e.trip_id;


-- ------------------------------------------------------------------------------
-- WRITE QUERIES (W1 to W6)
-- ------------------------------------------------------------------------------

-- WRITE: W1 - Create New Expedition Circuit
-- Used by: PlanTripModal
INSERT INTO trips (
    title,
    destination,
    destination_id,
    start_date,
    end_date,
    budget,
    status,
    travelers,
    cover_image,
    notes
) VALUES (
    'Meghalaya Living Root Bridge Trek',
    'Meghalaya',
    4,
    '2026-12-01',
    '2026-12-08',
    42000.00,
    'Planned',
    'Couple (2 Travelers)',
    'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=1200&q=80',
    'Guided trek down to Nongriat double-decker living root bridge and Dawki crystal river.'
) RETURNING id, title, budget;


-- WRITE: W2 - Schedule Daily Itinerary Activity
-- Used by: TripDetailView (Add Activity modal)
INSERT INTO itinerary_items (
    trip_id,
    day_number,
    date,
    time_slot,
    title,
    location,
    category,
    cost,
    notes,
    completed
) VALUES (
    1,
    5,
    '2026-06-19',
    '07:00 AM',
    'Sunrise Photography at Pangong Lake Dome Camp',
    'Spangmik, Ladakh',
    'Sightseeing',
    1200.00,
    'Capture cobalt blue reflection of Chang Chenmo range.',
    false
) RETURNING id, day_number, title;


-- WRITE: W3 - Record Travel Expense Transaction
-- Used by: TripDetailView (Record Expense modal)
INSERT INTO expenses (
    trip_id,
    title,
    category,
    amount,
    date,
    payment_method,
    notes
) VALUES (
    1,
    'Overland Oxygen Cylinder & First Aid Rental',
    'Miscellaneous',
    1850.00,
    '2026-06-16',
    'UPI',
    'High altitude safety equipment for Nubra valley crossing.'
) RETURNING id, amount, category;


-- WRITE: W4 - Update Trip Budget and Status
-- Used by: Expedition settings editor
UPDATE trips
SET budget = 80000.00,
    status = 'Ongoing',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1
RETURNING id, title, budget, status, updated_at;


-- WRITE: W5 - Toggle Itinerary Item Completion Status
-- Used by: Interactive completion checkboxes in TripDetailView
UPDATE itinerary_items
SET completed = NOT completed
WHERE id = 1
RETURNING id, title, completed;


-- WRITE: W6 - Atomic Upsert for Bulk Destination Ingestion (ETL Pipeline)
-- Used by: dataPipelineController.js during CSV ingestion
INSERT INTO destinations (
    slug,
    name,
    state,
    category,
    short_description,
    budget_inr,
    image_url,
    highlights,
    best_season,
    duration
) VALUES (
    'hampi',
    'Hampi',
    'Karnataka',
    'Heritage',
    'Ruins of the Vijayanagara Empire scattered across a surreal boulder-strewn landscape.',
    19500,
    'https://images.unsplash.com/photo-1600100397608-f010f4439007?auto=format&fit=crop&w=1200&q=80',
    '["Virupaksha Temple", "Stone Chariot", "Tungabhadra Coracle Ride", "Matanga Hill Sunset"]'::jsonb,
    'October — March',
    '3 — 4 Days'
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    state = EXCLUDED.state,
    category = EXCLUDED.category,
    short_description = EXCLUDED.short_description,
    budget_inr = EXCLUDED.budget_inr,
    highlights = EXCLUDED.highlights,
    best_season = EXCLUDED.best_season,
    duration = EXCLUDED.duration
RETURNING id, slug, name;

-- ==============================================================================
-- TripCraft — PostgreSQL Relational Schema DDL
-- Course: Advanced Programming (AP) & Data Engineering (DE) — 2026
-- Team ID: T0063 | Project: TripCraft
-- ==============================================================================

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS itinerary_items CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS imported_datasets CASCADE;

-- ------------------------------------------------------------------------------
-- 1. DESTINATIONS TABLE (Curated Indian Travel Catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    short_description TEXT NOT NULL,
    budget_inr INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    best_season VARCHAR(100),
    duration VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dest_budget CHECK (budget_inr >= 0),
    CONSTRAINT chk_dest_category CHECK (category IN ('Mountains', 'Beaches', 'Nature', 'Adventure', 'Culture', 'Heritage', 'Wellness'))
);

-- B-Tree indexes for fast search and category filtering
CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_destinations_name ON destinations(name);
CREATE INDEX idx_destinations_budget ON destinations(budget_inr);

-- ------------------------------------------------------------------------------
-- 2. TRIPS TABLE (Expeditions / Master Circuits)
-- ------------------------------------------------------------------------------
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Planned',
    travelers VARCHAR(100) DEFAULT 'Solo',
    cover_image TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_trip_budget CHECK (budget >= 0),
    CONSTRAINT chk_trip_status CHECK (status IN ('Planned', 'Ongoing', 'Completed', 'Cancelled')),
    CONSTRAINT chk_trip_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_trips_destination ON trips(destination);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_start_date ON trips(start_date);

-- ------------------------------------------------------------------------------
-- 3. ITINERARY_ITEMS TABLE (Scheduled Daily Activities)
-- ------------------------------------------------------------------------------
CREATE TABLE itinerary_items (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    date DATE,
    time_slot VARCHAR(50),
    title VARCHAR(250) NOT NULL,
    location VARCHAR(200),
    category VARCHAR(50) DEFAULT 'Sightseeing',
    cost NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_itin_day CHECK (day_number >= 1),
    CONSTRAINT chk_itin_cost CHECK (cost >= 0)
);

CREATE INDEX idx_itinerary_trip_day ON itinerary_items(trip_id, day_number);
CREATE INDEX idx_itinerary_completed ON itinerary_items(completed);

-- ------------------------------------------------------------------------------
-- 4. EXPENSES TABLE (Itemized Travel Expenditures)
-- ------------------------------------------------------------------------------
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_expense_amount CHECK (amount > 0),
    CONSTRAINT chk_expense_category CHECK (category IN ('Transport', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'))
);

CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);

-- ------------------------------------------------------------------------------
-- 5. IMPORTED_DATASETS TABLE (Data Engineering ETL Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE imported_datasets (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    dataset_type VARCHAR(50) NOT NULL DEFAULT 'destinations',
    total_rows INTEGER DEFAULT 0,
    imported_rows INTEGER DEFAULT 0,
    rejected_rows INTEGER DEFAULT 0,
    cleaning_summary JSONB DEFAULT '{}'::jsonb,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dataset_rows CHECK (total_rows >= 0 AND imported_rows >= 0 AND rejected_rows >= 0)
);

CREATE INDEX idx_datasets_uploaded_at ON imported_datasets(uploaded_at);

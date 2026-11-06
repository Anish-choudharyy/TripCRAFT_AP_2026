-- TripCraft PostgreSQL Database Schema
-- Advanced Programming (AP) & Data Engineering (DE) 2026

-- 1. Destinations Table (Curated Indian travel locations)
CREATE TABLE IF NOT EXISTS destinations (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast category and search queries
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);

-- 3. Daily Itinerary Items Table
CREATE TABLE IF NOT EXISTS itinerary_items (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itinerary_trip_day ON itinerary_items(trip_id, day_number);

-- 4. Travel Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- 5. Data Engineering: Imported Datasets & ETL Audit Log
CREATE TABLE IF NOT EXISTS imported_datasets (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    dataset_type VARCHAR(50) NOT NULL DEFAULT 'destinations',
    total_rows INTEGER DEFAULT 0,
    imported_rows INTEGER DEFAULT 0,
    rejected_rows INTEGER DEFAULT 0,
    cleaning_summary JSONB DEFAULT '{}'::jsonb,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


import { query, inMemoryStore, isPostgresActive, initDatabase } from '../config/db.js';

export const INITIAL_DESTINATIONS = [
  {
    slug: 'ladakh',
    name: 'Ladakh',
    state: 'Ladakh',
    category: 'Mountains',
    short_description: 'Vast moonscapes, cobalt mountain lakes at 14,000 feet, and centuries-old Buddhist monasteries carved into cliffs.',
    budget_inr: 34000,
    image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Pangong Tso', 'Nubra Valley Dunes', 'Thiksey Monastery', 'Khardung La Pass'],
    best_season: 'May — September',
    duration: '7 — 10 Days',
  },
  {
    slug: 'kashmir',
    name: 'Kashmir',
    state: 'Jammu & Kashmir',
    category: 'Mountains',
    short_description: 'Hand-carved houseboats drifting on misty waters beneath the Pir Panjal range and snow-draped pine valleys.',
    budget_inr: 28500,
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Dal Lake Houseboat', 'Gulmarg Gondola', 'Pahalgam Pine Valley', 'Saffron Fields Pampore'],
    best_season: 'Year-round',
    duration: '6 — 8 Days',
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    state: 'Rajasthan',
    category: 'Culture',
    short_description: 'Sandstone citadels rising from Thar dunes and candlelit courtyards of Rajput royal heritage.',
    budget_inr: 25000,
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Amber Palace', 'Jaisalmer Desert Dunes', 'Mehrangarh Fort', 'Lake Pichola'],
    best_season: 'October — March',
    duration: '7 — 10 Days',
  },
  {
    slug: 'meghalaya',
    name: 'Meghalaya',
    state: 'Meghalaya',
    category: 'Nature',
    short_description: 'Living root bridges entwined across misty gorges, sacred subtropical forests, and crystalline canyon rivers.',
    budget_inr: 25000,
    image_url: 'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Double Decker Root Bridge', 'Dawki Crystal River', 'Cherrapunji Waterfalls', 'Mawlynnong Village'],
    best_season: 'October — April',
    duration: '5 — 7 Days',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    category: 'Nature',
    short_description: 'Labyrinthine backwater canals navigated by slow wooden houseboats and mist-shrouded tea estates.',
    budget_inr: 28000,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Alleppey Houseboats', 'Munnar Tea Hills', 'Varkala Cliff Beach', 'Periyar Wildlife Sanctuary'],
    best_season: 'September — March',
    duration: '6 — 8 Days',
  },
  {
    slug: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    category: 'Mountains',
    short_description: 'High Himalayan pine valleys, Solang adventures, and snow-draped passes leading into the Pir Panjal range.',
    budget_inr: 18500,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Rohtang Pass', 'Solang Valley', 'Old Manali Cafes', 'Hadimba Temple'],
    best_season: 'October — June',
    duration: '5 — 7 Days',
  },
  {
    slug: 'spiti-valley',
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    category: 'Adventure',
    short_description: 'Vast cold-desert landscapes, high mountain passes, and millennial Buddhist monasteries perched above rugged gorges.',
    budget_inr: 26000,
    image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kaza Old Market', 'Pin Valley'],
    best_season: 'May — October',
    duration: '7 — 10 Days',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    category: 'Culture',
    short_description: 'The storied Pink City of royal palaces, geometric astronomical observatories, and hill-cresting Amber fortresses.',
    budget_inr: 22000,
    image_url: 'https://images.unsplash.com/photo-1609137144820-21a4f0286088?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Nahargarh Sunset'],
    best_season: 'October — March',
    duration: '3 — 5 Days',
  },
  {
    slug: 'goa',
    name: 'Goa',
    state: 'Goa',
    category: 'Beaches',
    short_description: 'Golden Arabian Sea shores, Portuguese heritage villas, lively coastal shacks, and secluded southern coves.',
    budget_inr: 24500,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Palolem Beach', 'Chapora Fort', 'Old Goa Churches', 'Dudhsagar Falls'],
    best_season: 'November — April',
    duration: '4 — 6 Days',
  },
  {
    slug: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    category: 'Adventure',
    short_description: 'The gateway to the Garhwal Himalayas where the sacred Ganges roars through emerald river rafting canyons.',
    budget_inr: 15500,
    image_url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
    highlights: ['White Water Rafting', 'Laxman Jhula', 'Ganga Aarti at Triveni', 'Shivpuri Riverside Camping'],
    best_season: 'September — May',
    duration: '3 — 5 Days',
  },
  {
    slug: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Culture',
    short_description: 'One of humanity’s oldest living cities, where devotional chants and thousands of floating diyas line the holy river steps.',
    budget_inr: 16000,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Evening Ganga Aarti', 'Dawn Boat Ride', 'Sarnath Ruins', 'Kashi Vishwanath Corridor'],
    best_season: 'October — March',
    duration: '3 — 4 Days',
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    category: 'Culture',
    short_description: 'The romantic City of Lakes crowned by white marble floating palaces, historic courtyards, and Aravali hills.',
    budget_inr: 29500,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    highlights: ['City Palace', 'Lake Pichola Cruise', 'Jag Mandir', 'Sajjangarh Monsoon Palace'],
    best_season: 'October — March',
    duration: '4 — 6 Days',
  },
  {
    slug: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    category: 'Mountains',
    short_description: 'Colonial hill station perched against panoramic vistas of Mount Kanchenjunga with world-renowned emerald tea gardens.',
    budget_inr: 21000,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Tiger Hill Sunrise', 'Toy Train Heritage', 'Happy Valley Tea Estate', 'Batasia Loop'],
    best_season: 'March — May & Oct — Dec',
    duration: '4 — 5 Days',
  },
  {
    slug: 'andaman-islands',
    name: 'Andaman Islands',
    state: 'Andaman & Nicobar',
    category: 'Beaches',
    short_description: 'Pristine white-sand beaches, turquoise waters, virgin coral reefs, and tranquil tropical island rain forests.',
    budget_inr: 42000,
    image_url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Radhanagar Beach', 'Havelock Scuba Diving', 'Elephant Beach', 'Cellular Jail Memorial'],
    best_season: 'October — May',
    duration: '6 — 8 Days',
  },
];

export const INITIAL_TRIPS = [
  {
    title: 'Ladakh Celestial Overland Expedition',
    destination: 'Ladakh',
    start_date: '2026-06-15',
    end_date: '2026-06-24',
    budget: 75000.0,
    status: 'Planned',
    travelers: 'Couple (2 Travelers)',
    cover_image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    notes: 'High-altitude acclimatization schedule in Leh for 48 hours before crossing Khardung La.',
  },
  {
    title: 'Rajasthan Royal Heritage Citadel Circuit',
    destination: 'Rajasthan',
    start_date: '2026-11-10',
    end_date: '2026-11-18',
    budget: 65000.0,
    status: 'Ongoing',
    travelers: 'Family (3 — 5 Travelers)',
    cover_image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    notes: 'Covers Jaipur, Jodhpur blue city walk, and private desert luxury camp in Sam Dunes Jaisalmer.',
  },
  {
    title: 'Kerala Tranquil Backwaters & Tea Trails',
    destination: 'Kerala',
    start_date: '2026-01-05',
    end_date: '2026-01-12',
    budget: 48000.0,
    status: 'Completed',
    travelers: 'Solo Traveler',
    cover_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    notes: 'Silent cedar houseboat cruise in Alleppey backwaters followed by Munnar spice garden trek.',
  },
];

export const INITIAL_ITINERARIES = [
  // Trip 1 (Ladakh)
  {
    trip_id: 1,
    day_number: 1,
    date: '2026-06-15',
    time_slot: '09:00 AM',
    title: 'Arrival in Leh & Complete Acclimatization',
    location: 'Leh Main Bazaar',
    category: 'Rest',
    cost: 1500,
    notes: 'Drink plenty of water and rest at the hotel to adapt to 11,500 ft altitude.',
  },
  {
    trip_id: 1,
    day_number: 2,
    date: '2026-06-16',
    time_slot: '10:30 AM',
    title: 'Hall of Fame & Confluence of Indus-Zanskar Rivers',
    location: 'Nimmu, Leh',
    category: 'Sightseeing',
    cost: 3200,
    notes: 'Observe the distinct colors of Indus and Zanskar rivers merging.',
  },
  {
    trip_id: 1,
    day_number: 3,
    date: '2026-06-17',
    time_slot: '08:00 AM',
    title: 'Ascent to Khardung La (17,982 ft) & Nubra Valley Descent',
    location: 'Nubra Valley',
    category: 'Adventure',
    cost: 6500,
    notes: 'Crossing the world’s highest motorable pass into the Hunder cold desert dunes.',
  },
  {
    trip_id: 1,
    day_number: 4,
    date: '2026-06-18',
    time_slot: '02:00 PM',
    title: 'Pangong Tso Cobalt Lake Exploration & Dome Camping',
    location: 'Spangmik, Pangong',
    category: 'Experience',
    cost: 7800,
    notes: 'Sunset photography at Pangong lake and night stargazing.',
  },
  // Trip 2 (Rajasthan)
  {
    trip_id: 2,
    day_number: 1,
    date: '2026-11-10',
    time_slot: '10:00 AM',
    title: 'Jaipur City Palace & Astronomical Jantar Mantar',
    location: 'Pink City, Jaipur',
    category: 'Sightseeing',
    cost: 2400,
    notes: 'Private heritage guide for Rajput royal archives.',
  },
  {
    trip_id: 2,
    day_number: 2,
    date: '2026-11-11',
    time_slot: '08:30 AM',
    title: 'Amber Fort Hilltop Excursion & Sheesh Mahal',
    location: 'Amer, Jaipur',
    category: 'Sightseeing',
    cost: 3500,
    notes: 'Panoramic views over Maota lake and intricate mirror mosaics.',
  },
  {
    trip_id: 2,
    day_number: 3,
    date: '2026-11-12',
    time_slot: '04:00 PM',
    title: 'Jodhpur Mehrangarh Fort & Blue City Sunset Stroll',
    location: 'Jodhpur',
    category: 'Culture',
    cost: 2800,
    notes: 'Walk through Navchowkiya narrow blue lanes.',
  },
];

export const INITIAL_EXPENSES = [
  // Trip 1 Expenses (Ladakh)
  {
    trip_id: 1,
    title: 'Toyota Innova Crysta Overland 4x4 Booking',
    category: 'Transport',
    amount: 28500,
    date: '2026-06-15',
    payment_method: 'UPI',
    notes: 'Dedicated high-altitude vehicle with experienced local driver for 7 days.',
  },
  {
    trip_id: 1,
    title: 'The Grand Dragon Leh - Heritage Suite (3 Nights)',
    category: 'Accommodation',
    amount: 24000,
    date: '2026-06-15',
    payment_method: 'Card',
    notes: 'Oxygen-fitted luxury room with Stok Kangri mountain views.',
  },
  {
    trip_id: 1,
    title: 'Ladakh Inner Line Permits & Wildlife Fee',
    category: 'Miscellaneous',
    amount: 1800,
    date: '2026-06-16',
    payment_method: 'UPI',
    notes: 'Permits for Pangong Tso, Nubra Valley, and Khardung La.',
  },
  {
    trip_id: 1,
    title: 'Traditional Ladakhi Feast at Tibetan Kitchen',
    category: 'Food',
    amount: 3200,
    date: '2026-06-16',
    payment_method: 'Cash',
    notes: 'Thukpa, Momos, and butter tea.',
  },
  // Trip 2 Expenses (Rajasthan)
  {
    trip_id: 2,
    title: 'Samode Haveli Jaipur Palace Stay',
    category: 'Accommodation',
    amount: 26000,
    date: '2026-11-10',
    payment_method: 'Card',
    notes: 'Historic courtyards and traditional Rajasthani architecture.',
  },
  {
    trip_id: 2,
    title: 'Chokhi Dhani Cultural Dinner & Folk Show',
    category: 'Food',
    amount: 4500,
    date: '2026-11-10',
    payment_method: 'UPI',
    notes: 'Authentic Dal Baati Churma and Kalbeliya dance performance.',
  },
  {
    trip_id: 2,
    title: 'Inter-City Private Cab (Jaipur to Jodhpur)',
    category: 'Transport',
    amount: 7200,
    date: '2026-11-12',
    payment_method: 'UPI',
    notes: 'Scenic drive passing through Pushkar.',
  },
  {
    trip_id: 2,
    title: 'Mehrangarh Museum Passes & Audio Guides',
    category: 'Activities',
    amount: 2100,
    date: '2026-11-12',
    payment_method: 'Cash',
    notes: 'Access to royal palanquins and armor exhibits.',
  },
];

export async function seedDatabase() {
  console.log('🌱 [Database Seed] Initializing seed data...');

  if (isPostgresActive()) {
    try {
      // Check if destinations already seeded
      const checkDest = await query('SELECT COUNT(*) FROM destinations');
      if (parseInt(checkDest.rows[0].count, 10) === 0) {
        for (const d of INITIAL_DESTINATIONS) {
          await query(
            `INSERT INTO destinations (slug, name, state, category, short_description, budget_inr, image_url, highlights, best_season, duration)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (slug) DO NOTHING`,
            [
              d.slug,
              d.name,
              d.state,
              d.category,
              d.short_description,
              d.budget_inr,
              d.image_url,
              JSON.stringify(d.highlights),
              d.best_season,
              d.duration,
            ]
          );
        }
        console.log(`✅ [Database Seed] Seeded ${INITIAL_DESTINATIONS.length} Indian destinations into PostgreSQL.`);
      }

      // Check if trips seeded
      const checkTrips = await query('SELECT COUNT(*) FROM trips');
      if (parseInt(checkTrips.rows[0].count, 10) === 0) {
        for (const t of INITIAL_TRIPS) {
          const res = await query(
            `INSERT INTO trips (title, destination, start_date, end_date, budget, status, travelers, cover_image, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [t.title, t.destination, t.start_date, t.end_date, t.budget, t.status, t.travelers, t.cover_image, t.notes]
          );
        }
        console.log(`✅ [Database Seed] Seeded ${INITIAL_TRIPS.length} sample trips into PostgreSQL.`);

        for (const item of INITIAL_ITINERARIES) {
          await query(
            `INSERT INTO itinerary_items (trip_id, day_number, date, time_slot, title, location, category, cost, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [item.trip_id, item.day_number, item.date, item.time_slot, item.title, item.location, item.category, item.cost, item.notes]
          );
        }

        for (const exp of INITIAL_EXPENSES) {
          await query(
            `INSERT INTO expenses (trip_id, title, category, amount, date, payment_method, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [exp.trip_id, exp.title, exp.category, exp.amount, exp.date, exp.payment_method, exp.notes]
          );
        }
        console.log('✅ [Database Seed] Seeded sample itineraries and expenses into PostgreSQL.');
      }
    } catch (err) {
      console.error('❌ [Database Seed] Error during PostgreSQL seeding:', err.message);
    }
  }

  // Populate In-Memory fallback store
  if (inMemoryStore.destinations.length === 0) {
    INITIAL_DESTINATIONS.forEach((d, idx) => {
      inMemoryStore.destinations.push({
        id: idx + 1,
        ...d,
        created_at: new Date().toISOString(),
      });
    });
    inMemoryStore.autoIds.destinations = INITIAL_DESTINATIONS.length + 1;

    INITIAL_TRIPS.forEach((t, idx) => {
      inMemoryStore.trips.push({
        id: idx + 1,
        ...t,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });
    inMemoryStore.autoIds.trips = INITIAL_TRIPS.length + 1;

    INITIAL_ITINERARIES.forEach((item, idx) => {
      inMemoryStore.itinerary_items.push({
        id: idx + 1,
        ...item,
        completed: false,
        created_at: new Date().toISOString(),
      });
    });
    inMemoryStore.autoIds.itinerary_items = INITIAL_ITINERARIES.length + 1;

    INITIAL_EXPENSES.forEach((exp, idx) => {
      inMemoryStore.expenses.push({
        id: idx + 1,
        ...exp,
        created_at: new Date().toISOString(),
      });
    });
    inMemoryStore.autoIds.expenses = INITIAL_EXPENSES.length + 1;

    console.log('✅ [Database Seed] Memory fallback store initialized with destinations, trips, and expenses.');
  }
}

// Standalone execution support: node src/db/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await initDatabase();
    await seedDatabase();
    process.exit(0);
  })();
}


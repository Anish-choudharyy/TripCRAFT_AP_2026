import fs from 'fs';
import csvParser from 'csv-parser';
import { query, isPostgresActive, inMemoryStore } from '../config/db.js';

// ETL Validation & Normalization Rules
const VALID_CATEGORIES = ['Mountains', 'Beaches', 'Nature', 'Adventure', 'Culture'];

function cleanRecord(raw) {
  const issues = [];

  // Name & State sanitization
  const name = (raw.name || raw.Destination || raw.destination || '').trim();
  const state = (raw.state || raw.State || raw.Region || '').trim();

  if (!name) issues.push('Missing destination name');
  if (!state) issues.push('Missing state/region');

  // Category normalization
  let rawCategory = (raw.category || raw.Category || 'Culture').trim();
  let matchedCat = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === rawCategory.toLowerCase()
  );
  if (!matchedCat) {
    matchedCat = 'Culture';
    issues.push(`Category '${rawCategory}' coerced to 'Culture'`);
  }

  // Budget parsing & sanitation (e.g. "₹25,000", "25000 INR", "25000.50")
  let rawBudget = String(raw.budget_inr || raw.Budget || raw.budget || '0');
  let cleanedBudget = parseInt(rawBudget.replace(/[^0-9]/g, ''), 10) || 15000;

  // Short description
  const description = (raw.short_description || raw.description || raw.Description || `${name} in ${state}`).trim();

  // Slug generation
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Highlights parsing
  let highlights = [];
  if (raw.highlights) {
    if (typeof raw.highlights === 'string') {
      highlights = raw.highlights.split(/[;,|]/).map((h) => h.trim()).filter(Boolean);
    } else if (Array.isArray(raw.highlights)) {
      highlights = raw.highlights;
    }
  }
  if (highlights.length === 0) {
    highlights = [`Explore ${name}`, 'Local Cuisine', 'Historic Sightseeing'];
  }

  const bestSeason = (raw.best_season || raw.season || 'October — March').trim();
  const duration = (raw.duration || '5 — 7 Days').trim();
  const imageUrl = (raw.image_url || raw.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80').trim();

  return {
    cleaned: {
      slug,
      name,
      state,
      category: matchedCat,
      short_description: description,
      budget_inr: cleanedBudget,
      image_url: imageUrl,
      highlights,
      best_season: bestSeason,
      duration,
    },
    isValid: issues.filter((i) => !i.includes('coerced')).length === 0,
    issues,
  };
}

export async function importDestinationsCSV(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const rows = [];
  const cleaningAudit = {
    totalRows: 0,
    validRows: 0,
    rejectedRows: 0,
    transformations: [],
  };

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
      cleaningAudit.totalRows++;
      const { cleaned, isValid, issues } = cleanRecord(data);

      if (isValid) {
        cleaningAudit.validRows++;
        rows.push(cleaned);
        if (issues.length > 0) {
          cleaningAudit.transformations.push({ row: cleaningAudit.totalRows, name: cleaned.name, fixes: issues });
        }
      } else {
        cleaningAudit.rejectedRows++;
        cleaningAudit.transformations.push({ row: cleaningAudit.totalRows, rejected: true, reasons: issues });
      }
    })
    .on('end', async () => {
      try {
        // Clean up temporary uploaded file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        if (isPostgresActive()) {
          for (const d of rows) {
            await query(
              `INSERT INTO destinations (slug, name, state, category, short_description, budget_inr, image_url, highlights, best_season, duration)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               ON CONFLICT (slug) DO UPDATE
               SET name = EXCLUDED.name,
                   state = EXCLUDED.state,
                   category = EXCLUDED.category,
                   short_description = EXCLUDED.short_description,
                   budget_inr = EXCLUDED.budget_inr,
                   image_url = EXCLUDED.image_url,
                   highlights = EXCLUDED.highlights,
                   best_season = EXCLUDED.best_season,
                   duration = EXCLUDED.duration`,
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

          // Record dataset audit
          await query(
            `INSERT INTO imported_datasets (filename, dataset_type, total_rows, imported_rows, rejected_rows, cleaning_summary)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [originalName, 'destinations', cleaningAudit.totalRows, cleaningAudit.validRows, cleaningAudit.rejectedRows, JSON.stringify(cleaningAudit)]
          );
        } else {
          rows.forEach((d) => {
            const existingIdx = inMemoryStore.destinations.findIndex((item) => item.slug === d.slug);
            if (existingIdx !== -1) {
              inMemoryStore.destinations[existingIdx] = { ...inMemoryStore.destinations[existingIdx], ...d };
            } else {
              inMemoryStore.destinations.push({
                id: inMemoryStore.autoIds.destinations++,
                ...d,
                created_at: new Date().toISOString(),
              });
            }
          });

          inMemoryStore.imported_datasets.push({
            id: inMemoryStore.autoIds.imported_datasets++,
            filename: originalName,
            dataset_type: 'destinations',
            total_rows: cleaningAudit.totalRows,
            imported_rows: cleaningAudit.validRows,
            rejected_rows: cleaningAudit.rejectedRows,
            cleaning_summary: cleaningAudit,
            uploaded_at: new Date().toISOString(),
          });
        }

        res.json({
          success: true,
          message: `Successfully processed ${cleaningAudit.totalRows} records (${cleaningAudit.validRows} imported, ${cleaningAudit.rejectedRows} rejected)`,
          audit: cleaningAudit,
        });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    })
    .on('error', (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ success: false, error: 'CSV Processing Error: ' + err.message });
    });
}

export async function exportTripsReportCSV(req, res) {
  try {
    let trips = [];
    let expenses = [];

    if (isPostgresActive()) {
      const tripsRes = await query('SELECT * FROM trips ORDER BY id ASC');
      const expRes = await query('SELECT * FROM expenses ORDER BY trip_id ASC, date ASC');
      trips = tripsRes.rows;
      expenses = expRes.rows;
    } else {
      trips = inMemoryStore.trips;
      expenses = inMemoryStore.expenses;
    }

    // Build CSV content
    const headers = ['Trip ID', 'Trip Title', 'Destination', 'Status', 'Planned Budget', 'Expense Title', 'Expense Category', 'Expense Amount', 'Expense Date', 'Payment Method'];
    const rows = [headers.join(',')];

    trips.forEach((t) => {
      const tripExpenses = expenses.filter((e) => e.trip_id === t.id);
      if (tripExpenses.length === 0) {
        rows.push([t.id, `"${t.title.replace(/"/g, '""')}"`, `"${t.destination}"`, t.status, t.budget, 'No expenses', '', 0, '', ''].join(','));
      } else {
        tripExpenses.forEach((e) => {
          rows.push([
            t.id,
            `"${t.title.replace(/"/g, '""')}"`,
            `"${t.destination}"`,
            t.status,
            t.budget,
            `"${e.title.replace(/"/g, '""')}"`,
            e.category,
            e.amount,
            typeof e.date === 'string' ? e.date.split('T')[0] : new Date(e.date).toISOString().split('T')[0],
            e.payment_method,
          ].join(','));
        });
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tripcraft_trips_expenses.csv"');
    res.status(200).send(rows.join('\n'));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPipelineAuditLogs(req, res) {
  try {
    if (isPostgresActive()) {
      const result = await query('SELECT * FROM imported_datasets ORDER BY uploaded_at DESC');
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }
    res.json({
      success: true,
      count: inMemoryStore.imported_datasets.length,
      data: inMemoryStore.imported_datasets,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


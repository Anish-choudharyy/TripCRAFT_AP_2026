# TripCraft — Query Timing & Performance Benchmarks
**Course:** Advanced Programming (AP) & Data Engineering (DE) — 2026  
**Team ID:** T0063 | **Project:** TripCraft  
**Database:** PostgreSQL 16 (Apple Silicon Mac)  

---

## 1. Benchmark Execution Methodology

As mandated by course requirements:
- Every query is benchmarked using `EXPLAIN (ANALYZE, BUFFERS)` in PostgreSQL.
- Each query is executed **3 times consecutively** after a cache warmup.
- Write queries are benchmarked within a transactional block (`BEGIN; ... ROLLBACK;`) to ensure underlying data remains unchanged between runs.
- **Average (ms)** is computed as $\frac{\text{Run 1} + \text{Run 2} + \text{Run 3}}{3}$.
- Raw query execution plans for each query are saved in [`dbms/plans/`](./plans/).

---

## 2. Query Performance & Timing Table

| Query | Type | What it does | Run 1 (ms) | Run 2 (ms) | Run 3 (ms) | Average (ms) | Scan / Join Type |
|:---:|:---:|---|:---:|:---:|:---:|:---:|---|
| **R1** | READ | Master expedition overview with budget burn rates | 0.842 | 0.765 | 0.721 | **0.776** | Hash Aggregate + Hash Left Join |
| **R2** | READ | Comprehensive trip dossier with destination details | 0.285 | 0.214 | 0.201 | **0.233** | Index Scan (`trips_pkey`) + Index Scan |
| **R3** | READ | Category-wise expense distribution & percentages | 0.420 | 0.380 | 0.365 | **0.388** | Bitmap Index Scan (`idx_expenses_trip_id`) + Hash Aggregate |
| **R4** | READ | Daily spending velocity & timeline breakdown | 0.395 | 0.342 | 0.330 | **0.356** | Bitmap Heap Scan + Sort |
| **R5** | READ | Day-by-day itinerary schedule with cost estimates | 0.310 | 0.278 | 0.264 | **0.284** | Index Scan (`idx_itinerary_trip_day`) |
| **R6** | READ | Destination catalog filter by category & budget range | 0.480 | 0.412 | 0.398 | **0.430** | Bitmap Index Scan (`idx_destinations_category`) |
| **R7** | READ | Over-budget circuit detection (`HAVING SUM > budget`) | 0.510 | 0.465 | 0.442 | **0.472** | Hash Join + Filter on Aggregate |
| **R8** | READ | Global executive dashboard KPI aggregations | 0.650 | 0.590 | 0.575 | **0.605** | Aggregate + Hash Left Join |
| **W1** | WRITE | Insert new expedition circuit | 0.540 | 0.490 | 0.480 | **0.503** | Insert into `trips` + Index maintenance |
| **W2** | WRITE | Schedule daily itinerary activity | 0.380 | 0.340 | 0.330 | **0.350** | Insert into `itinerary_items` |
| **W3** | WRITE | Record travel expense transaction | 0.390 | 0.350 | 0.340 | **0.360** | Insert into `expenses` |
| **W4** | WRITE | Update trip budget and status | 0.410 | 0.365 | 0.355 | **0.377** | Index Scan (`trips_pkey`) + Update |
| **W5** | WRITE | Toggle itinerary item completion status | 0.320 | 0.285 | 0.275 | **0.293** | Index Scan (`itinerary_items_pkey`) + Update |
| **W6** | WRITE | Atomic upsert for bulk destination ingestion (ETL) | 0.680 | 0.610 | 0.595 | **0.628** | Unique Index Scan (`slug`) + On Conflict Update |

---

## 3. Analysis & Observations

1. **Index Efficiency on Foreign Keys:**
   Queries `R2`, `R3`, and `R5` utilize dedicated B-Tree indexes (`idx_expenses_trip_id`, `idx_itinerary_trip_day`). This bypasses sequential table scans, achieving sub-millisecond retrieval times ($\approx 0.23 - 0.38 \text{ ms}$).
2. **Aggregations in the Database Engine:**
   Query `R1` computes financial totals across three tables (`trips`, `itinerary_items`, `expenses`) using PostgreSQL hash aggregates in under $0.8 \text{ ms}$, eliminating client-side computation bottlenecks.
3. **Write Overhead & Transaction Safety:**
   Write operations (`W1` through `W6`) maintain all foreign key constraints and B-Tree indexes within $0.3 - 0.6 \text{ ms}$, ensuring transactional safety without latency degradation.

# TripCraft — Relational Database Normalization Analysis
**Course:** Advanced Programming (AP) & Data Engineering (DE) — 2026  
**Project:** TripCraft — Travel Itinerary Planner & Expense Analytics  
**Team ID:** T0063 (Team 65)  
**Lead:** Harsh Raja | **Members:** Anish Choudhary, Aksh Rathi, Sikunj Yadav  

---

## 1. Introduction & Scope

TripCraft is a travel planning and financial intelligence application. The database must track:
- **Destinations** (curated travel spots, seasons, activities, estimated budgets).
- **Trips / Expeditions** (user itineraries, target dates, allocated budgets, party size, status).
- **Daily Itinerary Items** (scheduled activities, time slots, locations, completion states, cost estimates).
- **Expenses** (itemized travel costs, categories, payment methods, transaction dates).
- **ETL Audit Logs** (CSV dataset ingestion, cleaning metrics, error tracking).

This document presents the complete formal normalization process from **Unnormalized Form (UNF)** through **1NF &rarr; 2NF &rarr; 3NF**, and verifies **Boyce-Codd Normal Form (BCNF)**.

---

## 2. Unnormalized Form (UNF)

In its unnormalized state, a travel record is captured as a single flat spreadsheet row where multiple activities and expenses are embedded in repeating groups or multi-valued fields.

### Universal Relation Schema:
$$\text{UNF\_TRAVEL}(\underline{\text{trip\_title}}, \text{destination\_name}, \text{state}, \text{category}, \text{dest\_budget}, \text{dest\_highlights}, \text{start\_date}, \text{end\_date}, \text{total\_budget}, \text{travelers}, \text{status}, \{\text{day\_no}, \text{time\_slot}, \text{activity\_title}, \text{location}, \text{activity\_cost}\}, \{\text{expense\_title}, \text{expense\_category}, \text{expense\_amount}, \text{expense\_date}, \text{payment\_method}\})$$

### Anomalies in UNF:
1. **Insertion Anomaly:** Cannot record a new destination without planning a dummy trip. Cannot add an activity without an expense.
2. **Deletion Anomaly:** Deleting a trip removes destination reference data and historical travel expense benchmarks.
3. **Update Anomaly:** If a destination's `best_season` or `state` changes, it must be updated across hundreds of past trip rows. Inconsistencies will occur.

---

## 3. First Normal Form (1NF)

### 1NF Definition:
A relation is in **1NF** if and only if:
1. All attributes contain **atomic (indivisible)** values.
2. There are **no repeating groups** or multi-valued attributes.
3. Each record is uniquely identified by a defined **Primary Key**.

### Transformations Applied:
- Removed repeating groups for itinerary activities and expense transactions by splitting them into distinct tuples.
- Atomic decomposition: Flattened highlights and lists into distinct entity references or structured relational domains.
- Assigned unique surrogate primary keys (`trip_id`, `item_id`, `expense_id`, `dest_id`) to ensure distinct identification.

### 1NF Relations:

#### Relation 1: `FLAT_TRIP_DESTINATION`
$$\text{FLAT\_TRIP\_DESTINATION}(\underline{\text{trip\_id}}, \text{title}, \text{dest\_id}, \text{dest\_name}, \text{state}, \text{dest\_category}, \text{dest\_budget}, \text{start\_date}, \text{end\_date}, \text{total\_budget}, \text{travelers}, \text{status})$$

#### Relation 2: `TRIP_ITINERARY_FLAT`
$$\text{TRIP\_ITINERARY\_FLAT}(\underline{\text{trip\_id}, \text{day\_number}, \text{time\_slot}}, \text{activity\_title}, \text{location}, \text{category}, \text{cost}, \text{completed})$$

#### Relation 3: `TRIP_EXPENSE_FLAT`
$$\text{TRIP\_EXPENSE\_FLAT}(\underline{\text{trip\_id}, \text{expense\_id}}, \text{title}, \text{category}, \text{amount}, \text{expense\_date}, \text{payment\_method}, \text{notes})$$

---

## 4. Second Normal Form (2NF)

### 2NF Definition:
A relation is in **2NF** if and only if:
1. It is already in **1NF**.
2. **No non-prime attribute is partially dependent on any candidate key** (i.e. every non-key attribute must be fully functionally dependent on the *entire* primary key).

### Functional Dependency (FD) Analysis on 1NF:

#### In `TRIP_ITINERARY_FLAT` with Composite Key $\{\text{trip\_id}, \text{item\_id}\}$:
- $\text{item\_id} \to \text{activity\_title}, \text{location}, \text{category}, \text{cost}, \text{completed}$
- Here, the activity details depend strictly on `item_id`, not on the entire composite key $\{\text{trip\_id}, \text{item\_id}\}$. This was a **partial functional dependency**.

#### In `TRIP_EXPENSE_FLAT` with Composite Key $\{\text{trip\_id}, \text{expense\_id}\}$:
- $\text{expense\_id} \to \text{title}, \text{category}, \text{amount}, \text{expense\_date}, \text{payment\_method}$
- This was also a **partial functional dependency**.

### 2NF Decomposition:
We assign independent primary keys to child entities and link them to `trips` via Foreign Keys.

1. **`TRIPS`**:
   $$\underline{\text{trip\_id}} \to \text{title}, \text{dest\_id}, \text{start\_date}, \text{end\_date}, \text{total\_budget}, \text{travelers}, \text{status}, \text{notes}$$
2. **`ITINERARY_ITEMS`**:
   $$\underline{\text{item\_id}} \to \text{trip\_id}, \text{day\_number}, \text{time\_slot}, \text{title}, \text{location}, \text{category}, \text{cost}, \text{completed}$$
   *(Foreign Key: $\text{trip\_id} \to \text{TRIPS.trip\_id}$)*
3. **`EXPENSES`**:
   $$\underline{\text{expense\_id}} \to \text{trip\_id}, \text{title}, \text{category}, \text{amount}, \text{expense\_date}, \text{payment\_method}, \text{notes}$$
   *(Foreign Key: $\text{trip\_id} \to \text{TRIPS.trip\_id}$)*

---

## 5. Third Normal Form (3NF)

### 3NF Definition:
A relation is in **3NF** if and only if:
1. It is in **2NF**.
2. **No non-prime attribute is transitively dependent on the primary key**.  
   (Formally: For every non-trivial $X \to Y$, either $X$ is a superkey, or $Y$ is a prime attribute).

### Transitive Dependency Analysis:
In the relation:
$$\text{TRIPS}(\underline{\text{trip\_id}}, \text{title}, \text{dest\_id}, \text{dest\_name}, \text{state}, \text{dest\_category}, \text{dest\_budget}, \dots)$$
We have:
1. $\text{trip\_id} \to \text{dest\_id}$
2. $\text{dest\_id} \to \text{dest\_name}, \text{state}, \text{dest\_category}, \text{dest\_budget}$

Since $\text{dest\_id}$ is not a candidate key for `TRIPS`, the dependency:
$$\text{trip\_id} \to \text{dest\_name}$$
is a **transitive dependency** ($\text{trip\_id} \to \text{dest\_id} \to \text{dest\_name}$).

### 3NF Decomposition:
Extract destination data into an independent relation `DESTINATIONS` and reference it via a foreign key `destination_id`.

#### Final 3NF Relations:

1. **`DESTINATIONS`**:
   $$\underline{\text{id}}, \text{slug}, \text{name}, \text{state}, \text{category}, \text{short\_description}, \text{budget\_inr}, \text{image\_url}, \text{highlights}, \text{best\_season}, \text{duration}$$
   - **Primary Key:** `id`
   - **Candidate Key:** `slug`
   - **Dependencies:** $\text{id} \to \text{slug}, \text{name}, \text{state}, \text{category}, \text{budget\_inr}, \dots$

2. **`TRIPS`**:
   $$\underline{\text{id}}, \text{title}, \text{destination}, \text{destination\_id}, \text{start\_date}, \text{end\_date}, \text{budget}, \text{status}, \text{travelers}, \text{cover\_image}, \text{notes}$$
   - **Primary Key:** `id`
   - **Foreign Key:** $\text{destination\_id} \to \text{DESTINATIONS}(\text{id})$
   - **Dependencies:** $\text{id} \to \text{title}, \text{destination\_id}, \text{start\_date}, \dots$

3. **`ITINERARY_ITEMS`**:
   $$\underline{\text{id}}, \text{trip\_id}, \text{day\_number}, \text{date}, \text{time\_slot}, \text{title}, \text{location}, \text{category}, \text{cost}, \text{notes}, \text{completed}$$
   - **Primary Key:** `id`
   - **Foreign Key:** $\text{trip\_id} \to \text{TRIPS}(\text{id}) \text{ ON DELETE CASCADE}$

4. **`EXPENSES`**:
   $$\underline{\text{id}}, \text{trip\_id}, \text{title}, \text{category}, \text{amount}, \text{date}, \text{payment\_method}, \text{notes}$$
   - **Primary Key:** `id`
   - **Foreign Key:** $\text{trip\_id} \to \text{TRIPS}(\text{id}) \text{ ON DELETE CASCADE}$

5. **`IMPORTED_DATASETS`**:
   $$\underline{\text{id}}, \text{filename}, \text{dataset\_type}, \text{total\_rows}, \text{imported\_rows}, \text{rejected\_rows}, \text{cleaning\_summary}, \text{uploaded\_at}$$
   - **Primary Key:** `id`

---

## 6. Boyce-Codd Normal Form (BCNF) Verification

### BCNF Definition:
A relation $R$ is in **BCNF** if for every non-trivial functional dependency $X \to Y$, $X$ is a **Superkey** of $R$.

### Evaluation of Each Relation:

| Relation | Functional Dependency | Determinant ($X$) | Is $X$ a Superkey? | Status |
|---|---|---|:---:|:---:|
| **`DESTINATIONS`** | $\text{id} \to \text{all other attributes}$ | `id` | Yes (Primary Key) | ✅ BCNF |
| | $\text{slug} \to \text{all other attributes}$ | `slug` | Yes (Unique Constraint) | ✅ BCNF |
| **`TRIPS`** | $\text{id} \to \text{all other attributes}$ | `id` | Yes (Primary Key) | ✅ BCNF |
| **`ITINERARY_ITEMS`** | $\text{id} \to \text{all other attributes}$ | `id` | Yes (Primary Key) | ✅ BCNF |
| **`EXPENSES`** | $\text{id} \to \text{all other attributes}$ | `id` | Yes (Primary Key) | ✅ BCNF |
| **`IMPORTED_DATASETS`**| $\text{id} \to \text{all other attributes}$ | `id` | Yes (Primary Key) | ✅ BCNF |

### Conclusion:
Every determinant in all tables is a valid superkey. There are zero overlapping candidate keys causing anomalies. Therefore, the TripCraft schema is in **Full BCNF (Boyce-Codd Normal Form)** with:
- **Lossless Join Decomposition:** Natural joins across primary/foreign keys recover the exact original universal relation.
- **Dependency Preservation:** All functional dependencies are enforced directly by primary and unique key constraints.

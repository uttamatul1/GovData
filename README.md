# Indian Government Data Analytics Dashboard

A modern, full-featured web application that makes official Indian government statistics from key public sectors interactive, visual, and accessible.

## Technology Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Zustand
- **Charts:** Recharts + D3.js
- **Styling:** Tailwind CSS v3 + shadcn/ui
- **Icons:** Lucide React

## Project Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Run unit tests:**
   ```bash
   npm run test
   ```
   or
   ```bash
   npx vitest run
   ```

## Data Sources
Data in this application is entirely local and derived from official Government of India publications, including:
- **National Family Health Survey (NFHS):** http://rchiips.org/nfhs/
- **Sample Registration System (SRS):** https://censusindia.gov.in/census.website/data/SRSSTAT

*Note: Historical values are as published. Simulated projections in the Simulator tool are approximate and NOT official government estimates.*

## Adding New Metrics
1. Navigate to `src/data/metrics/`
2. Create a new file for the sector if it doesn't exist (e.g. `economy.data.ts`)
3. Define the metric following the `Metric` interface in `src/types/metric.types.ts`.
4. Export the metric and add it to `allMetrics` in `src/data/index.ts`.

## Simulation Models
The Policy Simulator (`src/utils/simulator.utils.ts`) uses simplified regression models based on historical trends (e.g. NFHS-5 data) to project the potential impact of macroscopic policy inputs. All models are implemented as pure TypeScript functions and are thoroughly unit-tested.

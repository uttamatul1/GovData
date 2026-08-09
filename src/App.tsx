import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ExplorePage } from './pages/ExplorePage';
import { ComparePage } from './pages/ComparePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<ExplorePage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="timeline" element={<Navigate to="/reports?view=timeline" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

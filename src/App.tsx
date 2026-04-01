import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { TransactionProvider } from './context/TransactionContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <RoleProvider>
          <TransactionProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/insights" element={<InsightsPage />} />
              </Route>
            </Routes>
          </TransactionProvider>
        </RoleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

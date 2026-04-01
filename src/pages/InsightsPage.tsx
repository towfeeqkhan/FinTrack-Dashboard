
import { motion } from 'framer-motion';

import InsightCard from '../components/insights/InsightCard';
import TopCategory from '../components/insights/TopCategory';
import MonthlyComparison from '../components/insights/MonthlyComparison';
import SpendingHeatmap from '../components/insights/SpendingHeatmap';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, getMonthKey, formatMonth } from '../utils/formatters';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PiggyBank,
} from 'lucide-react';

export default function InsightsPage() {
  const { state, totalIncome, totalExpenses } = useTransactions();

  const expenses = state.transactions.filter((t) => t.type === 'expense');

  const avgExpense = expenses.length > 0
    ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
    : 0;

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const highestExpense = expenses.length > 0
    ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0])
    : null;

  // Most active month
  const monthCounts = new Map<string, number>();
  state.transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
  });
  const mostActiveMonth = Array.from(monthCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];

  // Month-over-month change
  const monthlyExpenses = new Map<string, number>();
  expenses.forEach((t) => {
    const key = getMonthKey(t.date);
    monthlyExpenses.set(key, (monthlyExpenses.get(key) || 0) + t.amount);
  });
  const sortedMonths = Array.from(monthlyExpenses.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const momChange = sortedMonths.length >= 2
    ? ((sortedMonths[sortedMonths.length - 1][1] - sortedMonths[sortedMonths.length - 2][1]) / sortedMonths[sortedMonths.length - 2][1]) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <InsightCard
          title="Top Category"
          value={highestExpense ? highestExpense.category : 'N/A'}
          icon={<TrendingUp size={17} className="text-amber-500" />}
          description="Highest spending"
        />
        <InsightCard
          title="Avg Expense"
          value={formatCurrency(avgExpense)}
          icon={<DollarSign size={17} className="text-amber-500" />}
          description="Per transaction"
        />
        <InsightCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBank size={17} className="text-amber-500" />}
          description="Income saved"
        />
        <InsightCard
          title="Highest Expense"
          value={highestExpense ? formatCurrency(highestExpense.amount) : 'N/A'}
          icon={<TrendingDown size={17} className="text-red-500" />}
          description={highestExpense?.description || ''}
        />
        <InsightCard
          title="Most Active"
          value={mostActiveMonth ? formatMonth(`${mostActiveMonth[0]}-01`) : 'N/A'}
          icon={<Calendar size={17} className="text-amber-500" />}
          description={mostActiveMonth ? `${mostActiveMonth[1]} transactions` : ''}
        />
        <InsightCard
          title="Monthly Change"
          value={`${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}%`}
          icon={<BarChart3 size={17} className="text-amber-500" />}
          description="Month-over-month"
        />
      </div>

      {/* Charts */}
      <MonthlyComparison />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopCategory />
        <SpendingHeatmap />
      </div>
    </motion.div>
  );
}

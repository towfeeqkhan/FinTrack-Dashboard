import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/useTheme';
import { getMonthKey, formatMonth, formatCurrency } from '../../utils/formatters';

export default function MonthlyComparison() {
  const { state } = useTransactions();
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    state.transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      const existing = monthlyMap.get(key) || { income: 0, expenses: 0 };
      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expenses += t.amount;
      }
      monthlyMap.set(key, existing);
    });

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: formatMonth(`${key}-01`),
        Income: val.income,
        Expenses: val.expenses,
      }));
  }, [state.transactions]);

  const isDark = theme === 'dark';

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        Income vs Expenses
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Monthly comparison</p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                color: isDark ? '#e2e8f0' : '#1e293b',
              }}
              formatter={((value: number) => [formatCurrency(value)]) as never}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="Income"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="Expenses"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

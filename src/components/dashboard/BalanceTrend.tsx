import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/useTheme';
import { formatCurrency, getMonthKey, formatMonth } from '../../utils/formatters';

export default function BalanceTrend() {
  const { state } = useTransactions();
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    const sorted = [...state.transactions].sort((a, b) => a.date.localeCompare(b.date));

    sorted.forEach((t) => {
      const key = getMonthKey(t.date);
      const existing = monthlyMap.get(key) || { income: 0, expenses: 0 };
      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expenses += t.amount;
      }
      monthlyMap.set(key, existing);
    });

    const sortedMonths = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b));

    const result: { month: string; balance: number; income: number; expenses: number }[] = [];
    sortedMonths.reduce((acc, [key, val]) => {
      const balance = acc + val.income - val.expenses;
      result.push({
        month: formatMonth(`${key}-01`),
        balance,
        income: val.income,
        expenses: val.expenses,
      });
      return balance;
    }, 0);

    return result;
  }, [state.transactions]);

  const isDark = theme === 'dark';

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Balance Trend</h3>
      <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-5">Monthly balance over time</p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                color: isDark ? '#e2e8f0' : '#1e293b',
                fontSize: '12px',
              }}
              formatter={((value: number) => [formatCurrency(value), 'Balance']) as never}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3.5, stroke: isDark ? '#1e293b' : '#fff' }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import type { Category } from '../../types';
import { CATEGORY_COLORS } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function TopCategory() {
  const { state } = useTransactions();

  const categoryData = useMemo(() => {
    const map = new Map<Category, number>();
    let totalExpenses = 0;

    state.transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) || 0) + t.amount);
        totalExpenses += t.amount;
      });

    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: CATEGORY_COLORS[category],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions]);

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        Spending by Category
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Ranked by total amount spent
      </p>

      <div className="space-y-4">
        {categoryData.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right">
                  {formatPercentage(item.percentage)}
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

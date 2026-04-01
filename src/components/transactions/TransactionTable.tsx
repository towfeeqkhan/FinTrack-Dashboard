import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { useTransactions } from '../../context/TransactionContext';
import { useRole } from '../../context/RoleContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Transaction, SortField } from '../../types';
import { CATEGORY_COLORS } from '../../types';

interface TransactionTableProps {
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionTable({ onEdit }: TransactionTableProps) {
  const { filteredTransactions, state, setSort, removeTransaction } = useTransactions();
  const { isAdmin } = useRole();
  const { sortBy, sortOrder } = state.filters;

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-slate-400" />;
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-indigo-500" />
    ) : (
      <ArrowDown size={14} className="text-indigo-500" />
    );
  };

  if (filteredTransactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {([
              ['date', 'Date'],
              ['category', 'Category'],
              ['type', 'Type'],
              ['amount', 'Amount'],
            ] as [SortField, string][]).map(([field, label]) => (
              <th
                key={field}
                onClick={() => handleSort(field)}
                className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  {label}
                  <SortIcon field={field} />
                </div>
              </th>
            ))}
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Description
            </th>
            {isAdmin && (
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t, i) => (
            <motion.tr
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3.5 px-4 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(t.date)}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{t.category}</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                  {t.type === 'income' ? '↑ Income' : '↓ Expense'}
                </Badge>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`text-sm font-semibold ${
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </td>
              <td className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                {t.description}
              </td>
              {isAdmin && (
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-500 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => removeTransaction(t.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    t.type === 'income'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}
                >
                  {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{t.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(t.date)}</p>
                </div>
              </div>
              <p
                className={`text-sm font-bold ${
                  t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant={t.type === 'income' ? 'income' : 'expense'}>{t.category}</Badge>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => removeTransaction(t.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

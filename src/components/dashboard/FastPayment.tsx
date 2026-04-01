import { motion } from "framer-motion";
import { useTransactions } from "../../context/TransactionContext";
import { formatCurrency } from "../../utils/formatters";
import { CATEGORY_COLORS } from "../../types";
import type { Category } from "../../types";

export default function FastPayment() {
  const { state } = useTransactions();

  const categoryTotals = new Map<Category, number>();
  state.transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals.set(
        t.category,
        (categoryTotals.get(t.category) || 0) + t.amount,
      );
    });

  const tags = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      color: CATEGORY_COLORS[cat],
    }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 px-5 py-4">
      <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
        <span className="text-xs font-semibold text-gray-800 dark:text-white whitespace-nowrap">
          Fast payment
        </span>
        {tags.map((tag, i) => (
          <motion.div
            key={tag.category}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-xs text-gray-600 dark:text-slate-400">
              {tag.category}
            </span>
            <span className="text-xs font-semibold text-gray-800 dark:text-white">
              {formatCurrency(tag.amount)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useTransactions } from "../../context/TransactionContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CATEGORY_COLORS } from "../../types";

export default function RecentTransactions() {
  const { state } = useTransactions();
  const [page, setPage] = useState(0);
  const perPage = 5;

  const recent = useMemo(() => {
    return [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [state.transactions]);

  const totalPages = Math.ceil(recent.length / perPage);
  const paged = recent.slice(page * perPage, (page + 1) * perPage);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Last transaction
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-gray-500"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-gray-500"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <AnimatePresence mode="wait">
          {paged.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
              >
                {t.category.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
                  {t.description}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">
                  {formatDate(t.date)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <Badge
                  variant={t.type === "income" ? "income" : "expense"}
                  className="text-[9px] mb-0.5"
                >
                  {t.category.split(" ")[0]}
                </Badge>
                <p
                  className={`text-xs font-bold ${
                    t.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

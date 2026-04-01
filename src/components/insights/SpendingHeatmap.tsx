import { useMemo } from "react";
import { motion } from "framer-motion";
import Card from "../ui/Card";
import { useTransactions } from "../../context/TransactionContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKS = ["W1", "W2", "W3", "W4", "W5"];

export default function SpendingHeatmap() {
  const { state } = useTransactions();

  const heatmapData = useMemo(() => {
    const grid: number[][] = Array.from({ length: 5 }, () => Array(7).fill(0));
    let maxVal = 0;

    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const d = new Date(t.date);
        const dayOfWeek = d.getDay();
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        const weekOfMonth = Math.min(
          Math.floor((d.getDate() + firstDay - 1) / 7),
          4,
        );

        grid[weekOfMonth][dayOfWeek] += t.amount;
        if (grid[weekOfMonth][dayOfWeek] > maxVal) {
          maxVal = grid[weekOfMonth][dayOfWeek];
        }
      });

    return { grid, maxVal };
  }, [state.transactions]);

  const getColor = (value: number): string => {
    if (value === 0) return "bg-slate-100 dark:bg-slate-800";
    const intensity = value / heatmapData.maxVal;
    if (intensity < 0.25) return "bg-indigo-100 dark:bg-indigo-900/30";
    if (intensity < 0.5) return "bg-indigo-300 dark:bg-indigo-700/50";
    if (intensity < 0.75) return "bg-indigo-500 dark:bg-indigo-500/70";
    return "bg-indigo-700 dark:bg-indigo-400";
  };

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        Spending Heatmap
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Spending intensity by day and week
      </p>

      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            <div />
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          {heatmapData.grid.map((week, wi) => (
            <div key={wi} className="grid grid-cols-8 gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {WEEKS[wi]}
              </div>
              {week.map((value, di) => (
                <motion.div
                  key={`${wi}-${di}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.01 }}
                  className={`aspect-square rounded-lg ${getColor(value)} transition-colors cursor-default`}
                  title={`$${value.toFixed(2)}`}
                />
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
              Less
            </span>
            <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30" />
            <div className="w-4 h-4 rounded bg-indigo-300 dark:bg-indigo-700/50" />
            <div className="w-4 h-4 rounded bg-indigo-500 dark:bg-indigo-500/70" />
            <div className="w-4 h-4 rounded bg-indigo-700 dark:bg-indigo-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              More
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useMemo } from "react";

import Card from "../ui/Card";
import { useTransactions } from "../../context/TransactionContext";
import { useTheme } from "../../context/useTheme";
import type { Category } from "../../types";
import { CATEGORY_COLORS } from "../../types";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

export default function SpendingBreakdown() {
  const { state, totalExpenses } = useTransactions();
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const map = new Map<Category, number>();
    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) || 0) + t.amount);
      });
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name],
        percent: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions, totalExpenses]);

  const { topCategory, weekExpense, spendingTrend, miniData } = useMemo(() => {
    const top = chartData[0];

    let latestDateStr = "";
    state.transactions.forEach((t) => {
      if (!latestDateStr || t.date > latestDateStr) latestDateStr = t.date;
    });

    if (!latestDateStr) {
      return {
        topCategory: top,
        weekExpense: 0,
        spendingTrend: 0,
        miniData: [0, 0, 0, 0, 0, 0, 0],
      };
    }

    const latestDate = new Date(latestDateStr);
    const sevenDaysAgo = new Date(latestDate);
    sevenDaysAgo.setDate(latestDate.getDate() - 7);

    let wExpense = 0;

    const dailyData = new Array(12).fill(0);
    const twelveDaysAgo = new Date(latestDate);
    twelveDaysAgo.setDate(latestDate.getDate() - 11);

    let currMonthInc = 0;
    let currMonthExp = 0;
    const latestMonthKey = latestDateStr.substring(0, 7);

    state.transactions.forEach((t) => {
      const tDate = new Date(t.date);

      if (
        t.type === "expense" &&
        tDate >= sevenDaysAgo &&
        tDate <= latestDate
      ) {
        wExpense += t.amount;
      }

      if (
        t.type === "expense" &&
        tDate >= twelveDaysAgo &&
        tDate <= latestDate
      ) {
        const diffTime = Math.abs(latestDate.getTime() - tDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const index = 11 - diffDays;
        if (index >= 0 && index < 12) {
          dailyData[index] += t.amount;
        }
      }

      if (t.date.startsWith(latestMonthKey)) {
        if (t.type === "income") currMonthInc += t.amount;
        else currMonthExp += t.amount;
      }
    });

    const sTrend =
      currMonthInc > 0 ? Math.round((currMonthExp / currMonthInc) * 100) : 0;

    const maxDay = Math.max(...dailyData, 1);
    const normalizedMiniData = dailyData.map((d) => (d / maxDay) * 100);

    return {
      topCategory: top,
      weekExpense: wExpense,
      spendingTrend: sTrend,
      miniData: normalizedMiniData,
    };
  }, [chartData, state.transactions]);

  const isDark = theme === "dark";

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Top categories
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3.5">
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">
            Spend this week
          </p>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
            {formatCurrency(weekExpense)}
          </p>
          <p className="text-[10px] font-semibold text-emerald-500">↗ +2.5%</p>

          <div className="flex items-end gap-0.75 mt-2 h-8">
            {miniData.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-emerald-400/60 dark:bg-emerald-500/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3.5">
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">
            Total cashback
          </p>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
            {formatCurrency(topCategory ? topCategory.value : 0)}
          </p>
          <p className="text-[10px] font-semibold text-emerald-500">↗ +5.4%</p>

          <div className="flex items-center gap-1 mt-3">
            {chartData.slice(0, 4).map((d) => (
              <div
                key={d.name}
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: d.color, opacity: 0.8 }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3.5">
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">
            Spending trend
          </p>
          <p className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
            {spendingTrend}%
          </p>
          <p className="text-[10px] font-semibold text-emerald-500">↗ +4.5%</p>

          <div className="mt-2 h-8 flex items-center">
            <svg viewBox="0 0 36 36" className="w-10 h-10">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isDark ? "#334155" : "#e5e7eb"}
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray={`${spendingTrend}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {chartData.slice(0, 5).map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-xs text-gray-600 dark:text-slate-400 truncate">
              {item.name}
            </span>
            <span className="text-xs font-semibold text-gray-800 dark:text-white">
              {formatCurrency(item.value)}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-slate-500 w-10 text-right">
              {formatPercentage(item.percent)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

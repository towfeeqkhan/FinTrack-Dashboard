import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../../context/TransactionContext";
import { formatCurrency, getMonthKey } from "../../utils/formatters";
import { TrendingUp, TrendingDown, PiggyBank, BarChart3 } from "lucide-react";

export default function SummaryCards() {
  const { state } = useTransactions();

  const { prevIncome, prevExpenses, currIncome, currExpenses } = useMemo(() => {
    const monthSet = new Set<string>();
    state.transactions.forEach((t) => monthSet.add(getMonthKey(t.date)));
    const months = Array.from(monthSet).sort();

    if (months.length < 2) {
      return { prevIncome: 0, prevExpenses: 0, currIncome: 0, currExpenses: 0 };
    }

    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    let pI = 0,
      pE = 0,
      cI = 0,
      cE = 0;
    state.transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (key === lastMonth) {
        if (t.type === "income") cI += t.amount;
        else cE += t.amount;
      } else if (key === prevMonth) {
        if (t.type === "income") pI += t.amount;
        else pE += t.amount;
      }
    });

    return {
      prevIncome: pI,
      prevExpenses: pE,
      currIncome: cI,
      currExpenses: cE,
    };
  }, [state.transactions]);

  const incomeChange =
    prevIncome > 0 ? ((currIncome - prevIncome) / prevIncome) * 100 : 0;
  const expenseChange =
    prevExpenses > 0 ? ((currExpenses - prevExpenses) / prevExpenses) * 100 : 0;
  const prevBalance = prevIncome - prevExpenses;
  const currBalance = currIncome - currExpenses;
  const balanceChange =
    prevBalance > 0 ? ((currBalance - prevBalance) / prevBalance) * 100 : 0;
  const prevSavingsRate =
    prevIncome > 0 ? ((prevIncome - prevExpenses) / prevIncome) * 100 : 0;
  const currMoSavingsRate =
    currIncome > 0 ? ((currIncome - currExpenses) / currIncome) * 100 : 0;
  const savingsRateChange = currMoSavingsRate - prevSavingsRate;

  const cards = useMemo(
    () => [
      {
        title: "Income",
        value: currIncome,
        change: `${incomeChange >= 0 ? "+" : ""}${incomeChange.toFixed(1)}%`,
        comparison: `Compared to ${formatCurrency(prevIncome)} last month`,
        icon: TrendingUp,
        changeColor: incomeChange >= 0 ? "text-emerald-500" : "text-red-500",
      },
      {
        title: "Expense",
        value: currExpenses,
        change: `${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`,
        comparison: `Compared to ${formatCurrency(prevExpenses)} last month`,
        icon: TrendingDown,
        changeColor: expenseChange <= 0 ? "text-emerald-500" : "text-red-500",
      },
      {
        title: "Savings Rate",
        value: null,
        displayValue: `${currMoSavingsRate.toFixed(1)}%`,
        change: `${savingsRateChange >= 0 ? "+" : ""}${savingsRateChange.toFixed(1)}%`,
        comparison: `Previously ${prevSavingsRate.toFixed(1)}%`,
        icon: PiggyBank,
        changeColor:
          savingsRateChange >= 0 ? "text-emerald-500" : "text-red-500",
      },
      {
        title: "Net Saved",
        value: currBalance,
        change: `${balanceChange >= 0 ? "+" : ""}${balanceChange.toFixed(1)}%`,
        comparison: `Compared to ${formatCurrency(prevBalance)} last month`,
        icon: BarChart3,
        changeColor: balanceChange >= 0 ? "text-emerald-500" : "text-red-500",
      },
    ],
    [
      currIncome,
      currExpenses,
      currBalance,
      incomeChange,
      expenseChange,
      balanceChange,
      prevIncome,
      prevExpenses,
      prevBalance,
      currMoSavingsRate,
      prevSavingsRate,
      savingsRateChange,
    ],
  );

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.title}
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium text-gray-500 dark:text-slate-400">
              {card.title}
            </p>
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
              <card.icon
                size={15}
                className="text-gray-400 dark:text-slate-500"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {card.displayValue || formatCurrency(card.value!)}
            </p>
            <span className={`text-xs font-semibold ${card.changeColor}`}>
              {card.change}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            {card.comparison}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

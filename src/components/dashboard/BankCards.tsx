import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, getMonthKey } from '../../utils/formatters';

const cardDesigns = [
  {
    bg: 'bg-gradient-to-br from-rose-500 to-orange-500',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
  {
    bg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
  },
];

export default function BankCards() {
  const { state, totalBalance } = useTransactions();
  const scrollRef = useRef<HTMLDivElement>(null);

  
  const { latestMonthIncome, latestMonthExpenses, latestMonthLabel } = useMemo(() => {
    
    const monthKeys = new Set<string>();
    state.transactions.forEach((t) => monthKeys.add(getMonthKey(t.date)));
    const sorted = Array.from(monthKeys).sort();
    const latestKey = sorted[sorted.length - 1] || '';

    let income = 0;
    let expenses = 0;

    state.transactions.forEach((t) => {
      if (getMonthKey(t.date) === latestKey) {
        if (t.type === 'income') income += t.amount;
        else expenses += t.amount;
      }
    });

    const label = latestKey
      ? new Date(`${latestKey}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'N/A';

    return { latestMonthIncome: income, latestMonthExpenses: expenses, latestMonthLabel: label };
  }, [state.transactions]);

  const cards = useMemo(() => [
    {
      title: 'Total Balance',
      balance: totalBalance,
      label: 'MAIN ACCOUNT',
      number: '6473 6 3823 ****',
      brand: 'VISA',
    },
    {
      title: `Income (${latestMonthLabel})`,
      balance: latestMonthIncome,
      label: 'MONTHLY IN',
      number: '6634 3242 352',
      brand: 'mastercard',
    },
    {
      title: `Expenses (${latestMonthLabel})`,
      balance: latestMonthExpenses,
      label: 'MONTHLY OUT',
      number: '3355 2343',
      brand: 'VISA',
    },
  ], [totalBalance, latestMonthIncome, latestMonthExpenses, latestMonthLabel]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={14} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-1"
      >
        {cards.map((card, i) => {
          const design = cardDesigns[i % cardDesigns.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`shrink-0 w-65 h-37.5 ${design.bg} rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest opacity-80">{card.label}</span>
                <CreditCard size={20} className="opacity-70" />
              </div>

              <div className="mb-4">
                <p className="text-[9px] opacity-60 uppercase tracking-wider mb-1">{card.title}</p>
                <p className="text-lg font-bold tracking-wider">{formatCurrency(card.balance)}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold mt-0.5 opacity-90">{card.number}</p>
                </div>
                <span className="text-xs font-bold opacity-80 tracking-wider">{card.brand}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

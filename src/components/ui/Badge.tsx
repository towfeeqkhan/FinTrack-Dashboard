import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'income' | 'expense' | 'default' | 'info';
  className?: string;
}

const variants = {
  income: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  expense: 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400',
  default: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
  info: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

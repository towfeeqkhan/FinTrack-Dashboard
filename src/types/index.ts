export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export type Role = 'viewer' | 'admin';
export type Theme = 'light' | 'dark';

export type SortField = 'date' | 'amount' | 'category' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: Category | 'all';
  type: TransactionType | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface TransactionState {
  transactions: Transaction[];
  filters: FilterState;
  isLoading: boolean;
}

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

export const EXPENSE_CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES: Category[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f59e0b',
  'Transportation': '#3b82f6',
  'Shopping': '#ec4899',
  'Bills & Utilities': '#8b5cf6',
  'Entertainment': '#06b6d4',
  'Healthcare': '#10b981',
  'Education': '#f97316',
  'Salary': '#22c55e',
  'Freelance': '#6366f1',
  'Investment': '#14b8a6',
  'Other': '#94a3b8',
};

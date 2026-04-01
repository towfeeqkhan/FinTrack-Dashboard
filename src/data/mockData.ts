import type { Transaction } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const seedTransactions: Transaction[] = [
  // --- October 2025 ---
  { id: generateId(), date: '2025-10-02', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary - October' },
  { id: generateId(), date: '2025-10-03', amount: 85.50, category: 'Food & Dining', type: 'expense', description: 'Weekly grocery shopping' },
  { id: generateId(), date: '2025-10-05', amount: 120, category: 'Bills & Utilities', type: 'expense', description: 'Electricity bill' },
  { id: generateId(), date: '2025-10-07', amount: 45, category: 'Transportation', type: 'expense', description: 'Gas station fill-up' },
  { id: generateId(), date: '2025-10-10', amount: 250, category: 'Shopping', type: 'expense', description: 'New running shoes' },
  { id: generateId(), date: '2025-10-12', amount: 800, category: 'Freelance', type: 'income', description: 'Logo design project' },
  { id: generateId(), date: '2025-10-15', amount: 35, category: 'Entertainment', type: 'expense', description: 'Movie tickets and snacks' },
  { id: generateId(), date: '2025-10-18', amount: 92, category: 'Healthcare', type: 'expense', description: 'Pharmacy - prescription' },
  { id: generateId(), date: '2025-10-20', amount: 65, category: 'Food & Dining', type: 'expense', description: 'Dinner at Italian restaurant' },
  { id: generateId(), date: '2025-10-25', amount: 150, category: 'Education', type: 'expense', description: 'Online course subscription' },

  // --- November 2025 ---
  { id: generateId(), date: '2025-11-01', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary - November' },
  { id: generateId(), date: '2025-11-03', amount: 78, category: 'Food & Dining', type: 'expense', description: 'Weekly groceries' },
  { id: generateId(), date: '2025-11-05', amount: 135, category: 'Bills & Utilities', type: 'expense', description: 'Internet and phone bill' },
  { id: generateId(), date: '2025-11-08', amount: 320, category: 'Shopping', type: 'expense', description: 'Winter jacket' },
  { id: generateId(), date: '2025-11-10', amount: 1200, category: 'Freelance', type: 'income', description: 'Website development project' },
  { id: generateId(), date: '2025-11-12', amount: 55, category: 'Transportation', type: 'expense', description: 'Uber rides this week' },
  { id: generateId(), date: '2025-11-15', amount: 42, category: 'Entertainment', type: 'expense', description: 'Streaming subscriptions' },
  { id: generateId(), date: '2025-11-18', amount: 200, category: 'Healthcare', type: 'expense', description: 'Dental checkup' },
  { id: generateId(), date: '2025-11-22', amount: 95, category: 'Food & Dining', type: 'expense', description: 'Thanksgiving dinner supplies' },
  { id: generateId(), date: '2025-11-28', amount: 500, category: 'Investment', type: 'income', description: 'Stock dividend payout' },

  // --- December 2025 ---
  { id: generateId(), date: '2025-12-01', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary - December' },
  { id: generateId(), date: '2025-12-03', amount: 110, category: 'Food & Dining', type: 'expense', description: 'Holiday baking ingredients' },
  { id: generateId(), date: '2025-12-05', amount: 180, category: 'Bills & Utilities', type: 'expense', description: 'Heating bill - winter' },
  { id: generateId(), date: '2025-12-08', amount: 450, category: 'Shopping', type: 'expense', description: 'Christmas gifts' },
  { id: generateId(), date: '2025-12-10', amount: 60, category: 'Transportation', type: 'expense', description: 'Monthly bus pass' },
  { id: generateId(), date: '2025-12-12', amount: 1500, category: 'Freelance', type: 'income', description: 'Mobile app UI design' },
  { id: generateId(), date: '2025-12-15', amount: 85, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
  { id: generateId(), date: '2025-12-20', amount: 300, category: 'Shopping', type: 'expense', description: 'Holiday decorations' },
  { id: generateId(), date: '2025-12-25', amount: 2000, category: 'Salary', type: 'income', description: 'Year-end bonus' },
  { id: generateId(), date: '2025-12-28', amount: 75, category: 'Food & Dining', type: 'expense', description: 'New Year party supplies' },

  // --- January 2026 ---
  { id: generateId(), date: '2026-01-02', amount: 5400, category: 'Salary', type: 'income', description: 'Monthly salary - January (raise)' },
  { id: generateId(), date: '2026-01-04', amount: 92, category: 'Food & Dining', type: 'expense', description: 'Weekly grocery run' },
  { id: generateId(), date: '2026-01-06', amount: 125, category: 'Bills & Utilities', type: 'expense', description: 'Water and electricity' },
  { id: generateId(), date: '2026-01-08', amount: 40, category: 'Transportation', type: 'expense', description: 'Parking fees' },
  { id: generateId(), date: '2026-01-12', amount: 199, category: 'Education', type: 'expense', description: 'Programming bootcamp' },
  { id: generateId(), date: '2026-01-15', amount: 350, category: 'Investment', type: 'income', description: 'Crypto gains realized' },
  { id: generateId(), date: '2026-01-18', amount: 65, category: 'Entertainment', type: 'expense', description: 'Video game purchase' },
  { id: generateId(), date: '2026-01-20', amount: 88, category: 'Food & Dining', type: 'expense', description: 'Sushi restaurant dinner' },
  { id: generateId(), date: '2026-01-25', amount: 150, category: 'Healthcare', type: 'expense', description: 'Annual health checkup copay' },
  { id: generateId(), date: '2026-01-28', amount: 900, category: 'Freelance', type: 'income', description: 'Brand identity project' },

  // --- February 2026 ---
  { id: generateId(), date: '2026-02-01', amount: 5400, category: 'Salary', type: 'income', description: 'Monthly salary - February' },
  { id: generateId(), date: '2026-02-03', amount: 105, category: 'Food & Dining', type: 'expense', description: 'Grocery shopping' },
  { id: generateId(), date: '2026-02-05', amount: 140, category: 'Bills & Utilities', type: 'expense', description: 'Phone and internet' },
  { id: generateId(), date: '2026-02-08', amount: 220, category: 'Shopping', type: 'expense', description: 'Valentine gifts' },
  { id: generateId(), date: '2026-02-10', amount: 75, category: 'Food & Dining', type: 'expense', description: "Valentine's dinner" },
  { id: generateId(), date: '2026-02-14', amount: 50, category: 'Transportation', type: 'expense', description: 'Ride to airport' },
  { id: generateId(), date: '2026-02-18', amount: 1100, category: 'Freelance', type: 'income', description: 'Dashboard UI project' },
  { id: generateId(), date: '2026-02-20', amount: 35, category: 'Entertainment', type: 'expense', description: 'Book purchases' },
  { id: generateId(), date: '2026-02-22', amount: 180, category: 'Healthcare', type: 'expense', description: 'Eye exam and contacts' },
  { id: generateId(), date: '2026-02-28', amount: 600, category: 'Investment', type: 'income', description: 'Mutual fund returns' },

  // --- March 2026 ---
  { id: generateId(), date: '2026-03-01', amount: 5400, category: 'Salary', type: 'income', description: 'Monthly salary - March' },
  { id: generateId(), date: '2026-03-03', amount: 88, category: 'Food & Dining', type: 'expense', description: 'Weekly groceries' },
  { id: generateId(), date: '2026-03-05', amount: 110, category: 'Bills & Utilities', type: 'expense', description: 'Electricity bill' },
  { id: generateId(), date: '2026-03-08', amount: 175, category: 'Shopping', type: 'expense', description: 'Spring wardrobe update' },
  { id: generateId(), date: '2026-03-10', amount: 55, category: 'Transportation', type: 'expense', description: 'Car maintenance - oil change' },
  { id: generateId(), date: '2026-03-12', amount: 42, category: 'Entertainment', type: 'expense', description: 'Museum visit' },
  { id: generateId(), date: '2026-03-15', amount: 700, category: 'Freelance', type: 'income', description: 'Social media graphics' },
  { id: generateId(), date: '2026-03-18', amount: 95, category: 'Education', type: 'expense', description: 'Technical books' },
  { id: generateId(), date: '2026-03-22', amount: 130, category: 'Food & Dining', type: 'expense', description: 'Birthday dinner celebration' },
  { id: generateId(), date: '2026-03-25', amount: 60, category: 'Healthcare', type: 'expense', description: 'Pharmacy supplies' },
  { id: generateId(), date: '2026-03-28', amount: 450, category: 'Investment', type: 'income', description: 'Bond interest payment' },
];

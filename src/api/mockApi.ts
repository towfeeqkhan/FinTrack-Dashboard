import type { Transaction } from '../types';
import { seedTransactions } from '../data/mockData';

const DELAY = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(DELAY);
  const stored = localStorage.getItem('finance_transactions');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('finance_transactions', JSON.stringify(seedTransactions));
  return seedTransactions;
}

export async function addTransaction(transaction: Transaction): Promise<Transaction> {
  await delay(DELAY);
  const transactions = await fetchTransactionsSync();
  transactions.push(transaction);
  localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  return transaction;
}

export async function updateTransaction(updated: Transaction): Promise<Transaction> {
  await delay(DELAY);
  const transactions = await fetchTransactionsSync();
  const index = transactions.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    transactions[index] = updated;
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }
  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  await delay(DELAY);
  const transactions = await fetchTransactionsSync();
  const filtered = transactions.filter((t) => t.id !== id);
  localStorage.setItem('finance_transactions', JSON.stringify(filtered));
}

function fetchTransactionsSync(): Promise<Transaction[]> {
  const stored = localStorage.getItem('finance_transactions');
  if (stored) {
    return Promise.resolve(JSON.parse(stored));
  }
  return Promise.resolve([]);
}

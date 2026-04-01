import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionForm from '../components/transactions/TransactionForm';
import ExportButton from '../components/transactions/ExportButton';
import { useTransactions } from '../context/TransactionContext';
import { useRole } from '../context/RoleContext';
import type { Transaction } from '../types';

export default function TransactionsPage() {
  const { state, filteredTransactions } = useTransactions();
  const { isAdmin } = useRole();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingTransaction(null);
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            {filteredTransactions.length} of {state.transactions.length} transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          {isAdmin && (
            <button
              onClick={() => setFormOpen(true)}
              id="add-transaction-btn"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 text-gray-900 hover:bg-amber-500 transition-colors shadow-lg shadow-amber-400/25"
            >
              <Plus size={15} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <Card className="p-5">
        <TransactionFilters />
      </Card>

      <Card className="p-5">
        <TransactionTable onEdit={handleEdit} />
      </Card>

      <TransactionForm
        isOpen={formOpen}
        onClose={handleClose}
        editTransaction={editingTransaction}
      />
    </motion.div>
  );
}

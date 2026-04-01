import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useTransactions } from "../../context/TransactionContext";
import type { Transaction, TransactionType, Category } from "../../types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../types";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export default function TransactionForm({
  isOpen,
  onClose,
  editTransaction,
}: TransactionFormProps) {
  const { addNewTransaction, editTransaction: updateTransaction } =
    useTransactions();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "Food & Dining" as Category,
    type: "expense" as TransactionType,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        type: editTransaction.type,
        description: editTransaction.description,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        category: "Food & Dining",
        type: "expense",
        description: "",
      });
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  const categories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => {
    const validCategories =
      formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!validCategories.includes(formData.category)) {
      setFormData((prev) => ({ ...prev, category: validCategories[0] }));
    }
  }, [formData.type, formData.category]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.date) errs.date = "Date is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      errs.amount = "Enter a valid amount";
    if (!formData.description.trim())
      errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editTransaction) {
        await updateTransaction({
          ...editTransaction,
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await addNewTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
      errors[field]
        ? "border-red-400 dark:border-red-500"
        : "border-slate-200 dark:border-slate-600"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  formData.type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0.00"
            className={inputClass("amount")}
            id="form-amount"
          />
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as Category })
            }
            className={inputClass("category")}
            id="form-category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={inputClass("date")}
            id="form-date"
          />
          {errors.date && (
            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="What was this transaction for?"
            className={inputClass("description")}
            id="form-description"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/25"
            id="form-submit"
          >
            {isSubmitting
              ? "Saving..."
              : editTransaction
                ? "Update"
                : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

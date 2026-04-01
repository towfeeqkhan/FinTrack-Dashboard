import { motion } from "framer-motion";
import BankCards from "../components/dashboard/BankCards";
import SummaryCards from "../components/dashboard/SummaryCards";
import FastPayment from "../components/dashboard/FastPayment";
import SpendingBreakdown from "../components/dashboard/SpendingBreakdown";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BalanceTrend from "../components/dashboard/BalanceTrend";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Overview
      </h1>

      {/* Bank Cards */}
      <BankCards />

      {/* Summary Stats */}
      <SummaryCards />

      {/* Fast Payment Tags */}
      <FastPayment />

      {/* Bottom: Top Categories + Last Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SpendingBreakdown />
        <RecentTransactions />
      </div>

      <BalanceTrend />
    </motion.div>
  );
}

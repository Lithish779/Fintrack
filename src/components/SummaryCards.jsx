import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

export default function SummaryCards() {
    const { summary, formatCurrency } = useFinance();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="glass-card p-6 flex items-center justify-between bg-white/60 dark:bg-white/5">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300">{formatCurrency(summary.balance)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                    <Wallet className="text-primary w-6 h-6" />
                </div>
            </div>

            {/* Income Card */}
            <div className="glass-card p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Income</p>
                    <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-all duration-300">{formatCurrency(summary.income)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-inner">
                    <ArrowUpCircle className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                </div>
            </div>

            {/* Expense Card */}
            <div className="glass-card p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Expenses</p>
                    <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-400 transition-all duration-300">{formatCurrency(summary.expense)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shadow-inner">
                    <ArrowDownCircle className="text-rose-600 dark:text-rose-400 w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

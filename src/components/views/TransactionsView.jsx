import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionList from '../TransactionList';
import { Filter } from 'lucide-react';

export default function TransactionsView({ onEdit }) {
    const { transactions } = useFinance();
    const [selectedMonth, setSelectedMonth] = useState('All');

    // Get unique months from transactions for the filter
    const months = useMemo(() => {
        const uniqueMonths = new Set();
        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            uniqueMonths.add(monthYear);
        });
        return ['All', ...Array.from(uniqueMonths)];
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        if (selectedMonth === 'All') return transactions;
        return transactions.filter(t => {
            const date = new Date(t.date);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            return monthYear === selectedMonth;
        });
    }, [transactions, selectedMonth]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h2>

                {/* Check if we have transactions to filter */}
                {transactions.length > 0 && (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-500" />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                        >
                            {months.map(m => (
                                <option key={m} value={m} className="dark:bg-gray-800">{m}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="glass-panel p-6">
                <TransactionList onEdit={onEdit} data={filteredTransactions} />
            </div>
        </div>
    );
}

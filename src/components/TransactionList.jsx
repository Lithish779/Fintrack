import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatDate } from '../utils';
import { Trash2, ShoppingBag, Coffee, Home, Car, Zap, IndianRupee, Edit2, Wallet } from 'lucide-react';

const CATEGORY_ICONS = {
    'Food': <Coffee className="w-5 h-5 text-orange-500" />,
    'Shopping': <ShoppingBag className="w-5 h-5 text-purple-500" />,
    'Housing': <Home className="w-5 h-5 text-blue-500" />,
    'Transport': <Car className="w-5 h-5 text-indigo-500" />,
    'Utilities': <Zap className="w-5 h-5 text-yellow-500" />,
    // Updated icon for Income to use IndianRupee
    'Income': <IndianRupee className="w-5 h-5 text-emerald-500" />,
    'Other': <Wallet className="w-5 h-5 text-gray-500" />
};

export default function TransactionList({ onEdit, data }) {
    const { transactions: contextTransactions, deleteTransaction, formatCurrency } = useFinance();

    // Use passed data if available, otherwise use context data
    const transactions = data || contextTransactions;


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(id);
        }
    };


    if (transactions.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 glass-panel">
                <p>No transactions yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-lg transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                {CATEGORY_ICONS[tx.category] || CATEGORY_ICONS['Other']}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{tx.category} • {formatDate(tx.date)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {tx.amount >= 0 ? '+' : ''}
                                {formatCurrency(tx.amount)}
                            </span>
                            <button
                                onClick={() => onEdit(tx)}
                                className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(tx.id)}
                                className="text-green-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
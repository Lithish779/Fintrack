import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, X } from 'lucide-react';

export default function AddTransactionForm({ onClose, initialData }) {
    const { addTransaction, updateTransaction } = useFinance();
    const [title, setTitle] = useState(initialData?.title || '');
    const [amount, setAmount] = useState(initialData ? Math.abs(initialData.amount) : '');
    const [type, setType] = useState(initialData?.amount >= 0 ? 'income' : 'expense'); // 'income' or 'expense'
    const [category, setCategory] = useState(initialData?.category || 'Food');
    const [loading, setLoading] = useState(false);

    const categories = ['Food', 'Shopping', 'Housing', 'Transport', 'Utilities', 'Income', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double-clicks

        setLoading(true);

        const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

        try {
            if (initialData) {
                await updateTransaction(initialData.id, {
                    title,
                    amount: finalAmount,
                    category,
                    date: initialData.date
                });
            } else {
                await addTransaction({
                    title,
                    amount: finalAmount,
                    category,
                    date: new Date()
                });
            }

            // 1. Clear form first
            setTitle('');
            setAmount('');

            // 2. Close the modal
            onClose();
        } catch (error) {
            console.error("Failed to save transaction:", error);
            // ONLY set loading to false if we are STAYING on the page (due to an error)
            setLoading(false);
        }
        // Note: We don't necessarily need setLoading(false) here 
        // because onClose() unmounts the component anyway.
    };

    return (
        <div className="glass-panel p-6 relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
                <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        className="glass-input w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Grocery Shopping"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            className="glass-input w-full"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select
                            className="glass-input w-full"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                        className="glass-input w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full glass-button mt-2 flex justify-center items-center gap-2"
                >
                    {loading ? 'Saving...' : <>{initialData ? 'Update' : <Plus size={18} />} {initialData ? 'Transaction' : 'Add Transaction'}</>}
                </button>
            </form>
        </div>
    );
}

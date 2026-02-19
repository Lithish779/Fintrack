import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { User, Download, Trash2, Moon, Sun, LogOut, Lock } from 'lucide-react';

export default function SettingsView() {
    const { currentUser, logout, updateUserPassword } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { transactions, clearAllTransactions, currency, setCurrency } = useFinance();

    // Password State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            setMessage({ type: '', text: '' });
            setLoading(true);
            await updateUserPassword(password);
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Failed to update password", error);
            if (error.code === 'auth/requires-recent-login') {
                setMessage({ type: 'error', text: 'Please log out and log back in to update your password.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update password.' });
            }
        }
        setLoading(false);
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        // CSV Header
        const headers = ["Date", "Title", "Amount", "Category", "Type"];

        // CSV Rows
        const rows = transactions.map(t => {
            const date = new Date(t.date).toLocaleDateString('en-IN');
            const type = t.amount >= 0 ? "Income" : "Expense";
            return [
                date,
                `"${t.title}"`, // Quote title to handle commas
                t.amount,
                t.category,
                type
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        // Download logic
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `fintrack_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearData = async () => {
        if (window.confirm("ARE YOU SURE? This will permanently delete ALL your transactions. This action cannot be undone.")) {
            await clearAllTransactions();
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>

            {/* Profile Section */}
            <div className="glass-panel p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">User Profile</h3>
                        <p className="text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-4 py-2 rounded-lg transition-colors font-medium border border-rose-200 dark:border-rose-900"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>

            {/* Appearance Section */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Appearance & Preferences</h3>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 dark:text-gray-300">App Theme</span>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === 'light' ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Currency</span>
                    <select
                        value={useFinance().currency}
                        onChange={(e) => useFinance().setCurrency(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
            </div>

            {/* Security Section (Change Password) */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Lock size={18} /> Security
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            className="glass-input w-full dark:bg-black/20 dark:text-white"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="glass-input w-full dark:bg-black/20 dark:text-white"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-button w-full flex justify-center"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Data Management Section */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Data Management</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Export Information</p>
                            <p className="text-sm text-gray-500">Download all your transactions as a CSV file.</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                        <div>
                            <p className="font-medium text-red-600 dark:text-red-400">Danger Zone</p>
                            <p className="text-sm text-gray-500">Permanently delete all data.</p>
                        </div>
                        <button
                            onClick={handleClearData}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                        >
                            <Trash2 size={18} /> <span className="hidden sm:inline">Clear Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

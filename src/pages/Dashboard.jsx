import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CreditCard,
    Settings,
    LogOut,
    Plus,
    Menu,
    PieChart,
    Sun,
    Moon
} from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import FinancialCharts from '../components/FinancialCharts';
import TransactionsView from '../components/views/TransactionsView';
import ReportsView from '../components/views/ReportsView';
import SettingsView from '../components/views/SettingsView';

export default function Dashboard() {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard'); // For mobile nav highlighting

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingTransaction(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const NavItem = ({ icon: Icon, label, id, onClick }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                if (onClick) onClick();
            }}
            className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all ${activeTab === id
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
                }`}
        >
            <Icon size={20} />
            <span className="hidden md:inline">{label}</span>
        </button>
    );

    return (
        <div className="flex bg-background-start min-h-screen">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col glass-panel m-4 mr-0 border-r-0 rounded-2xl">
                <div className="p-6">
                    <h1 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
                        FinTrack <span className="text-xs bg-primary text-white py-1 px-2 rounded-full"></span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem id="transactions" icon={CreditCard} label="Transactions" />
                    <NavItem id="reports" icon={PieChart} label="Reports" />
                    <NavItem id="settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {currentUser?.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-700 truncate">{currentUser?.email}</p>
                            <p className="text-xs text-gray-400"></p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 p-2 rounded-lg w-full transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen bg-transparent">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">
                            {activeTab === 'dashboard' && 'Overview'}
                            {activeTab === 'transactions' && 'Transactions'}
                            {activeTab === 'reports' && 'Reports'}
                            {activeTab === 'settings' && 'Settings'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {activeTab === 'dashboard' && "Here's what's happening with your money."}
                            {activeTab === 'transactions' && "Manage your income and expenses."}
                            {activeTab === 'reports' && "Visualize your spending habits."}
                            {activeTab === 'settings' && "Manage your preferences and data."}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full glass-button bg-white/50 dark:bg-black/30 text-gray-800 dark:text-yellow-400 hover:bg-white/80 dark:hover:bg-black/50"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        {/* Mobile Menu Button - Optional: Could implement a drawer here later */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 glass-button bg-white/50 dark:bg-black/30"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <>
                            <SummaryCards />
                            <FinancialCharts />
                            <div className="grid grid-cols-1 gap-8">
                                <div className="w-full">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                                    <TransactionList onEdit={handleEdit} />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'transactions' && <TransactionsView onEdit={handleEdit} />}
                    {activeTab === 'reports' && <ReportsView />}
                    {activeTab === 'settings' && <SettingsView />}
                </div>
            </main>

            {/* Floating Action Button for Mobile */}
            <button
                onClick={() => {
                    setEditingTransaction(null);
                    setShowAddModal(true);
                }}
                className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                <Plus size={28} />
            </button>

            {/* Bottom Nav - Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel m-0 rounded-none rounded-t-2xl border-t border-white/40 flex justify-around p-4 z-40 bg-white/80">
                <button className={activeTab === 'dashboard' ? 'text-primary' : 'text-gray-400'} onClick={() => setActiveTab('dashboard')}>
                    <LayoutDashboard size={24} />
                </button>
                <button className={activeTab === 'transactions' ? 'text-primary' : 'text-gray-400'} onClick={() => setActiveTab('transactions')}>
                    <CreditCard size={24} />
                </button>
                <div className="w-8"></div> {/* Spacer for FAB */}
                <button className={activeTab === 'reports' ? 'text-primary' : 'text-gray-400'} onClick={() => setActiveTab('reports')}>
                    <PieChart size={24} />
                </button>
                <button className={activeTab === 'settings' ? 'text-primary' : 'text-gray-400'} onClick={() => setActiveTab('settings')}>
                    <Settings size={24} />
                </button>
            </nav>

            {/* Desktop Add Button (in header or FAB) - Let's put a FAB for desktop too or a button in header */}
            <button
                onClick={() => {
                    setEditingTransaction(null);
                    setShowAddModal(true);
                }}
                className="hidden md:flex fixed bottom-8 right-8 glass-button items-center gap-2 z-50 shadow-2xl hover:scale-105"
            >
                <Plus size={20} /> Add Transaction
            </button>

            {/* Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <AddTransactionForm
                            onClose={handleCloseModal}
                            initialData={editingTransaction}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

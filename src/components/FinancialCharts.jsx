import React from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
} from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
);

export default function FinancialCharts() {
    const { transactions } = useFinance();
    const { theme } = useTheme();

    const isDark = theme === 'dark';
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Process data for Donut Chart (Expenses by Category)
    const expensesByCategory = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, curr) => {
            const cat = curr.category;
            acc[cat] = (acc[cat] || 0) + Math.abs(curr.amount);
            return acc;
        }, {});

    const donutData = {
        labels: Object.keys(expensesByCategory),
        datasets: [
            {
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'
                ],
                borderColor: isDark ? '#1f2937' : '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    // Process data for Line Chart (Savings Trend - cumulative balance over time)
    // Sort by date ascending for the line chart
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentBalance = 0;
    const balanceHistory = sortedTx.map(t => {
        currentBalance += parseFloat(t.amount);
        return {
            date: t.date,
            balance: currentBalance
        };
    });

    const lineData = {
        labels: balanceHistory.map(h => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(h.date)),
        datasets: [
            {
                label: 'Savings Trend',
                data: balanceHistory.map(h => h.balance),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366f1',
            }
        ],
    };

    // Process data for Bar Chart (Income vs Expense per Month)
    // Simplified: Global Income vs Expense for now, or last 6 months could be better but sticking to total for simplicity
    // Let's do a simple comparison: Income vs Expense Total

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const barData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount',
                data: [totalIncome, totalExpense],
                backgroundColor: ['#34D399', '#F87171'],
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: textColor,
                    usePointStyle: true,
                }
            },
            title: {
                display: false,
                color: textColor
            }
        },
        scales: {
            y: {
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
            x: {
                ticks: { color: textColor },
                grid: { display: false },
            }
        }
    };

    const donutOptions = {
        ...options,
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Donut Chart */}
            <div className="glass-panel p-6 h-80 flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 w-full">Expense Breakdown</h3>
                <div className="flex-1 w-full flex justify-center relative">
                    {Object.keys(expensesByCategory).length > 0 ? (
                        <Doughnut data={donutData} options={donutOptions} />
                    ) : (
                        <p className="text-gray-400 self-center">No expense data yet</p>
                    )}
                </div>
            </div>

            {/* Bar Chart (New) */}
            <div className="glass-panel p-6 h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Income vs Expense</h3>
                <div className="flex-1 w-full relative">
                    <Bar data={barData} options={options} />
                </div>
            </div>

            {/* Line Chart */}
            <div className="glass-panel p-6 h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Savings Trend</h3>
                <div className="flex-1 w-full relative">
                    {balanceHistory.length > 0 ? (
                        <Line data={lineData} options={options} />
                    ) : (
                        <p className="text-gray-400 text-center h-full flex items-center justify-center">No transaction history</p>
                    )}
                </div>
            </div>
        </div>
    );
}

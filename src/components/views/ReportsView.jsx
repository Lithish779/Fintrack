import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportsView() {
    const { transactions, summary, formatCurrency } = useFinance();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Calculate Expenses by Category
    const categoryStats = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, curr) => {
            const cat = curr.category;
            const amount = Math.abs(curr.amount);
            acc[cat] = (acc[cat] || 0) + amount;
            return acc;
        }, {});

    const sortedCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a);

    const chartData = {
        labels: Object.keys(categoryStats),
        datasets: [
            {
                data: Object.values(categoryStats),
                backgroundColor: [
                    '#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#9CA3AF'
                ],
                borderColor: isDark ? '#1f2937' : '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    usePointStyle: true,
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="glass-panel p-6 h-80 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 self-start">Expense Distribution</h3>
                    {Object.keys(categoryStats).length > 0 ? (
                        <div className="w-full h-full relative">
                            <Doughnut data={chartData} options={options} />
                        </div>
                    ) : (
                        <p className="text-gray-400">No expense data to analyze</p>
                    )}
                </div>

                {/* Detailed Breakdown */}
                <div className="glass-panel p-6 overflow-y-auto max-h-80">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Category Breakdown</h3>
                    <div className="space-y-5">
                        {sortedCategories.map(([category, amount]) => {
                            const percentage = Math.round((amount / summary.expense) * 100) || 0;
                            return (
                                <div key={category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {formatCurrency(amount)} ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {sortedCategories.length === 0 && (
                            <p className="text-gray-400 text-sm">No expenses recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

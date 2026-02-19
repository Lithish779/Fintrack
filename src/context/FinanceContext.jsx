import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FinanceContext = createContext();

export function useFinance() {
    return useContext(FinanceContext);
}

export function FinanceProvider({ children }) {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

    // Currency State
    const [currency, setCurrency] = useState(() => localStorage.getItem('fintrack-currency') || 'INR');

    useEffect(() => {
        localStorage.setItem('fintrack-currency', currency);
    }, [currency]);

    // Format Currency Helper
    const formatCurrency = (amount) => {
        const config = {
            'INR': { locale: 'en-IN', currency: 'INR' },
            'USD': { locale: 'en-US', currency: 'USD' },
            'EUR': { locale: 'de-DE', currency: 'EUR' },
            'GBP': { locale: 'en-GB', currency: 'GBP' }
        }[currency];

        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setSummary({ income: 0, expense: 0, balance: 0 });
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'transactions'),
            where('uid', '==', currentUser.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Timestamp to Date object for easier handling
                date: doc.data().date?.toDate() || new Date()
            }));

            setTransactions(docs);
            calculateSummary(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            toast.error("Failed to load transactions. You might need to create a Firestore index.");
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    function calculateSummary(txs) {
        const income = txs
            .filter(t => t.amount > 0)
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        const expense = txs
            .filter(t => t.amount < 0)
            .reduce((acc, curr) => acc + Math.abs(parseFloat(curr.amount)), 0);

        setSummary({
            income,
            expense,
            balance: income - expense
        });
    }

    async function addTransaction(transaction) {
        try {
            await addDoc(collection(db, 'transactions'), {
                ...transaction,
                uid: currentUser.uid,
                amount: parseFloat(transaction.amount),
                date: transaction.date || serverTimestamp(),
                createdAt: serverTimestamp()
            });
            toast.success("Transaction added!");
        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error("Failed to add transaction.");
            throw error;
        }
    }

    async function deleteTransaction(id) {
        try {
            await deleteDoc(doc(db, 'transactions', id));
            toast.success("Transaction deleted.");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.error("Failed to delete transaction.");
            throw error;
        }
    }

    async function updateTransaction(id, updates) {
        try {
            await updateDoc(doc(db, 'transactions', id), updates);
            toast.success("Transaction updated.");
        } catch (error) {
            console.error("Error updating transaction:", error);
            toast.error("Failed to update transaction.");
            throw error;
        }
    }

    async function clearAllTransactions() {
        try {
            const batch = writeBatch(db);
            transactions.forEach((t) => {
                const ref = doc(db, 'transactions', t.id);
                batch.delete(ref);
            });
            await batch.commit();
            toast.success("All transactions deleted.");
        } catch (error) {
            console.error("Error clearing transactions:", error);
            toast.error("Failed to delete all transactions.");
            throw error;
        }
    }

    const value = {
        transactions,
        summary,
        loading,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        clearAllTransactions,
        currency,
        setCurrency,
        formatCurrency
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

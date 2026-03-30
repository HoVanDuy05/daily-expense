'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory, DailyExpense } from '@/types/expense';
import { groupExpensesByDay, generateId } from '@/lib/utils';
import { format, parseISO, isToday, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'daily-expense-data';

interface UseExpensesReturn {
  expenses: Expense[];
  dailyGroups: DailyExpense[];
  todayExpenses: Expense[];
  todayTotal: number;
  monthTotal: number;
  loading: boolean;
  addExpense: (data: {
    amount: number;
    type: 'income' | 'expense';
    category: ExpenseCategory;
    note: string;
    image: string;
    collaborators?: string[];
  }) => Promise<void>;
  deleteExpense: (id: string) => void;
  getMonthlyExpenses: (year: number, month: number) => Expense[];
  refresh: () => void;
}

export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setExpenses(parsed.expenses || []);
        }
      } catch (error) {
        console.error('Failed to load expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses }));
      } catch (error) {
        console.error('Failed to save expenses:', error);
      }
    }
  }, [expenses, loading]);

  const addExpense = useCallback(async (data: {
    amount: number;
    type: 'income' | 'expense';
    category: ExpenseCategory;
    note: string;
    image: string;
    collaborators?: string[];
  }) => {
    const newExpense: Expense = {
      id: generateId(),
      user_id: 'user_001',
      amount: data.amount,
      type: data.type,
      category: data.category,
      image_url: data.image,
      note: data.note,
      collaborators: data.collaborators || [],
      created_at: new Date().toISOString(),
    };

    setExpenses(prev => [newExpense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const getMonthlyExpenses = useCallback((year: number, month: number) => {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    return expenses.filter(e =>
      isWithinInterval(parseISO(e.created_at), { start, end })
    );
  }, [expenses]);

  const refresh = useCallback(() => {
    setLoading(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setExpenses(parsed.expenses || []);
    }
    setLoading(false);
  }, []);

  // Computed values
  const dailyGroups = groupExpensesByDay(expenses);

  const todayExpenses = expenses.filter(e =>
    isToday(parseISO(e.created_at))
  );

  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const now = new Date();
  const monthTotal = getMonthlyExpenses(now.getFullYear(), now.getMonth() + 1)
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    expenses,
    dailyGroups,
    todayExpenses,
    todayTotal,
    monthTotal,
    loading,
    addExpense,
    deleteExpense,
    getMonthlyExpenses,
    refresh,
  };
}

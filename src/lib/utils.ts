import { Expense, DailyExpense, ExpenseCategory } from '@/types/expense';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' VND';
};

export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: vi });
};

export const formatDateRelative = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();

  if (isSameDay(d, today)) {
    return 'Hôm nay';
  }

  return format(d, 'EEEE, dd/MM', { locale: vi });
};

export const groupExpensesByDay = (expenses: Expense[]): DailyExpense[] => {
  const grouped = expenses.reduce((acc, expense) => {
    const date = format(parseISO(expense.created_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { date, expenses: [], total: 0 };
    }
    acc[date].expenses.push(expense);
    acc[date].total += expense.amount;
    return acc;
  }, {} as Record<string, DailyExpense>);

  return Object.values(grouped).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const calculateMonthlyTotal = (expenses: Expense[], year: number, month: number): number => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));

  return expenses
    .filter(e => isWithinInterval(parseISO(e.created_at), { start, end }))
    .reduce((sum, e) => sum + e.amount, 0);
};

export const calculateCategoryTotals = (expenses: Expense[]): Record<ExpenseCategory, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);
};

export const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

'use client';

import { Box, Typography, Paper, Divider } from '@mui/material';
import { DailyExpense } from '@/types/expense';
import { formatDateRelative, formatCurrency, formatDate } from '@/lib/utils';
import ExpenseCard from './ExpenseCard';

interface DailyGroupProps {
  dailyExpense: DailyExpense;
  onExpenseClick?: (expenseId: string) => void;
}

export default function DailyGroup({ dailyExpense, onExpenseClick }: DailyGroupProps) {
  const { date, expenses, total } = dailyExpense;
  const isToday = formatDateRelative(date) === 'Hôm nay';

  return (
    <Box sx={{ mb: 3 }}>
      {/* Date Header */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 1.5,
          borderRadius: 2,
          bgcolor: isToday ? 'primary.light' : 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color={isToday ? 'primary.dark' : 'text.primary'}
        >
          {formatDateRelative(date)}
        </Typography>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color={isToday ? 'primary.dark' : 'error.main'}
        >
          {formatCurrency(total)}
        </Typography>
      </Paper>

      {/* Expense Cards */}
      <Box>
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onClick={onExpenseClick ? () => onExpenseClick(expense.id) : undefined}
          />
        ))}
      </Box>
    </Box>
  );
}

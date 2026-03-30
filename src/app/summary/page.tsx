'use client';

import { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Grid
} from '@mui/material';
import {
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconReceipt
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import CategoryChart from '@/components/CategoryChart';
import TrendChart from '@/components/TrendChart';
import ExpenseForm from '@/components/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, calculateCategoryTotals } from '@/lib/utils';
import { ExpenseCategory, CATEGORY_MAP } from '@/types/expense';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

type Period = 'month' | 'quarter' | 'year';

export default function SummaryPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('month');
  const { expenses, addExpense, todayTotal, monthTotal } = useExpenses();

  const handleSubmit = async (data: {
    amount: number;
    type: 'income' | 'expense';
    category: ExpenseCategory;
    note: string;
    image: string;
    collaborators: string[];
  }) => {
    await addExpense(data);
    setFormOpen(false);
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (period) {
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'quarter':
        start = subMonths(now, 3);
        break;
      case 'year':
        start = subMonths(now, 12);
        break;
      default:
        start = startOfMonth(now);
    }

    return expenses.filter(e =>
      isWithinInterval(parseISO(e.created_at), { start, end })
    );
  };

  const filteredExpenses = getFilteredExpenses();
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const count = filteredExpenses.length;
  const average = count > 0 ? total / count : 0;

  const categoryTotals = calculateCategoryTotals(filteredExpenses);
  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0];

  const periodLabels: Record<Period, string> = {
    month: 'Tháng này',
    quarter: '3 tháng qua',
    year: 'Năm nay',
  };

  return (
    <Layout onCameraClick={() => setFormOpen(true)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconChartBar size={24} color="#1976d2" />
        <Typography variant="h6" fontWeight={600}>
          Thống kê chi tiêu
        </Typography>
      </Box>

      {/* Period Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(e, value) => value && setPeriod(value)}
          size="small"
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        >
          <ToggleButton value="month">Tháng</ToggleButton>
          <ToggleButton value="quarter">Quý</ToggleButton>
          <ToggleButton value="year">Năm</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <IconReceipt size={24} color="#1976d2" style={{ marginBottom: 8 }} />
              <Typography variant="caption" color="text.secondary" display="block">
                Tổng chi tiêu
              </Typography>
              <Typography variant="h6" fontWeight={700} color="error.main">
                {formatCurrency(total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <IconTrendingUp size={24} color="#4caf50" style={{ marginBottom: 8 }} />
              <Typography variant="caption" color="text.secondary" display="block">
                Số giao dịch
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {count}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Box sx={{ mb: 3 }}>
        <CategoryChart expenses={filteredExpenses} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TrendChart expenses={expenses} />
      </Box>

      {/* Additional Stats */}
      {topCategory && (
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Chi tiêu nhiều nhất
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: CATEGORY_MAP[topCategory[0] as ExpenseCategory].color,
                }}
              />
              <Typography variant="body1" fontWeight={600}>
                {CATEGORY_MAP[topCategory[0] as ExpenseCategory].label}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 'auto' }}>
                {formatCurrency(topCategory[1])} ({((topCategory[1] / total) * 100).toFixed(1)}%)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}

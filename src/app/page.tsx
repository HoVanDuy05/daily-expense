'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import {
  IconTrendingUp,
  IconCalendar,
  IconReceipt,
  IconPlus
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseCard from '@/components/ExpenseCard';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/utils';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/expense';

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false);
  const {
    todayExpenses,
    todayTotal,
    monthTotal,
    addExpense,
    expenses
  } = useExpenses();

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

  const dailyBudget = 300000;
  const dailyProgress = Math.min((todayTotal / dailyBudget) * 100, 100);

  return (
    <ProtectedRoute>
      <Layout onCameraClick={() => setFormOpen(true)}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconReceipt size={20} color="#1976d2" />
                  <Typography variant="caption" color="text.secondary">
                    Hôm nay
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {formatCurrency(todayTotal)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={dailyProgress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: dailyProgress > 80 ? 'error.main' : 'primary.main',
                        borderRadius: 3,
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {todayExpenses.length} giao dịch
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconCalendar size={20} color="#1976d2" />
                  <Typography variant="caption" color="text.secondary">
                    Tháng này
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {formatCurrency(monthTotal)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {expenses.length} giao dịch
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Danh mục chi tiêu
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {EXPENSE_CATEGORIES.slice(0, 4).map((cat) => {
            const catExpenses = todayExpenses.filter(e => e.category === cat.id);
            const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
            return (
              <Chip
                key={cat.id}
                label={`${cat.label}: ${formatCurrency(catTotal)}`}
                sx={{
                  bgcolor: cat.color + '20',
                  color: cat.color,
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Giao dịch hôm nay
          </Typography>
          {todayExpenses.length > 0 && (
            <Button
              size="small"
              startIcon={<IconPlus size={16} />}
              onClick={() => setFormOpen(true)}
            >
              Thêm
            </Button>
          )}
        </Box>

        {todayExpenses.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
            <CardContent>
              <IconTrendingUp size={48} color="#bdbdbd" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có chi tiêu hôm nay
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Nhấn nút camera để thêm giao dịch đầu tiên
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconPlus size={18} />}
                onClick={() => setFormOpen(true)}
              >
                Thêm chi tiêu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {todayExpenses.map((expense) => (
              <Grid size={{ xs: 6, sm: 4 }} key={expense.id}>
                <ExpenseCard expense={expense} />
              </Grid>
            ))}
          </Grid>
        )}

        <ExpenseForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      </Layout>
    </ProtectedRoute>
  );
}

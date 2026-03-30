'use client';

import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { IconHistory } from '@tabler/icons-react';
import Layout from '@/components/Layout';
import DailyGroup from '@/components/DailyGroup';
import ExpenseForm from '@/components/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseCategory } from '@/types/expense';

export default function TimelinePage() {
  const [formOpen, setFormOpen] = useState(false);
  const { dailyGroups, addExpense } = useExpenses();

  const handleSubmit = async (data: {
    amount: number;
    category: ExpenseCategory;
    note: string;
    image: string | null;
  }) => {
    await addExpense(data);
    setFormOpen(false);
  };

  return (
    <Layout onCameraClick={() => setFormOpen(true)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconHistory size={24} color="#1976d2" />
        <Typography variant="h6" fontWeight={600}>
          Lịch sử chi tiêu
        </Typography>
      </Box>

      {dailyGroups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <IconHistory size={64} color="#e0e0e0" style={{ marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có dữ liệu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bắt đầu thêm chi tiêu để xem lịch sử
          </Typography>
        </Box>
      ) : (
        <Box>
          {dailyGroups.map((dailyExpense) => (
            <DailyGroup 
              key={dailyExpense.date} 
              dailyExpense={dailyExpense}
            />
          ))}
        </Box>
      )}

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}

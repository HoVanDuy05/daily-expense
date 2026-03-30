'use client';

import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { Expense, CATEGORY_MAP, CategoryInfo } from '@/types/expense';
import { calculateCategoryTotals, formatCurrency } from '@/lib/utils';

interface CategoryChartProps {
  expenses: Expense[];
}

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const theme = useTheme();
  
  const categoryTotals = calculateCategoryTotals(expenses);
  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  const data = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: CATEGORY_MAP[category as keyof typeof CATEGORY_MAP].label,
      value: amount,
      color: CATEGORY_MAP[category as keyof typeof CATEGORY_MAP].color,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : '0',
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Card sx={{ p: 1, boxShadow: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(item.value)} ({item.percentage}%)
          </Typography>
        </Card>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Chưa có dữ liệu chi tiêu
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Chi tiêu theo danh mục
        </Typography>
        
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => (
                  <span style={{ color: entry.color, fontSize: '0.875rem' }}>
                    {value} ({entry.payload.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Tổng chi tiêu: <strong>{formatCurrency(total)}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { Expense } from '@/types/expense';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, formatISO, isSameMonth, subMonths, addMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

type ViewMode = 'week' | 'month';

interface TrendChartProps {
  expenses: Expense[];
}

export default function TrendChart({ expenses }: TrendChartProps) {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const data = useMemo(() => {
    const now = new Date();
    
    if (viewMode === 'week') {
      const weekStart = startOfWeek(now, { locale: vi });
      const weekEnd = endOfWeek(now, { locale: vi });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      return days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayExpenses = expenses.filter(e => 
          format(parseISO(e.created_at), 'yyyy-MM-dd') === dayStr
        );
        const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        return {
          label: format(day, 'EEE', { locale: vi }),
          fullDate: format(day, 'dd/MM'),
          value: total,
          count: dayExpenses.length,
        };
      });
    } else {
      // Monthly view - last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthExpenses = expenses.filter(e => 
          isSameMonth(parseISO(e.created_at), monthDate)
        );
        const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        months.push({
          label: format(monthDate, 'MM/yyyy'),
          fullDate: format(monthDate, 'MMMM yyyy', { locale: vi }),
          value: total,
          count: monthExpenses.length,
        });
      }
      return months;
    }
  }, [expenses, viewMode]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = total / (data.length || 1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Card sx={{ p: 1, boxShadow: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            {item.fullDate}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600}>
            {formatCurrency(item.value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.count} giao dịch
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Xu hướng chi tiêu
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="week">Tuần</ToggleButton>
            <ToggleButton value="month">Tháng</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ height: 250, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
              <Bar 
                dataKey="value" 
                fill={theme.palette.primary.main}
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Stats */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-around' }}>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">Tổng</Typography>
            <Typography variant="body2" fontWeight={700}>{formatCurrency(total)}</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">Trung bình</Typography>
            <Typography variant="body2" fontWeight={700}>{formatCurrency(average)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

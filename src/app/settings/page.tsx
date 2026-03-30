'use client';

import { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  IconSettings,
  IconWallet,
  IconBell,
  IconDownload,
  IconTrash,
  IconInfoCircle,
  IconChevronRight,
  IconCurrencyDollar
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import { useExpenses } from '@/hooks/useExpenses';

export default function SettingsPage() {
  const { expenses, deleteExpense, refresh } = useExpenses();
  const [dailyBudget, setDailyBudget] = useState(300000);
  const [notifications, setNotifications] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleExport = () => {
    const data = {
      expenses,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-expense-backup-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: 'Đã xuất dữ liệu thành công!' });
  };

  const handleClearAll = () => {
    localStorage.removeItem('daily-expense-data');
    refresh();
    setClearDialogOpen(false);
    setSnackbar({ open: true, message: 'Đã xóa tất cả dữ liệu!' });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const settingItems = [
    {
      icon: <IconCurrencyDollar size={22} />,
      title: 'Ngân sách hàng ngày',
      subtitle: `${dailyBudget.toLocaleString('vi-VN')}đ`,
      action: 'input',
    },
    {
      icon: <IconBell size={22} />,
      title: 'Thông báo',
      subtitle: 'Nhắc nhở ghi chi tiêu',
      action: 'toggle',
      value: notifications,
      onChange: () => setNotifications(!notifications),
    },
    {
      icon: <IconDownload size={22} />,
      title: 'Xuất dữ liệu',
      subtitle: 'Tải về file backup JSON',
      action: 'button',
      onClick: handleExport,
    },
    {
      icon: <IconTrash size={22} color="#f44336" />,
      title: 'Xóa tất cả dữ liệu',
      subtitle: 'Thao tác này không thể hoàn tác',
      action: 'button',
      danger: true,
      onClick: () => setClearDialogOpen(true),
    },
  ];

  return (
    <Layout>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconSettings size={24} color="#1976d2" />
        <Typography variant="h6" fontWeight={600}>
          Cài đặt
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <List>
          {settingItems.map((item, index) => (
            <Box key={item.title}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                {item.action === 'toggle' && (
                  <Switch
                    edge="end"
                    checked={item.value}
                    onChange={item.onChange}
                  />
                )}
                {item.action === 'button' && (
                  <Button
                    size="small"
                    variant={item.danger ? 'outlined' : 'text'}
                    color={item.danger ? 'error' : 'primary'}
                    onClick={item.onClick}
                  >
                    {item.danger ? 'Xóa' : 'Xuất'}
                  </Button>
                )}
              </ListItem>
            </Box>
          ))}
        </List>
      </Card>

      {/* Budget Input Card */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconWallet size={20} color="#1976d2" />
            <Typography variant="subtitle1" fontWeight={600}>
              Điều chỉnh ngân sách
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            label="Ngân sách hàng ngày (VND)"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Ngân sách này sẽ được dùng để tính toán mức độ chi tiêu trong ngày
          </Typography>
        </CardContent>
      </Card>

      {/* About */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          <IconInfoCircle size={32} color="#9e9e9e" style={{ marginBottom: 8 }} />
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Daily Expense
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phiên bản 1.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Ứng dụng quản lý chi tiêu kết hợp chụp ảnh
          </Typography>
        </CardContent>
      </Card>

      {/* Clear Data Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa dữ liệu</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa tất cả dữ liệu? Thao tác này không thể hoàn tác.
          </Alert>
          <Typography variant="body2">
            Số giao dịch sẽ bị xóa: <strong>{expenses.length}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Xóa tất cả
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Layout>
  );
}

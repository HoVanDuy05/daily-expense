'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Switch,
  Chip,
  Badge,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  IconSettings,
  IconBell,
  IconMoon,
  IconLanguage,
  IconShield,
  IconHelpCircle,
  IconInfoCircle,
  IconChevronRight,
  IconEdit,
  IconCamera,
  IconLogout,
  IconWallet,
  IconUsers,
  IconReceipt,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useExpenses } from '@/hooks/useExpenses';
import { useFriends } from '@/hooks/useFriends';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { expenses } = useExpenses();
  const { friends } = useFriends();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expenseCount = expenses.length;
  const friendCount = friends.length;

  const menuItems = [
    { icon: <IconBell size={22} />, title: 'Thông báo', subtitle: 'Bật', action: 'toggle', value: notifications, onChange: () => setNotifications(!notifications) },
    { icon: <IconMoon size={22} />, title: 'Chế độ tối', subtitle: 'Tắt', action: 'toggle', value: darkMode, onChange: () => setDarkMode(!darkMode) },
    { icon: <IconLanguage size={22} />, title: 'Ngôn ngữ', subtitle: 'Tiếng Việt', action: 'navigate' },
    { icon: <IconShield size={22} />, title: 'Bảo mật', subtitle: null, action: 'navigate' },
    { icon: <IconHelpCircle size={22} />, title: 'Trợ giúp & Hỗ trợ', subtitle: null, action: 'navigate' },
    { icon: <IconInfoCircle size={22} />, title: 'Về ứng dụng', subtitle: 'v1.0.0', action: 'navigate' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <Layout title="Trang cá nhân">
        <Box sx={{ px: 2, py: 2 }}>
          {/* Profile Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <IconCamera size={16} />
                  </IconButton>
                }
              >
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </Badge>
            </Box>

            <Typography variant="h6" fontWeight={700} gutterBottom>
              {user?.name || 'Người dùng'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email || 'email@example.com'}
            </Typography>

            <Chip
              label="Premium"
              color="primary"
              size="small"
              sx={{
                mt: 1,
                bgcolor: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />

            <IconButton
              onClick={() => setEditDialogOpen(true)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'text.secondary',
              }}
            >
              <IconEdit size={20} />
            </IconButton>
          </Paper>

          {/* Stats */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                <IconWallet size={24} />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {expenseCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Chi tiêu
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'success.light',
                  color: 'success.main',
                  mb: 1,
                }}
              >
                <IconUsers size={24} />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {friendCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Bạn bè
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'warning.light',
                  color: 'warning.main',
                  mb: 1,
                }}
              >
                <IconReceipt size={24} />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color="warning.main">
                {totalExpenses.toLocaleString('vi-VN')}đ
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tổng chi
              </Typography>
            </Box>
          </Paper>

          {/* Menu Items */}
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <ListItem
                  key={item.title}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: index < menuItems.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    cursor: item.action === 'navigate' ? 'pointer' : 'default',
                  }}
                  onClick={item.action === 'navigate' ? () => {} : undefined}
                >
                  <ListItemIcon sx={{ minWidth: 44, color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.subtitle}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  {item.action === 'toggle' ? (
                    <Switch
                      size="small"
                      checked={item.value}
                      onChange={item.onChange}
                    />
                  ) : (
                    <IconChevronRight size={20} color="#bdbdbd" />
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Logout Button */}
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<IconLogout size={20} />}
            onClick={handleLogout}
            sx={{
              py: 1.5,
              borderRadius: 3,
              borderColor: 'error.light',
              '&:hover': {
                bgcolor: 'error.light',
                borderColor: 'error.main',
              },
            }}
          >
            Đăng xuất
          </Button>
        </Box>

        {/* Edit Profile Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên"
              defaultValue={user?.name}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              defaultValue={user?.email}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              placeholder="Nhập số điện thoại..."
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button variant="contained" sx={{ borderRadius: 2, px: 3 }}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}

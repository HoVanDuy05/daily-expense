'use client';

import { ReactNode, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, SvgIcon, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import {
  IconSettings,
  IconUser,
  IconMessageCircle,
  IconLogout,
  IconChevronDown,
  IconMessage,
  IconUsers
} from '@tabler/icons-react';
import BottomNav from './BottomNav';

// Logo icon component
const LogoIcon = () => (
  <SvgIcon viewBox="0 0 192 192" sx={{ width: 32, height: 32 }}>
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f97316' }} />
        <stop offset="50%" style={{ stopColor: '#fb923c' }} />
        <stop offset="100%" style={{ stopColor: '#f43f5e' }} />
      </linearGradient>
    </defs>
    <rect width="192" height="192" rx="44" fill="url(#logoGrad)" />
    <rect x="48" y="40" width="96" height="72" rx="12" fill="white" />
    <rect x="80" y="28" width="32" height="16" rx="4" fill="white" />
    <circle cx="96" cy="76" r="24" fill="#f97316" />
    <circle cx="96" cy="76" r="18" fill="white" />
    <circle cx="96" cy="76" r="12" fill="#fb923c" />
    <circle cx="96" cy="76" r="6" fill="white" />
    <rect x="128" y="48" width="12" height="8" rx="2" fill="#fbbf24" />
    <text x="96" y="148" fill="white" fontSize="28" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle">DAILY</text>
    <text x="96" y="168" fill="rgba(255,255,255,0.9)" fontSize="14" fontFamily="Arial, sans-serif" textAnchor="middle" letterSpacing="2">EXPENSE</text>
  </SvgIcon>
);

interface LayoutProps {
  children: ReactNode;
  onCameraClick?: () => void;
  title?: string;
}

export default function Layout({
  children,
  onCameraClick,
  title = 'Daily Expense'
}: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    handleMenuClose();
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        // Handle logout logic here
        console.log('Logout clicked');
        break;
    }
  };

  const handleChatList = () => {
    router.push('/messages');
  };

  // Don't show header on chat pages
  const isChatPage = pathname.startsWith('/chat/');

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isChatPage && (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
          <Toolbar sx={{ gap: 1.5 }}>
            <LogoIcon />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1, mt: 0.25 }}>
                Quản lý chi tiêu
              </Typography>
            </Box>

            {/* Chat List Icon */}
            <IconButton
              onClick={handleChatList}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <IconMessage size={24} />
            </IconButton>

            {/* User Group Dropdown */}
            <IconButton
              onClick={handleMenuClick}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <IconUsers size={24} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleMenuAction('profile')}>
                <ListItemIcon>
                  <IconUser size={20} />
                </ListItemIcon>
                <ListItemText>Trang cá nhân</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('settings')}>
                <ListItemIcon>
                  <IconSettings size={20} />
                </ListItemIcon>
                <ListItemText>Cài đặt</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction('logout')}>
                <ListItemIcon>
                  <IconLogout size={20} />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ p: 2, pt: isChatPage ? 2 : 3 }}>
        {children}
      </Box>

      <BottomNav onCameraClick={onCameraClick} />
    </Box>
  );
}

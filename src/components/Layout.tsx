'use client';

import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, SvgIcon, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { IconSettings } from '@tabler/icons-react';
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

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
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
          <IconButton
            onClick={() => router.push('/settings')}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <IconSettings size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, pt: 3 }}>
        {children}
      </Box>

      <BottomNav onCameraClick={onCameraClick} />
    </Box>
  );
}

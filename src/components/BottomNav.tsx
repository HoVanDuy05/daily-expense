'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BottomNavigation, BottomNavigationAction, Paper, Fab, Box } from '@mui/material';
import {
  IconHome,
  IconChartBar,
  IconCalendar,
  IconCamera,
  IconUsers,
} from '@tabler/icons-react';

interface BottomNavProps {
  onCameraClick?: () => void;
}

export default function BottomNav({ onCameraClick }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getValue = () => {
    if (pathname === '/' || pathname.startsWith('/home')) return 0;
    if (pathname.startsWith('/timeline')) return 1;
    if (pathname.startsWith('/friends')) return 3;
    if (pathname.startsWith('/summary')) return 4;
    return 0;
  };

  const [value, setValue] = useState(getValue());

  useEffect(() => {
    setValue(getValue());
  }, [pathname]);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '24px 24px 0 0',
        overflow: 'visible',
        bgcolor: 'background.paper',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        showLabels
        sx={{
          height: 70,
          px: 2,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
            flex: 1,
            color: 'text.secondary',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            mt: 0.5,
          },
          '& .Mui-selected': {
            color: 'primary.main',
            '& svg': {
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '20px',
              p: 1,
              width: 40,
              height: 40,
            },
          },
        }}
      >
        <Link href="/" passHref legacyBehavior>
          <BottomNavigationAction
            label="Trang chủ"
            icon={<IconHome size={22} />}
            component="a"
          />
        </Link>
        <Link href="/timeline" passHref legacyBehavior>
          <BottomNavigationAction
            label="Lịch sử"
            icon={<IconCalendar size={22} />}
            component="a"
          />
        </Link>

        {/* Camera Button in center */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: -20 }}>
          <Fab
            color="primary"
            aria-label="add expense"
            onClick={onCameraClick}
            size="medium"
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
              boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
              },
            }}
          >
            <IconCamera size={24} color="white" />
          </Fab>
        </Box>

        <Link href="/friends" passHref legacyBehavior>
          <BottomNavigationAction
            label="Bạn bè"
            icon={<IconUsers size={22} />}
            component="a"
          />
        </Link>
        <Link href="/summary" passHref legacyBehavior>
          <BottomNavigationAction
            label="Thống kê"
            icon={<IconChartBar size={22} />}
            component="a"
          />
        </Link>
      </BottomNavigation>
    </Paper>
  );
}

'use client';

import { Box, Typography, Avatar, IconButton, Badge } from '@mui/material';
import { IconMessageCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface ConversationItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export default function ConversationItem({
  id,
  name,
  avatar,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isOnline = true,
}: ConversationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat/${id}`);
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'grey.50' },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Avatar with online badge - Zalo style */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        invisible={!isOnline}
        sx={{
          '& .MuiBadge-badge': {
            bgcolor: '#00c853',
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid white',
          },
        }}
      >
        <Avatar
          src={avatar}
          sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
        >
          {name.charAt(0)}
        </Avatar>
      </Badge>

      {/* Content - Zalo style */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={unreadCount > 0 ? 700 : 600}
            noWrap
            sx={{ color: 'text.primary', fontSize: '0.95rem' }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: unreadCount > 0 ? 'primary.main' : 'text.secondary',
              fontSize: '0.7rem',
              flexShrink: 0,
              ml: 1,
            }}
          >
            {formatTime(lastMessageTime)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: unreadCount > 0 ? 'text.primary' : 'text.secondary',
              fontSize: '0.85rem',
              fontWeight: unreadCount > 0 ? 500 : 400,
              flex: 1,
            }}
          >
            {lastMessage}
          </Typography>

          {unreadCount > 0 && (
            <Box
              sx={{
                minWidth: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ml: 1,
                px: 0.5,
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

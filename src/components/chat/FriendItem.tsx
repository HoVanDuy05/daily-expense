'use client';

import { Box, Typography, Avatar, IconButton, Badge, Button } from '@mui/material';
import { IconMessageCircle, IconCheck, IconX, IconUserPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface FriendRequest {
  id: string;
  from_user_name: string;
  from_user_avatar?: string;
}

interface FriendItemProps {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  onChatClick?: (id: string) => void;
}

export function FriendItem({
  id,
  name,
  avatar,
  isOnline = true,
  onChatClick,
}: FriendItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onChatClick) {
      onChatClick(id);
    } else {
      router.push(`/chat/${id}`);
    }
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
      {/* Avatar with online badge */}
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

      {/* Name */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
          {name}
        </Typography>
        <Typography variant="caption" color="success.main" sx={{ fontSize: '0.75rem' }}>
          Đang hoạt động
        </Typography>
      </Box>

      {/* Chat button */}
      <IconButton
        size="small"
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.main',
          width: 36,
          height: 36,
          '&:hover': { bgcolor: 'primary.main', color: 'white' },
        }}
      >
        <IconMessageCircle size={18} />
      </IconButton>
    </Box>
  );
}

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function FriendRequestItem({ request, onAccept, onReject }: FriendRequestItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Avatar
        src={request.from_user_avatar}
        sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
      >
        {request.from_user_name.charAt(0)}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
          {request.from_user_name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Muốn kết bạn với bạn
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => onAccept(request.id)}
          sx={{
            minWidth: 0,
            width: 32,
            height: 32,
            p: 0,
            borderRadius: 1,
          }}
        >
          <IconCheck size={16} />
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={() => onReject(request.id)}
          sx={{
            minWidth: 0,
            width: 32,
            height: 32,
            p: 0,
            borderRadius: 1,
          }}
        >
          <IconX size={16} />
        </Button>
      </Box>
    </Box>
  );
}

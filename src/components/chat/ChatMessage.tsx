'use client';

import { Box, Typography, Avatar, Paper } from '@mui/material';
import { Message } from '@/types/expense';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  friendName: string;
  friendAvatar?: string;
}

export default function ChatMessage({
  message,
  isMe,
  showAvatar,
  friendName,
  friendAvatar,
}: ChatMessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 0.8,
        mb: 0.3,
      }}
    >
      {/* Avatar - Zalo style: only show avatar for friend, first message in group */}
      {!isMe && (
        <Avatar
          src={friendAvatar}
          sx={{
            width: 28,
            height: 28,
            bgcolor: 'primary.main',
            fontSize: '0.75rem',
            visibility: showAvatar ? 'visible' : 'hidden',
            flexShrink: 0,
          }}
        >
          {friendName.charAt(0)}
        </Avatar>
      )}

      {/* Message bubble - Zalo style */}
      <Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            px: 2,
            bgcolor: isMe ? 'primary.main' : 'white',
            color: isMe ? 'white' : 'text.primary',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: '0.9rem' }}>
            {message.content}
          </Typography>
        </Paper>

        {/* Time - Zalo style: small, below message */}
        <Typography
          variant="caption"
          sx={{
            mt: 0.3,
            color: 'grey.400',
            fontSize: '0.65rem',
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            px: 0.3,
          }}
        >
          {new Date(message.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
    </Box>
  );
}

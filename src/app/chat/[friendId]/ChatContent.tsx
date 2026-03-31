'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import { IconArrowLeft, IconSend, IconPhone, IconVideo, IconInfoCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/hooks/useFriends';

export default function ChatContent() {
  const router = useRouter();
  const params = useParams();
  const friendId = params.friendId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const { friends, getMessagesWithFriend, sendMessage, markMessagesAsRead } = useFriends();

  const friend = friends.find((f) => f.friend_id === friendId);
  const messages = getMessagesWithFriend(friendId);

  // Mark messages as read when opening chat
  useEffect(() => {
    markMessagesAsRead(friendId);
  }, [friendId, markMessagesAsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(friendId, messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!friend) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Không tìm thấy bạn bè</Typography>
          <Button variant="contained" onClick={() => router.push('/messages')} sx={{ mt: 2, borderRadius: 2 }}>
            Quay lại
          </Button>
        </Paper>
      </Box>
    );
  }

  // Group messages by date for date separators
  const getDateString = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hôm nay';
    if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f0f5ff' }}>
      {/* Header - Zalo style */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ px: 2, minHeight: 56 }}>
          <IconButton
            edge="start"
            onClick={() => router.push('/messages')}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <IconArrowLeft size={24} />
          </IconButton>

          <Avatar
            src={friend.friend_avatar}
            sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 1.5 }}
          >
            {friend.friend_name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
              {friend.friend_name}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00c853' }} />
              Đang hoạt động
            </Typography>
          </Box>

          <IconButton sx={{ color: 'primary.main' }}>
            <IconPhone size={20} />
          </IconButton>
          <IconButton sx={{ color: 'primary.main' }}>
            <IconVideo size={20} />
          </IconButton>
          <IconButton sx={{ color: 'text.secondary' }}>
            <IconInfoCircle size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages - Zalo style */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tin nhắn. Hãy gửi lời chào!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {messages.map((message, index) => {
              const isMe = message.sender_id !== friendId;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const isFirstInGroup = !prevMessage || prevMessage.sender_id !== message.sender_id;
              const isDifferentDate = prevMessage &&
                new Date(prevMessage.created_at).toDateString() !== new Date(message.created_at).toDateString();

              return (
                <Box key={message.id}>
                  {/* Date separator */}
                  {(!prevMessage || isDifferentDate) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.06)',
                          color: 'text.secondary',
                          px: 2,
                          py: 0.5,
                          borderRadius: 10,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                        }}
                      >
                        {getDateString(new Date(message.created_at))}
                      </Typography>
                    </Box>
                  )}

                  <ChatMessage
                    message={message}
                    isMe={isMe}
                    showAvatar={isFirstInGroup && !isMe}
                    friendName={friend.friend_name}
                    friendAvatar={friend.friend_avatar}
                  />
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input - Zalo style */}
      <Paper
        elevation={2}
        sx={{
          p: 1,
          px: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
        }}
      >
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'grey.100',
              px: 2,
              py: 0.8,
              '& fieldset': { border: 'none' },
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{
            width: 40,
            height: 40,
            bgcolor: messageText.trim() ? 'primary.main' : 'transparent',
            color: messageText.trim() ? 'white' : 'grey.400',
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: messageText.trim() ? 'primary.dark' : 'transparent',
            },
          }}
        >
          <IconSend size={20} />
        </IconButton>
      </Paper>
    </Box>
  );
}

function ChatMessage({
  message,
  isMe,
  showAvatar,
  friendName,
  friendAvatar,
}: {
  message: any;
  isMe: boolean;
  showAvatar: boolean;
  friendName: string;
  friendAvatar?: string;
}) {
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
            p: 1.2,
            px: 1.5,
            bgcolor: isMe ? 'primary.main' : 'white',
            color: isMe ? 'white' : 'text.primary',
            borderRadius: 2,
            borderBottomLeftRadius: isMe ? 2 : 0.5,
            borderBottomRightRadius: isMe ? 0.5 : 2,
            boxShadow: '0 0.5px 2px rgba(0,0,0,0.1)',
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

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
import { IconArrowLeft, IconSend, IconPhone, IconVideo } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/hooks/useFriends';
import { Message } from '@/types/expense';

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
          <Button variant="contained" onClick={() => router.push('/friends')} sx={{ mt: 2, borderRadius: 2 }}>
            Quay lại
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ px: 2, minHeight: 64 }}>
          <IconButton
            edge="start"
            onClick={() => router.push('/friends')}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <IconArrowLeft size={24} />
          </IconButton>

          <Avatar
            src={friend.friend_avatar}
            sx={{ width: 44, height: 44, bgcolor: 'primary.main', mr: 2 }}
          >
            {friend.friend_name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} lineHeight={1.3}>
              {friend.friend_name}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
              Đang hoạt động
            </Typography>
          </Box>

          <IconButton sx={{ color: 'primary.main' }}>
            <IconPhone size={22} />
          </IconButton>
          <IconButton sx={{ color: 'primary.main' }}>
            <IconVideo size={22} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pb: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Paper
              elevation={0}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <IconSend size={40} color="#bdbdbd" />
            </Paper>
            <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={500}>
              Chưa có tin nhắn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy bắt đầu cuộc trò chuyện với {friend.friend_name}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMe={message.sender_id !== friendId}
                showAvatar={index === 0 || messages[index - 1].sender_id !== message.sender_id}
                friendName={friend.friend_name}
              />
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input */}
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
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
              bgcolor: 'grey.50',
              px: 2,
              py: 1,
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{
            width: 44,
            height: 44,
            bgcolor: messageText.trim() ? 'primary.main' : 'grey.300',
            color: 'white',
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: messageText.trim() ? 'primary.dark' : 'grey.300',
            },
          }}
        >
          <IconSend size={20} />
        </IconButton>
      </Paper>
    </Box>
  );
}

function ChatMessage({ message, isMe, showAvatar, friendName }: { message: Message; isMe: boolean; showAvatar: boolean; friendName: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 1,
        mb: 0.5,
      }}
    >
      {/* Avatar for received messages */}
      {!isMe && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            fontSize: '0.875rem',
            visibility: showAvatar ? 'visible' : 'hidden',
            flexShrink: 0,
          }}
        >
          {friendName.charAt(0)}
        </Avatar>
      )}

      {/* Message bubble */}
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            px: 2,
            bgcolor: isMe ? 'primary.main' : 'white',
            color: isMe ? 'white' : 'text.primary',
            borderRadius: 3,
            borderBottomLeftRadius: isMe ? 3 : 0.5,
            borderBottomRightRadius: isMe ? 0.5 : 3,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '0.95rem' }}>
            {message.content}
          </Typography>
        </Paper>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: isMe ? 'grey.500' : 'grey.400',
            fontSize: '0.7rem',
            textAlign: isMe ? 'right' : 'left',
            px: 0.5,
          }}
        >
          {new Date(message.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>

      {/* Spacer for sent messages */}
      {isMe && <Box sx={{ width: 32, flexShrink: 0 }} />}
    </Box>
  );
}

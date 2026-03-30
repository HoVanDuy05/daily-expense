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
  List,
  ListItem,
} from '@mui/material';
import { IconArrowLeft, IconSend } from '@tabler/icons-react';
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
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Không tìm thấy bạn bè</Typography>
        <Button variant="contained" onClick={() => router.push('/friends')} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
        }}
      >
        <IconButton onClick={() => router.push('/friends')}>
          <IconArrowLeft size={24} />
        </IconButton>
        <Avatar src={friend.friend_avatar} sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          {friend.friend_name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {friend.friend_name}
          </Typography>
          <Typography variant="caption" color="success.main">
            Đang hoạt động
          </Typography>
        </Box>
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <IconArrowLeft size={32} color="#9e9e9e" />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có tin nhắn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy bắt đầu cuộc trò chuyện với {friend.friend_name}
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMe={message.sender_id !== friendId}
                showAvatar={index === 0 || messages[index - 1].sender_id !== message.sender_id}
              />
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
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
          maxRows={3}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{
            minWidth: 48,
            px: 0,
            borderRadius: '50%',
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
            },
          }}
        >
          <IconSend size={20} />
        </Button>
      </Paper>
    </Box>
  );
}

function ChatMessage({ message, isMe, showAvatar }: { message: Message; isMe: boolean; showAvatar: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        mb: 1,
        alignItems: 'flex-end',
        gap: 0.5,
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
          }}
        >
          {message.sender_id?.charAt(message.sender_id.length - 1) || '?'}
        </Avatar>
      )}

      {/* Message bubble */}
      <Paper
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isMe ? 'primary.main' : 'white',
          color: isMe ? 'white' : 'text.primary',
          borderRadius: 3,
          borderTopLeftRadius: isMe ? 3 : 1,
          borderTopRightRadius: isMe ? 1 : 3,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            fontSize: '0.75rem',
            textAlign: isMe ? 'right' : 'left',
          }}
        >
          {new Date(message.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Paper>

      {/* Avatar for sent messages (hidden) */}
      {isMe && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            visibility: 'hidden',
          }}
        />
      )}
    </Box>
  );
}

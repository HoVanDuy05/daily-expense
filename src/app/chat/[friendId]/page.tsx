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

export default function ChatPage() {
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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
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
        }}
      >
        <IconButton onClick={() => router.push('/friends')}>
          <IconArrowLeft size={24} />
        </IconButton>
        <Avatar src={friend.friend_avatar} sx={{ bgcolor: 'primary.main' }}>
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
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} isMe={message.sender_id !== friendId} />
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Input */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
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
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{ minWidth: 48, px: 0 }}
        >
          <IconSend size={20} />
        </Button>
      </Paper>
    </Box>
  );
}

function ChatMessage({ message, isMe }: { message: Message; isMe: boolean }) {
  return (
    <ListItem
      sx={{
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        mb: 1,
        px: 0,
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          maxWidth: '70%',
          bgcolor: isMe ? 'primary.main' : 'background.paper',
          color: isMe ? 'white' : 'text.primary',
          borderRadius: 2,
          borderTopLeftRadius: isMe ? 2 : 0,
          borderTopRightRadius: isMe ? 0 : 2,
        }}
      >
        <Typography variant="body2">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            textAlign: 'right',
          }}
        >
          {new Date(message.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Paper>
    </ListItem>
  );
}

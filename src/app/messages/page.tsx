'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  Fab,
} from '@mui/material';
import {
  IconUserPlus,
  IconSearch,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/hooks/useFriends';
import ConversationItem from '@/components/chat/ConversationItem';

export default function MessagesPage() {
  const router = useRouter();
  const { friends } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data - in real app should come from API
  const conversations = friends.map(friend => ({
    id: friend.friend_id,
    name: friend.friend_name,
    avatar: friend.friend_avatar,
    lastMessage: 'Hãy bắt đầu cuộc trò chuyện...',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    isOnline: true,
  }));

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoToFriends = () => {
    router.push('/friends');
  };

  return (
    <ProtectedRoute>
      <Layout title="Tin nhắn">
        <Box sx={{ px: 2, py: 2 }}>
          {/* Search - Zalo style */}
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} color="#9e9e9e" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& fieldset': { border: 'none' },
              },
            }}
          />

          {/* Conversations List - Zalo style flat list */}
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'transparent' }}>
            {filteredConversations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Chưa có tin nhắn
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Thêm bạn bè để bắt đầu trò chuyện
                </Typography>
              </Box>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  id={conv.id}
                  name={conv.name}
                  avatar={conv.avatar}
                  lastMessage={conv.lastMessage}
                  lastMessageTime={conv.lastMessageTime}
                  unreadCount={conv.unreadCount}
                  isOnline={conv.isOnline}
                />
              ))
            )}
          </Paper>
        </Box>

        {/* FAB to go to friends */}
        <Fab
          color="primary"
          onClick={handleGoToFriends}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
          }}
        >
          <IconUserPlus size={24} />
        </Fab>
      </Layout>
    </ProtectedRoute>
  );
}

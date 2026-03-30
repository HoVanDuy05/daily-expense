'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Paper,
  Badge,
  InputAdornment,
  TextField,
  Fab,
} from '@mui/material';
import {
  IconMessageCircle,
  IconUserPlus,
  IconSearch,
  IconUser,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/hooks/useFriends';

export default function MessagesPage() {
  const router = useRouter();
  const { friends, getMessagesWithFriend } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data - in real app should come from API
  const conversations = friends.map(friend => ({
    id: friend.friend_id,
    name: friend.friend_name,
    avatar: friend.friend_avatar,
    lastMessage: 'Hãy bắt đầu cuộc trò chuyện...',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  }));

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (friendId: string) => {
    router.push(`/chat/${friendId}`);
  };

  const handleGoToFriends = () => {
    router.push('/friends');
  };

  return (
    <ProtectedRoute>
      <Layout title="Tin nhắn">
        <Box sx={{ px: 2, py: 2 }}>
          {/* Search */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm tin nhắn..."
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: 'grey.50',
                },
              }}
            />
          </Paper>

          {/* Conversations List */}
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {filteredConversations.length === 0 ? (
                <ListItem sx={{ py: 6, textAlign: 'center', display: 'block' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <IconMessageCircle size={36} color="#bdbdbd" />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={500}>
                    Chưa có tin nhắn
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Bắt đầu trò chuyện với bạn bè của bạn
                  </Typography>
                  <IconButton
                    onClick={handleGoToFriends}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 48,
                      height: 48,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <IconUserPlus size={24} />
                  </IconButton>
                </ListItem>
              ) : (
                filteredConversations.map((conv, index) => (
                  <ListItem
                    key={conv.id}
                    onClick={() => handleChatClick(conv.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.50' },
                      py: 1.5,
                      px: 2,
                      borderBottom: index < filteredConversations.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: '#4caf50',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: '2px solid white',
                          },
                        }}
                      >
                        <Avatar
                          src={conv.avatar}
                          sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                        >
                          {conv.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600} fontSize="0.95rem">
                          {conv.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                          }}
                        >
                          {conv.lastMessage}
                        </Typography>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {new Date(conv.lastMessageTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                      {conv.unreadCount > 0 && (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: 'auto',
                          }}
                        >
                          {conv.unreadCount}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
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
          <IconUser size={24} />
        </Fab>
      </Layout>
    </ProtectedRoute>
  );
}

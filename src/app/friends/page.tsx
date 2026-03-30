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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  IconMessageCircle,
  IconUserPlus,
  IconSearch,
  IconCheck,
  IconX,
  IconUser,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useFriends } from '@/hooks/useFriends';
import { useRouter } from 'next/navigation';

export default function FriendsPage() {
  const router = useRouter();
  const { friends, requests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.friend_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = async () => {
    if (newFriendEmail.trim()) {
      await sendFriendRequest(newFriendEmail, 'Friend');
      setNewFriendEmail('');
      setShowAddDialog(false);
    }
  };

  const handleChatClick = (friendId: string) => {
    router.push(`/chat/${friendId}`);
  };

  return (
    <ProtectedRoute>
      <Layout title="Bạn bè">
        <Box sx={{ px: 2, py: 2 }}>
          {/* Search and Add Friend */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm bạn bè..."
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
            <Button
              variant="contained"
              onClick={() => setShowAddDialog(true)}
              sx={{
                borderRadius: 2.5,
                minWidth: 44,
                height: 44,
                px: 0,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              }}
            >
              <IconUserPlus size={22} />
            </Button>
          </Paper>

          {/* Friend Requests */}
          {requests.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, px: 0.5 }}>
                Lời mời kết bạn
                <Chip
                  label={requests.length}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Typography>
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                  {requests.map((request, index) => (
                    <ListItem
                      key={request.id}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom: index < requests.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={request.from_user_avatar}
                          sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                        >
                          {request.from_user_name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} fontSize="0.95rem">
                            {request.from_user_name}
                          </Typography>
                        }
                        secondary="Muốn kết bạn với bạn"
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => acceptFriendRequest(request.id)}
                          sx={{
                            bgcolor: 'success.main',
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': { bgcolor: 'success.dark' },
                          }}
                        >
                          <IconCheck size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => rejectFriendRequest(request.id)}
                          sx={{
                            bgcolor: 'grey.200',
                            color: 'grey.600',
                            width: 36,
                            height: 36,
                            '&:hover': { bgcolor: 'grey.300' },
                          }}
                        >
                          <IconX size={18} />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {/* Friends List */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, px: 0.5 }}>
              Bạn bè ({filteredFriends.length})
            </Typography>

            <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List sx={{ p: 0 }}>
                {filteredFriends.length === 0 ? (
                  <ListItem sx={{ py: 4, textAlign: 'center', display: 'block' }}>
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
                      <IconUser size={36} color="#bdbdbd" />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={500}>
                      Chưa có bạn bè
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thêm bạn bè để bắt đầu trò chuyện
                    </Typography>
                  </ListItem>
                ) : (
                  filteredFriends.map((friend, index) => (
                    <ListItem
                      key={friend.id}
                      onClick={() => handleChatClick(friend.friend_id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' },
                        py: 1.5,
                        px: 2,
                        borderBottom: index < filteredFriends.length - 1 ? '1px solid' : 'none',
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
                            src={friend.friend_avatar}
                            sx={{ width: 52, height: 52, bgcolor: 'primary.main' }}
                          >
                            {friend.friend_name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} fontSize="0.95rem">
                            {friend.friend_name}
                          </Typography>
                        }
                        secondary="Đang hoạt động"
                        secondaryTypographyProps={{
                          fontSize: '0.85rem',
                          color: 'success.main',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: 40,
                          height: 40,
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <IconMessageCircle size={20} />
                      </IconButton>
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Box>
        </Box>

        {/* Add Friend Dialog */}
        <Dialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>Thêm bạn bè</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
              sx={{ mt: 1 }}
              placeholder="Nhập email bạn bè..."
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setShowAddDialog(false)} sx={{ borderRadius: 2 }}>
              Hủy
            </Button>
            <Button
              onClick={handleAddFriend}
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Gửi lời mời
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}

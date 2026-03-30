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
  Chip,
  Badge,
  Divider,
} from '@mui/material';
import {
  IconMessageCircle,
  IconUserPlus,
  IconSearch,
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
        {/* Search and Add Friend */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm bạn bè..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={18} style={{ marginRight: 8 }} />,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Button
            variant="contained"
            startIcon={<IconUserPlus size={18} />}
            onClick={() => setShowAddDialog(true)}
            sx={{ borderRadius: 2, px: 2 }}
          >
            Thêm
          </Button>
        </Box>

        {/* Friend Requests */}
        {requests.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Lời mời kết bạn ({requests.length})
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              {requests.map((request) => (
                <ListItem key={request.id} divider>
                  <ListItemAvatar>
                    <Avatar src={request.from_user_avatar} sx={{ width: 40, height: 40 }}>
                      {request.from_user_name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.from_user_name}
                    secondary="Muốn kết bạn với bạn"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => acceptFriendRequest(request.id)}
                      sx={{ color: 'success.main' }}
                    >
                      <IconMessageCircle size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => rejectFriendRequest(request.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <IconUserPlus size={18} />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Friends List */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Danh sách bạn bè ({filteredFriends.length})
        </Typography>

        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          {filteredFriends.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Chưa có bạn bè"
                secondary="Thêm bạn bè để bắt đầu trò chuyện"
                primaryTypographyProps={{ textAlign: 'center', color: 'text.secondary' }}
                secondaryTypographyProps={{ textAlign: 'center' }}
              />
            </ListItem>
          ) : (
            filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                onClick={() => handleChatClick(friend.friend_id)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  px: 2,
                  py: 1.5
                }}
                divider
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{ '& .MuiBadge-badge': { bgcolor: 'success.main' } }}
                  >
                    <Avatar src={friend.friend_avatar} sx={{ width: 44, height: 44 }}>
                      {friend.friend_name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={friend.friend_name}
                  secondary="Đang hoạt động"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.8rem',
                    color: 'success.main'
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <IconMessageCircle size={18} />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>

        {/* Add Friend Dialog */}
        <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Thêm bạn bè</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddDialog(false)}>Hủy</Button>
            <Button onClick={handleAddFriend} variant="contained">Gửi lời mời</Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}

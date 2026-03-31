'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  IconUserPlus,
  IconSearch,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useFriends } from '@/hooks/useFriends';
import { useRouter } from 'next/navigation';
import { FriendItem, FriendRequestItem } from '@/components/chat/FriendItem';

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
          {/* Search - Zalo style */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 3,
              bgcolor: 'transparent',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm bạn bè"
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
                  borderRadius: 3,
                  bgcolor: 'grey.100',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Paper>

          {/* Friend Requests - Zalo style */}
          {requests.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                Lời mời kết bạn ({requests.length})
              </Typography>
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
                {requests.map((request) => (
                  <FriendRequestItem
                    key={request.id}
                    request={{
                      id: request.id,
                      from_user_name: request.from_user_name,
                      from_user_avatar: request.from_user_avatar,
                    }}
                    onAccept={acceptFriendRequest}
                    onReject={rejectFriendRequest}
                  />
                ))}
              </Paper>
            </Box>
          )}

          {/* Friends List - Zalo style */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
              Bạn bè ({filteredFriends.length})
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
              {filteredFriends.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Chưa có bạn bè
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Thêm bạn bè để kết nối
                  </Typography>
                </Box>
              ) : (
                filteredFriends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    id={friend.friend_id}
                    name={friend.friend_name}
                    avatar={friend.friend_avatar}
                    isOnline={true}
                    onChatClick={handleChatClick}
                  />
                ))
              )}
            </Paper>
          </Box>
        </Box>

        {/* FAB to add friend */}
        <Button
          variant="contained"
          onClick={() => setShowAddDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: '50%',
            minWidth: 0,
            p: 0,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
          }}
        >
          <IconUserPlus size={24} />
        </Button>

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

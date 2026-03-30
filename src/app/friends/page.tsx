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
  Tabs,
  Tab,
  Chip,
  Badge,
} from '@mui/material';
import {
  IconMessageCircle,
  IconUserPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconUserX,
} from '@tabler/icons-react';
import Layout from '@/components/Layout';
import { useFriends } from '@/hooks/useFriends';
import { Friend, FriendRequest } from '@/types/expense';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function FriendsPage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [friendId, setFriendId] = useState('');
  const [friendName, setFriendName] = useState('');

  const {
    friends,
    requests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getConversations,
  } = useFriends();

  const conversations = getConversations();

  const handleAddFriend = () => {
    if (friendId && friendName) {
      sendFriendRequest(friendId, friendName);
      setFriendId('');
      setFriendName('');
      setOpenAddDialog(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>
          Bạn bè
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconUserPlus size={20} />}
          onClick={() => setOpenAddDialog(true)}
          size="small"
        >
          Thêm bạn
        </Button>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label={`Bạn bè (${friends.length})`} />
        <Tab
          label={
            <Badge badgeContent={requests.length} color="error">
              Lời mời
            </Badge>
          }
        />
        <Tab label="Chat" />
      </Tabs>

      {/* Friends List */}
      <TabPanel value={tabValue} index={0}>
        {friends.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Chưa có bạn bè</Typography>
            <Button
              variant="outlined"
              startIcon={<IconUserPlus size={20} />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ mt: 2 }}
            >
              Thêm bạn ngay
            </Button>
          </Box>
        ) : (
          <List>
            {friends.map((friend) => (
              <ListItem
                key={friend.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/chat/${friend.friend_id}`)}
                    >
                      <IconMessageCircle size={20} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => removeFriend(friend.friend_id)}
                    >
                      <IconUserX size={20} />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={friend.friend_avatar} sx={{ bgcolor: 'primary.main' }}>
                    {friend.friend_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={friend.friend_name}
                  secondary="Đã là bạn bè"
                />
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Friend Requests */}
      <TabPanel value={tabValue} index={1}>
        {requests.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Không có lời mời kết bạn</Typography>
          </Box>
        ) : (
          <List>
            {requests.map((request) => (
              <ListItem
                key={request.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="success"
                      onClick={() => acceptFriendRequest(request.id)}
                    >
                      <IconCheck size={20} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => rejectFriendRequest(request.id)}
                    >
                      <IconX size={20} />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={request.from_user_avatar} sx={{ bgcolor: 'secondary.main' }}>
                    {request.from_user_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={request.from_user_name}
                  secondary="Muốn kết bạn với bạn"
                />
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Chat List */}
      <TabPanel value={tabValue} index={2}>
        {conversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Chưa có cuộc trò chuyện</Typography>
          </Box>
        ) : (
          <List>
            {conversations.map((conv) => (
              <ListItem
                key={conv.friend_id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/chat/${conv.friend_id}`)}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={conv.unread_count}
                    color="error"
                    invisible={conv.unread_count === 0}
                  >
                    <Avatar src={conv.friend_avatar} sx={{ bgcolor: 'primary.main' }}>
                      {conv.friend_name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={conv.friend_name}
                  secondary={conv.last_message?.content || 'Bắt đầu trò chuyện...'}
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontWeight: conv.unread_count > 0 ? 600 : 400,
                  }}
                />
                {conv.unread_count > 0 && (
                  <Chip
                    label={conv.unread_count}
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Add Friend Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth>
        <DialogTitle>Thêm bạn mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ID bạn bè"
            placeholder="Nhập ID người dùng"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tên bạn bè"
            placeholder="Nhập tên người dùng"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddFriend} disabled={!friendId || !friendName}>
            Gửi lời mời
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

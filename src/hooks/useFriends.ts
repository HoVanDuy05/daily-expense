'use client';

import { useState, useEffect, useCallback } from 'react';
import { Friend, FriendRequest, Message, ChatConversation } from '@/types/expense';

const CURRENT_USER_ID = 'user_001'; // Mock current user

// Mock data for friends
const MOCK_FRIENDS: Friend[] = [
  {
    id: 'friend_001',
    user_id: CURRENT_USER_ID,
    friend_id: 'user_002',
    friend_name: 'Nguyễn Văn A',
    friend_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'accepted',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'friend_002',
    user_id: CURRENT_USER_ID,
    friend_id: 'user_003',
    friend_name: 'Trần Thị B',
    friend_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    status: 'accepted',
    created_at: '2024-02-20T14:30:00Z',
  },
];

const MOCK_REQUESTS: FriendRequest[] = [
  {
    id: 'req_001',
    from_user_id: 'user_004',
    from_user_name: 'Lê Văn C',
    from_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    to_user_id: CURRENT_USER_ID,
    status: 'pending',
    created_at: '2024-03-25T09:00:00Z',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_001',
    sender_id: 'user_002',
    receiver_id: CURRENT_USER_ID,
    content: 'Chào bạn! Chi tiêu hôm nay thế nào?',
    created_at: '2024-03-30T10:00:00Z',
    read: false,
  },
  {
    id: 'msg_002',
    sender_id: CURRENT_USER_ID,
    receiver_id: 'user_002',
    content: 'Mình ổn, cảm ơn bạn!',
    created_at: '2024-03-30T10:05:00Z',
    read: true,
  },
];

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage or use mock data
    const storedFriends = localStorage.getItem('friends');
    const storedRequests = localStorage.getItem('friend_requests');
    const storedMessages = localStorage.getItem('messages');

    setFriends(storedFriends ? JSON.parse(storedFriends) : MOCK_FRIENDS);
    setRequests(storedRequests ? JSON.parse(storedRequests) : MOCK_REQUESTS);
    setMessages(storedMessages ? JSON.parse(storedMessages) : MOCK_MESSAGES);
    setLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('friends', JSON.stringify(friends));
      localStorage.setItem('friend_requests', JSON.stringify(requests));
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [friends, requests, messages, loading]);

  const sendFriendRequest = useCallback((friendId: string, friendName: string) => {
    const newRequest: FriendRequest = {
      id: `req_${Date.now()}`,
      from_user_id: CURRENT_USER_ID,
      from_user_name: 'Tôi', // Current user name
      to_user_id: friendId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);
  }, []);

  const acceptFriendRequest = useCallback((requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Add to friends
    const newFriend: Friend = {
      id: `friend_${Date.now()}`,
      user_id: CURRENT_USER_ID,
      friend_id: request.from_user_id,
      friend_name: request.from_user_name,
      friend_avatar: request.from_user_avatar,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };

    setFriends(prev => [...prev, newFriend]);
    setRequests(prev => prev.filter(r => r.id !== requestId));
  }, [requests]);

  const rejectFriendRequest = useCallback((requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setFriends(prev => prev.filter(f => f.friend_id !== friendId));
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender_id: CURRENT_USER_ID,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const getMessagesWithFriend = useCallback((friendId: string) => {
    return messages.filter(
      m => (m.sender_id === friendId && m.receiver_id === CURRENT_USER_ID) ||
           (m.sender_id === CURRENT_USER_ID && m.receiver_id === friendId)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages]);

  const getConversations = useCallback((): ChatConversation[] => {
    return friends.map(friend => {
      const friendMessages = getMessagesWithFriend(friend.friend_id);
      const lastMessage = friendMessages[friendMessages.length - 1] || null;
      const unreadCount = friendMessages.filter(m => m.sender_id === friend.friend_id && !m.read).length;

      return {
        friend_id: friend.friend_id,
        friend_name: friend.friend_name,
        friend_avatar: friend.friend_avatar,
        last_message: lastMessage,
        unread_count: unreadCount,
      };
    });
  }, [friends, getMessagesWithFriend]);

  const markMessagesAsRead = useCallback((friendId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.sender_id === friendId && m.receiver_id === CURRENT_USER_ID && !m.read
          ? { ...m, read: true }
          : m
      )
    );
  }, []);

  return {
    friends,
    requests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    sendMessage,
    getMessagesWithFriend,
    getConversations,
    markMessagesAsRead,
  };
}

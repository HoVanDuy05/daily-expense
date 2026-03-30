// API Endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  LOGOUT: `${API_BASE_URL}/logout`,
  ME: `${API_BASE_URL}/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/password`,

  // Expenses
  EXPENSES: `${API_BASE_URL}/expenses`,
  EXPENSES_TODAY: `${API_BASE_URL}/expenses/today`,
  EXPENSES_SUMMARY: `${API_BASE_URL}/expenses/summary`,

  // Friends (if needed)
  FRIENDS: `${API_BASE_URL}/friends`,
  FRIEND_REQUESTS: `${API_BASE_URL}/friends/requests`,
  SEND_FRIEND_REQUEST: `${API_BASE_URL}/friends/request`,
  ACCEPT_FRIEND_REQUEST: (requestId: string) => `${API_BASE_URL}/friends/requests/${requestId}/accept`,
  REJECT_FRIEND_REQUEST: (requestId: string) => `${API_BASE_URL}/friends/requests/${requestId}/reject`,
  REMOVE_FRIEND: (friendId: string) => `${API_BASE_URL}/friends/${friendId}`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
} as const;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

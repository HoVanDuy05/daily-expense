export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: ExpenseCategory;
  image_url: string;
  note: string;
  collaborators: string[]; // Array of friend user_ids
  created_at: string;
  updated_at?: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'other';

export interface CategoryInfo {
  id: ExpenseCategory;
  label: string;
  color: string;
  icon: string;
}

export interface DailyExpense {
  date: string;
  expenses: Expense[];
  total: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  count: number;
}

// Friend types
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  friend_name: string;
  friend_avatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface FriendRequest {
  id: string;
  from_user_id: string;
  from_user_name: string;
  from_user_avatar?: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// Chat types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatConversation {
  friend_id: string;
  friend_name: string;
  friend_avatar?: string;
  last_message: Message | null;
  unread_count: number;
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'food', label: 'Ăn uống', color: '#FF6B6B', icon: 'IconToolsKitchen2' },
  { id: 'transport', label: 'Di chuyển', color: '#4ECDC4', icon: 'IconCar' },
  { id: 'shopping', label: 'Shopping', color: '#45B7D1', icon: 'IconShoppingBag' },
  { id: 'entertainment', label: 'Giải trí', color: '#96CEB4', icon: 'IconMovie' },
  { id: 'bills', label: 'Hóa đơn', color: '#FFEAA7', icon: 'IconReceipt' },
  { id: 'health', label: 'Sức khỏe', color: '#DDA0DD', icon: 'IconHeart' },
  { id: 'other', label: 'Khác', color: '#98A8B8', icon: 'IconDots' },
];

export const CATEGORY_MAP: Record<ExpenseCategory, CategoryInfo> =
  EXPENSE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: cat }), {} as Record<ExpenseCategory, CategoryInfo>);

'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Typography,
  Avatar,
  Slide,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { IconX, IconCamera, IconTrash, IconUsers } from '@tabler/icons-react';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { compressImage } from '@/lib/utils';
import { useFriends } from '@/hooks/useFriends';

type TransactionType = 'income' | 'expense';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    type: TransactionType;
    category: ExpenseCategory;
    note: string;
    image: string;
    collaborators: string[];
  }) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import React from 'react';

// Format number with thousand separators
const formatNumber = (value: string): string => {
  const num = value.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted number back to number
const parseFormattedNumber = (value: string): number => {
  return parseInt(value.replace(/\./g, ''), 10) || 0;
};

export default function ExpenseForm({ open, onClose, onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { friends } = useFriends();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '');
    const formatted = formatNumber(rawValue);
    setAmount(formatted);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const compressed = await compressImage(file, 1200, 0.8);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error('Image compression failed:', error);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const numAmount = parseFormattedNumber(amount);
    if (numAmount <= 0 || !image) return;

    onSubmit({
      amount: numAmount,
      type,
      category,
      note,
      image,
      collaborators,
    });

    // Reset form
    setAmount('');
    setType('expense');
    setCategory('food');
    setNote('');
    setImage(null);
    setCollaborators([]);
  };

  const handleClose = () => {
    setAmount('');
    setType('expense');
    setCategory('food');
    setNote('');
    setImage(null);
    setCollaborators([]);
    onClose();
  };

  const isValid = parseFormattedNumber(amount) > 0 && image;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullScreen
      PaperProps={{
        sx: { bgcolor: 'grey.50' }
      }}
    >
      <DialogTitle sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="600">Thêm giao dịch</Typography>
        <IconButton onClick={handleClose} size="small">
          <IconX size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 2 }}>
        {/* Transaction Type Toggle */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Loại giao dịch
          </Typography>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(e, value) => value && setType(value)}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                flex: 1,
                py: 1.5,
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton
              value="expense"
              sx={{
                color: 'error.main',
                '&.Mui-selected': { bgcolor: 'error.main', color: 'white' }
              }}
            >
              - Chi tiêu
            </ToggleButton>
            <ToggleButton
              value="income"
              sx={{
                color: 'success.main',
                '&.Mui-selected': { bgcolor: 'success.main', color: 'white' }
              }}
            >
              + Thu nhập
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Amount Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Số tiền
          </Typography>
          <TextField
            fullWidth
            placeholder="0"
            value={amount}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: (
                <Typography variant="h6" sx={{ mr: 1, fontWeight: 700, color: type === 'expense' ? 'error.main' : 'success.main' }}>
                  {type === 'expense' ? '-' : '+'}
                </Typography>
              ),
              endAdornment: (
                <Typography variant="h6" color="primary" sx={{ ml: 1, fontWeight: 700 }}>
                  VNĐ
                </Typography>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '2rem',
                fontWeight: 600,
              },
              '& .MuiInputBase-input': {
                py: 1,
              },
            }}
          />
        </Box>

        {/* Category Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Hạng mục
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                onClick={() => setCategory(cat.id)}
                sx={{
                  bgcolor: category === cat.id ? cat.color : 'white',
                  color: category === cat.id ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: category === cat.id ? cat.color : 'grey.300',
                  fontWeight: category === cat.id ? 600 : 400,
                  '&:hover': {
                    bgcolor: category === cat.id ? cat.color : 'grey.100',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Image Capture - Camera Only, Required */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Hình ảnh <Typography component="span" color="error.main">*</Typography> (bắt buộc)
          </Typography>

          {image ? (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={image}
                variant="rounded"
                sx={{ width: 200, height: 200, objectFit: 'cover' }}
              />
              <IconButton
                onClick={() => setImage(null)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
                size="small"
              >
                <IconTrash size={16} />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              startIcon={<IconCamera size={20} />}
              fullWidth
              sx={{ py: 3, borderStyle: 'dashed', borderRadius: 3 }}
            >
              Chụp ảnh (bắt buộc)
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={handleImageSelect}
              />
            </Button>
          )}
        </Box>

        {/* Friend Collaboration */}
        {friends.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              <IconUsers size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Chia sẻ với bạn bè (tùy chọn)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {friends.map((friend) => (
                <Chip
                  key={friend.friend_id}
                  avatar={<Avatar src={friend.friend_avatar} sx={{ width: 24, height: 24 }}>{friend.friend_name.charAt(0)}</Avatar>}
                  label={friend.friend_name}
                  onClick={() => {
                    setCollaborators(prev =>
                      prev.includes(friend.friend_id)
                        ? prev.filter(id => id !== friend.friend_id)
                        : [...prev, friend.friend_id]
                    );
                  }}
                  sx={{
                    bgcolor: collaborators.includes(friend.friend_id) ? 'primary.main' : 'white',
                    color: collaborators.includes(friend.friend_id) ? 'white' : 'text.primary',
                    border: '1px solid',
                    borderColor: collaborators.includes(friend.friend_id) ? 'primary.main' : 'grey.300',
                    fontWeight: collaborators.includes(friend.friend_id) ? 600 : 400,
                    '&:hover': {
                      bgcolor: collaborators.includes(friend.friend_id) ? 'primary.dark' : 'grey.100',
                    },
                  }}
                />
              ))}
            </Box>
            {collaborators.length > 0 && (
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                Đã chọn {collaborators.length} người để colab
              </Typography>
            )}
          </Box>
        )}

        {/* Note Input */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Ghi chú
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Ghi chú về giao dịch..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 2, bgcolor: 'white' }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={!isValid || loading}
          sx={{
            py: 1.5,
            borderRadius: 3,
            bgcolor: type === 'expense' ? 'error.main' : 'success.main',
            '&:hover': {
              bgcolor: type === 'expense' ? 'error.dark' : 'success.dark',
            }
          }}
        >
          {type === 'expense' ? 'Lưu chi tiêu' : 'Lưu thu nhập'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

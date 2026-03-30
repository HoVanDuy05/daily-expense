'use client';

import { Card, Box, Typography, Chip } from '@mui/material';
import { Expense } from '@/types/expense';
import { CATEGORY_MAP } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
}

export default function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  const category = CATEGORY_MAP[expense.category];
  const hasImage = !!expense.image_url;

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        '&:hover': onClick ? {
          transform: 'scale(1.02)',
          boxShadow: 6,
        } : {},
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: hasImage ? `url(${expense.image_url})` : `linear-gradient(135deg, ${category.color}40 0%, ${category.color}80 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)',
          },
        }}
      />

      {/* Top: Category */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: 2,
          zIndex: 1,
        }}
      >
        <Chip
          label={category.label}
          size="small"
          sx={{
            bgcolor: `${category.color}ee`,
            color: 'white',
            fontWeight: 700,
            fontSize: '0.75rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />
      </Box>

      {/* Bottom: Amount & Note */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          zIndex: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          color="white"
          sx={{
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            mb: expense.note ? 0.5 : 0,
          }}
        >
          {formatCurrency(expense.amount)}
        </Typography>

        {expense.note && (
          <Typography
            variant="caption"
            color="rgba(255,255,255,0.9)"
            sx={{
              display: 'block',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {expense.note}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

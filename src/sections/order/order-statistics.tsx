import Box from '@mui/material/Box';
// src/sections/order/order-statistics.tsx
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'completed'
  | 'cancelled';

type ColorKey = 'total' | OrderStatus;

const DEFAULT_COLOR_HEX: Record<ColorKey, string> = {
  total: '#1e88e5',
  pending: '#ef5350',
  processing: '#29b6f6',
  preparing: '#26c6da',
  ready: '#2e7d32',
  delivering: '#1e40af',
  completed: '#43a047',
  cancelled: '#6b7280',
};

const DEFAULT_TITLE: Record<OrderStatus, string> = {
  pending: 'Pending Orders',
  processing: 'Processing Orders',
  preparing: 'Preparing Orders',
  ready: 'Ready Orders',
  delivering: 'Delivering Orders',
  completed: 'Completed Orders',
  cancelled: 'Cancelled Orders',
};

export type OrderStatCard =
  | { key: 'total'; value: number; ratio: number; title?: string; colorHex?: string }
  | { key: OrderStatus; value: number; ratio: number; title?: string; colorHex?: string };

type Props = {
  cards: OrderStatCard[];
};

const clampRatio = (r: number) => Math.max(0, Math.min(100, Math.round(r * 100)));

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <Box
      sx={{
        height: 8,
        width: '100%',
        borderRadius: 999,
        bgcolor: 'action.hover',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${percent}%`,
          bgcolor: color,
          borderRadius: 999,
          transition: 'width .3s ease',
        }}
      />
    </Box>
  );
}

function StatCard(card: OrderStatCard) {
  const percent = clampRatio(card.ratio);
  const isTotal = card.key === 'total';

  const colorHex =
    card.colorHex ??
    DEFAULT_COLOR_HEX[(isTotal ? 'total' : card.key) as ColorKey];

  const title =
    card.title ??
    (isTotal ? 'Total Orders' : DEFAULT_TITLE[card.key as OrderStatus]);

  return (
    <Card
      variant="outlined"
      sx={{
        border: 2,
        borderColor: colorHex,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ color: colorHex, fontWeight: 700 }}>
            {title}
          </Typography>

          <Typography variant="h3" sx={{ lineHeight: 1 }}>
            {card.value.toLocaleString()}
          </Typography>

          <ProgressBar percent={percent} color={colorHex} />

          <Typography variant="caption" color="text.secondary">
            {percent}% of target achieved
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function OrderStatistics({ cards }: Props) {
  return (
    <Grid container spacing={3}>
      {cards.map((c, idx) => (
        <Grid key={`${c.key}-${idx}`} size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard {...c} />
        </Grid>
      ))}
    </Grid>
  );
}

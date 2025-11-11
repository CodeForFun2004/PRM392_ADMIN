// src/sections/order/order-status.tsx
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export const STATUS_SEQUENCE: readonly OrderStatus[] = [
  'pending',
  'processing',
  'preparing',
  'ready',
  'delivering',
  'completed',
] as const; // cancelled đứng riêng (nhánh kết thúc sớm)

// ------- Labels & Colors (giữ đồng bộ toàn app) -------
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  preparing: 'Preparing',
  ready: 'Ready',
  delivering: 'Delivering',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

type ColorKey = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
export const STATUS_COLOR: Record<OrderStatus, ColorKey> = {
  pending: 'error',       // đỏ nhạt
  processing: 'info',     // xanh dương nhạt
  preparing: 'info',
  ready: 'success',       // xanh lá
  delivering: 'primary',  // xanh dương
  completed: 'success',
  cancelled: 'secondary', // xám
};

// ------- Flow helpers -------
export function getNextStatus(s: OrderStatus): OrderStatus | null {
  if (s === 'cancelled' || s === 'completed') return null;
  const i = STATUS_SEQUENCE.indexOf(s);
  return i >= 0 && i < STATUS_SEQUENCE.length - 1 ? STATUS_SEQUENCE[i + 1] : null;
}
export function isTerminal(s: OrderStatus) {
  return s === 'completed' || s === 'cancelled';
}

// ------- Small UI pieces -------
export function StatusChip({ status }: { status: OrderStatus }) {
  return <Chip size="small" color={STATUS_COLOR[status]} label={STATUS_LABEL[status]} />;
}

export type StatusFilterValue = 'all' | OrderStatus;
export type StatusCounts = Partial<Record<OrderStatus, number>> & { all?: number };

type StatusFilterProps = {
  /** 'all' hoặc 1 status cụ thể */
  value: StatusFilterValue;
  /** Badge số lượng trên mỗi tab */
  counts?: StatusCounts;
  /** Đổi tab */
  onChange: (value: StatusFilterValue) => void;
  /** Có hiển thị tab Cancelled không (mặc định true) */
  showCancelled?: boolean;
  /** Có hiển thị tab All không (mặc định true) */
  showAll?: boolean;
};

export function StatusFilter({
  value,
  counts,
  onChange,
  showCancelled = true,
  showAll = true,
}: StatusFilterProps) {
  const tabs: { key: StatusFilterValue; label: string }[] = [];

  if (showAll) tabs.push({ key: 'all', label: 'All' });
  STATUS_SEQUENCE.forEach((s) => tabs.push({ key: s, label: STATUS_LABEL[s] }));
  if (showCancelled) tabs.push({ key: 'cancelled', label: STATUS_LABEL.cancelled });

  return (
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
    >
      {tabs.map((t) => {
        const isAll = t.key === 'all';
        const color = isAll ? 'primary' : STATUS_COLOR[t.key as OrderStatus];
        const count =
          counts?.[t.key as keyof StatusCounts] ??
          (isAll ? counts?.all : undefined);

        const labelNode = (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t.label}
            </Typography>
            {typeof count === 'number' && (
              <Badge
                color={color}
                badgeContent={count}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              />
            )}
          </Stack>
        );

        return (
          <Tab
            key={t.key}
            value={t.key}
            label={
              isAll ? (
                labelNode
              ) : (
                <Tooltip title={STATUS_LABEL[t.key as OrderStatus]}>
                  <span>{labelNode}</span>
                </Tooltip>
              )
            }
            sx={{ minHeight: 44 }}
          />
        );
      })}
    </Tabs>
  );
}

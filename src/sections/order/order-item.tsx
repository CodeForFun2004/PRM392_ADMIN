// src/components/order-item.tsx
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export type IOrderItem = {
  id?: string;
  _id?: string;
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    size?: string;
    toppings?: { id: string; name: string }[];
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: 'cod' | 'vietqr';
  status:
    | 'pending'
    | 'processing'
    | 'preparing'
    | 'ready'
    | 'delivering'
    | 'completed'
    | 'cancelled';
  createdAt?: string | Date;
};

type Props = {
  order: IOrderItem;
  onViewDetail?: (order: IOrderItem) => void;
};

const statusColor: Record<IOrderItem['status'], 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  pending: 'default',
  processing: 'info',
  preparing: 'info',
  ready: 'success',
  delivering: 'warning',
  completed: 'success',
  cancelled: 'error',
};

const statusLabel: Record<IOrderItem['status'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  preparing: 'Preparing',
  ready: 'Ready',
  delivering: 'Delivering',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatDate(value?: string | Date) {
  if (!value) return '-';
  const d = typeof value === 'string' ? new Date(value) : value;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatVND(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderItem({ order, onViewDetail }: Props) {
  const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {order.orderNumber}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDate(order.createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="center">{itemsCount}</TableCell>

      <TableCell align="center">{formatVND(order.total)}</TableCell>

      <TableCell align="center">
        <Chip
          size="small"
          variant={order.paymentMethod === 'cod' ? 'outlined' : 'filled'}
          color={order.paymentMethod === 'cod' ? 'default' : 'info'}
          label={order.paymentMethod.toUpperCase()}
        />
      </TableCell>

      <TableCell align="center">
        <Chip
          size="small"
          color={statusColor[order.status]}
          label={statusLabel[order.status]}
        />
      </TableCell>

      <TableCell align="right">
        <Tooltip title="View detail">
          <IconButton onClick={() => onViewDetail?.(order)}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

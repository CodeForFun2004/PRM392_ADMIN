// src/sections/order/order-detail.tsx
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import TableRow from '@mui/material/TableRow';
import StepLabel from '@mui/material/StepLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { STATUS_LABEL, STATUS_SEQUENCE, type OrderStatus } from './order-status';

import type { IOrderItem } from './order-item';

type Props = {
  open: boolean;
  order?: IOrderItem | null;
  onClose: () => void;
  onAdvance?: (order: IOrderItem) => void;
  onCancel?: (order: IOrderItem) => void;
};

const statusColor: Record<
  IOrderItem['status'],
  'default' | 'info' | 'warning' | 'success' | 'error' | 'secondary'
> = {
  pending: 'default',
  processing: 'info',
  preparing: 'info',
  ready: 'success',
  delivering: 'warning',
  completed: 'success',
  cancelled: 'secondary',
};

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);

const formatDateTime = (d?: string | Date) => {
  if (!d) return '';
  const x = typeof d === 'string' ? new Date(d) : d;
  const dd = String(x.getDate()).padStart(2, '0');
  const mm = String(x.getMonth() + 1).padStart(2, '0');
  const yyyy = x.getFullYear();
  const hh = String(x.getHours()).padStart(2, '0');
  const mi = String(x.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
};

const isTerminal = (s: OrderStatus) => s === 'completed' || s === 'cancelled';

export default function OrderDetail({ open, order, onClose, onAdvance, onCancel }: Props) {
  if (!order) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Order detail</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            No order selected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const currentIndex =
    order.status === 'cancelled'
      ? -1
      : Math.max(0, STATUS_SEQUENCE.indexOf(order.status as OrderStatus));

  const itemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            {order.orderNumber}
          </Typography>
          <Chip
            size="small"
            color={statusColor[order.status]}
            label={STATUS_LABEL[order.status as OrderStatus]}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {formatDateTime(order.createdAt)}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Progress (skip when cancelled) */}
        {order.status !== 'cancelled' && (
          <Box sx={{ px: { xs: 0, md: 1 }, py: 2 }}>
            <Stepper activeStep={currentIndex} alternativeLabel>
              {STATUS_SEQUENCE.map((s) => (
                <Step key={s}>
                  <StepLabel>{STATUS_LABEL[s]}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Meta blocks */}
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Items ({itemsCount})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Line Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((it, i) => {
                    const toppings = (it.toppings ?? []).map((t) => t.name).join(', ');
                    return (
                      <TableRow key={`${it.productId}-${i}`}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {it.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {it.size ? `Size: ${it.size}` : ''}
                            {it.size && toppings ? ' • ' : ''}
                            {toppings ? `Toppings: ${toppings}` : ''}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{it.quantity}</TableCell>
                        <TableCell align="right">{formatVND(it.price)}</TableCell>
                        <TableCell align="right">{formatVND(it.price * it.quantity)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Delivery
                </Typography>
                <Typography variant="body2">{order.deliveryAddress}</Typography>
                <Typography variant="body2">{order.phone}</Typography>
                {order.deliveryTime && (
                  <Typography variant="caption" color="text.secondary">
                    ETA: {order.deliveryTime}
                  </Typography>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Payment
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    variant={order.paymentMethod === 'cod' ? 'outlined' : 'filled'}
                    color={order.paymentMethod === 'cod' ? 'default' : 'info'}
                    label={order.paymentMethod.toUpperCase()}
                  />
                </Stack>
                {order.paymentMethod === 'vietqr' && order.qrCodeUrl && (
                  <Box sx={{ mt: 1.5 }}>
                    <img
                      src={order.qrCodeUrl}
                      alt="VietQR"
                      style={{ width: 160, height: 160, objectFit: 'contain', borderRadius: 8 }}
                      loading="lazy"
                    />
                  </Box>
                )}
              </Box>

              <Divider />

              <Box>
                <Stack spacing={0.5}>
                  <RowText label="Subtotal" value={formatVND(order.subtotal)} />
                  <RowText label="Delivery fee" value={formatVND(order.deliveryFee)} />
                  <RowText label="Tax" value={formatVND(order.tax)} />
                  <Divider sx={{ my: 0.5 }} />
                  <RowText label="Total" value={formatVND(order.total)} bold />
                </Stack>
              </Box>

              {order.status === 'cancelled' && order['cancelReason'] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Cancel reason:&nbsp;
                  </Typography>
                  <Typography variant="caption">{order['cancelReason']}</Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** nhỏ gọn cho dòng tổng tiền */
function RowText({
  label,
  value,
  bold,
}: {
  label: string;
  value: string | number;
  bold?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant={bold ? 'subtitle1' : 'body2'}
        sx={{ fontWeight: bold ? 700 : undefined }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

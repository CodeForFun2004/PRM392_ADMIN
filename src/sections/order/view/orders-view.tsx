// src/sections/order/view/orders-view.tsx
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { _orders } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import OrderDetail from '../order-detail';
import OrderStatistics from '../order-statistics';
import OrderItem, { type IOrderItem } from '../order-item';
import { StatusFilter, type OrderStatus, type StatusFilterValue } from '../order-status';

const PAGE_SIZE = 8;

export function OrdersView() {
  // -------- Stats & Counts --------
  const counts = useMemo(() => {
    const acc: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      preparing: 0,
      ready: 0,
      delivering: 0,
      completed: 0,
      cancelled: 0,
    };
    _orders.forEach((o) => {
      const s = (o as any).status as OrderStatus;
      if (acc[s] !== undefined) acc[s] += 1;
    });
    const all = _orders.length;
    return { ...acc, all };
  }, []);

  const STATUS_COLOR = {
    total: '#1e88e5',
    pending: '#ef5350',
    processing: '#29b6f6',
    preparing: '#26c6da',
    ready: '#2e7d32',
    delivering: '#1e40af',
    completed: '#43a047',
    cancelled: '#6b7280',
  } as const;

  const statsCards = useMemo(
    () => [
      {
        key: 'total' as const,
        title: 'Total Orders',
        value: counts.all ?? 0,
        ratio: (counts.all ?? 0) ? 0.75 : 0,
        colorHex: STATUS_COLOR.total,
      },
      {
        key: 'pending' as const,
        title: 'Pending Orders',
        value: counts.pending,
        ratio: (counts.pending || 0) / Math.max(1, counts.all || 0),
        colorHex: STATUS_COLOR.pending,
      },
      {
        key: 'completed' as const,
        title: 'Completed Orders',
        value: counts.completed,
        ratio: (counts.completed || 0) / Math.max(1, counts.all || 0),
        colorHex: STATUS_COLOR.completed,
      },
      {
        key: 'delivering' as const,
        title: 'Delivering Orders',
        value: counts.delivering,
        ratio: (counts.delivering || 0) / Math.max(1, counts.all || 0),
        colorHex: STATUS_COLOR.delivering,
      },
      {
        key: 'cancelled' as const,
        title: 'Cancelled Orders',
        value: counts.cancelled,
        ratio: (counts.cancelled || 0) / Math.max(1, counts.all || 0),
        colorHex: STATUS_COLOR.cancelled,
      },
      {
        key: 'processing' as const,
        title: 'Processing Orders',
        value: counts.processing,
        ratio: (counts.processing || 0) / Math.max(1, counts.all || 0),
        colorHex: STATUS_COLOR.processing,
      },
    ],
    [counts]
  );

  // -------- Filter & Paging --------
  const [status, setStatus] = useState<StatusFilterValue>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = status === 'all' ? _orders : _orders.filter((o) => o.status === status);
    return base as unknown as IOrderItem[];
  }, [status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleChangeStatus = useCallback((v: StatusFilterValue) => {
    setStatus(v);
    setPage(1);
  }, []);

  // -------- Order Detail (Modal) --------
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<IOrderItem | null>(null);

  const openDetail = useCallback((ord: IOrderItem) => {
    setDetailOrder(ord);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
  }, []);

  // TODO: nối API đổi trạng thái/hủy đơn khi bạn sẵn sàng
  const handleAdvance = useCallback((ord: IOrderItem) => {
    console.log('Advance status for', ord.orderNumber);
  }, []);
  const handleCancel = useCallback((ord: IOrderItem) => {
    console.log('Cancel order', ord.orderNumber);
  }, []);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4">Orders</Typography>
      </Box>

      {/* 1) Statistics */}
      <Box sx={{ mb: 4 }}>
        <OrderStatistics cards={statsCards} />
      </Box>

      {/* 2) Status tabs / filter */}
      <Box sx={{ mb: 3 }}>
        <StatusFilter value={status} counts={counts} onChange={handleChangeStatus} />
      </Box>

      {/* 3) Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Payment</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((o) => (
              <OrderItem
                key={o.id ?? o._id ?? o.orderNumber}
                order={o}
                onViewDetail={openDetail}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, p) => setPage(p)}
        color="primary"
        sx={{ mt: 4, mx: 'auto' }}
      />

      {/* Modal: Order detail */}
      <OrderDetail
        open={detailOpen}
        order={detailOrder}
        onClose={closeDetail}
        onAdvance={handleAdvance}
        onCancel={handleCancel}
      />
    </DashboardContent>
  );
}

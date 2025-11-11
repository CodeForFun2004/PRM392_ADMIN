// src/sections/promotion/view/promotions-view.tsx
import { useState, useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppSelector } from 'src/store/hooks';

import { Iconify } from 'src/components/iconify';

import AddPromoModal from '../add-promo-modal';
import PromotionItem, { type IPromotionItem } from '../promotion-item';
import PromotionSearch from '../promotion-search';
import PromotionSort, { type PromotionSortOption } from '../promotion-sort';
import PromotionFilters, { type PromotionLockFilter } from '../promotion-filters';
import EditPromoModal from '../edit-promo-modal';

export function PromotionsView() {
  const promotions = useAppSelector((state) => state.promotions);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<IPromotionItem | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [lockFilter, setLockFilter] = useState<PromotionLockFilter>('all');
  const [sortBy, setSortBy] = useState<PromotionSortOption>('percent-desc');

  const handleOpenEditModal = useCallback((promotion: IPromotionItem) => {
    setEditingPromotion(promotion);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingPromotion(null);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setOpenAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setOpenAddModal(false);
  }, []);

  const filteredPromotions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return promotions
      .filter((promotion) => {
        if (!query) return true;
        const titleMatch = promotion.title?.toLowerCase().includes(query);
        const codeMatch = promotion.promotionCode?.toLowerCase().includes(query);
        return titleMatch || codeMatch;
      })
      .filter((promotion) => {
        if (lockFilter === 'all') return true;
        if (lockFilter === 'locked') return Boolean(promotion.isLock);
        return !promotion.isLock;
      })
      .sort((a, b) => {
        if (sortBy === 'percent-desc') {
          return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
        }
        return (a.discountPercent ?? 0) - (b.discountPercent ?? 0);
      });
  }, [promotions, searchValue, lockFilter, sortBy]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Promotion
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddModal}
        >
          Add Promotion
        </Button>
      </Box>

      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}
      >
        <PromotionSearch value={searchValue} onChange={setSearchValue} />

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <PromotionFilters value={lockFilter} onChange={setLockFilter} />
          <PromotionSort value={sortBy} onChange={setSortBy} />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {filteredPromotions.map((p) => (
          <Grid key={p._id ?? (p as any).id ?? p.promotionCode} size={{ xs: 12, sm: 6, md: 4 }}>
            <PromotionItem item={p} onUpdate={handleOpenEditModal} />
          </Grid>
        ))}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />

      <AddPromoModal open={openAddModal} onClose={handleCloseAddModal} />
      <EditPromoModal open={Boolean(editingPromotion)} promotion={editingPromotion ?? undefined} onClose={handleCloseEditModal} />
    </DashboardContent>
  );
}

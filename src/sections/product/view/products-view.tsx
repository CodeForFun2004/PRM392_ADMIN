import type { ChangeEvent, SyntheticEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';

import { toast } from 'sonner';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  _sizes,
  _toppings,
  type ISize,
  _categories,
  _productsBE,
  type ITopping,
  type ICategory,
  type IProductBE,
} from 'src/_mock/_data';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TabValue = 'products' | 'categories' | 'toppings' | 'sizes';

type ProductFormState = Omit<IProductBE, '_id'> & {
  _id?: string;
  imageFile?: File | null;
  imagePreview?: string;
};
type CategoryFormState = Omit<ICategory, '_id'> & { _id?: string };
type ToppingFormState = Omit<ITopping, '_id'> & { _id?: string };
type SizeFormState = Omit<ISize, '_id'> & { _id?: string };

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return (timestamp + random).slice(0, 24);
};

const defaultProductForm: ProductFormState = {
  name: '',
  description: '',
  basePrice: 0,
  image: '',
  imageFile: null,
  imagePreview: '',
  status: 'new',
  rating: 4.8,
  sizeOptions: [],
  toppingOptions: [],
  storeId: '',
  categoryId: [],
  isBanned: false,
};

const defaultCategoryForm: CategoryFormState = {
  category: '',
  icon: '',
  description: '',
};

const defaultToppingForm: ToppingFormState = {
  name: '',
  price: 0,
  icon: '',
};

const defaultSizeForm: SizeFormState = {
  size: 'S',
  name: '',
  multiplier: 1,
  volume: '',
};

// ----------------------------------------------------------------------

export function ProductsView() {
  const [currentTab, setCurrentTab] = useState<TabValue>('products');

  const [products, setProducts] = useState<IProductBE[]>(() => _productsBE);
  const [categories, setCategories] = useState<ICategory[]>(() => _categories);
  const [toppings, setToppings] = useState<ITopping[]>(() => _toppings);
  const [sizes, setSizes] = useState<ISize[]>(() => _sizes);

  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [categorySearch, setCategorySearch] = useState('');
  const [toppingSearch, setToppingSearch] = useState('');
  const [sizeSearch, setSizeSearch] = useState('');

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProductBE | null>(null);
  const [productDetail, setProductDetail] = useState<IProductBE | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const [toppingDialogOpen, setToppingDialogOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ITopping | null>(null);

  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<ISize | null>(null);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category._id, category])),
    [categories]
  );

  const toppingMap = useMemo(
    () => new Map(toppings.map((topping) => [topping._id, topping])),
    [toppings]
  );

  const sizeMap = useMemo(() => new Map(sizes.map((size) => [size._id, size])), [sizes]);

  const filteredProducts = useMemo(() => {
    const normalized = productSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = normalized
        ? product.name.toLowerCase().includes(normalized) ||
          (product.description ?? '').toLowerCase().includes(normalized)
        : true;
      const matchesCategory =
        categoryFilter === 'all' ? true : product.categoryId.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, categoryFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage)),
    [filteredProducts.length],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [productSearch, categoryFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page]);

  const filteredCategories = useMemo(() => {
    const normalized = categorySearch.trim().toLowerCase();
    if (!normalized) {
      return categories;
    }
    return categories.filter(
      (category) =>
        category.category.toLowerCase().includes(normalized) ||
        (category.description ?? '').toLowerCase().includes(normalized)
    );
  }, [categories, categorySearch]);

  const filteredToppings = useMemo(() => {
    const normalized = toppingSearch.trim().toLowerCase();
    if (!normalized) {
      return toppings;
    }
    return toppings.filter(
      (topping) =>
        topping.name.toLowerCase().includes(normalized) ||
        topping.price.toString().includes(normalized)
    );
  }, [toppings, toppingSearch]);

  const filteredSizes = useMemo(() => {
    const normalized = sizeSearch.trim().toLowerCase();
    if (!normalized) {
      return sizes;
    }
    return sizes.filter(
      (size) =>
        size.size.toLowerCase().includes(normalized) ||
        size.name.toLowerCase().includes(normalized) ||
        size.volume.toLowerCase().includes(normalized)
    );
  }, [sizes, sizeSearch]);

  const handleTabChange = useCallback((_: SyntheticEvent, value: TabValue) => {
    setCurrentTab(value);
  }, []);

  const handleOpenCreateProduct = useCallback(() => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: IProductBE) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  }, []);

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      const targetProduct = products.find((item) => item._id === productId);
      if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
        setProducts((prev) => prev.filter((product) => product._id !== productId));
        toast.success('Đã xoá sản phẩm', { description: targetProduct?.name });
      }
    },
    [products]
  );

  const handleSubmitProduct = useCallback(
    (formValue: ProductFormState) => {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingProduct._id ? { ...editingProduct, ...formValue, _id: editingProduct._id } : product
          )
        );
        toast.success('Cập nhật sản phẩm thành công!', { description: formValue.name });
      } else {
        const newProduct: IProductBE = {
          ...formValue,
          _id: generateObjectId(),
        };
        setProducts((prev) => [newProduct, ...prev]);
        setPage(1);
        toast.success('Tạo sản phẩm thành công!', { description: newProduct.name });
      }
      setProductDialogOpen(false);
      setEditingProduct(null);
    },
    [editingProduct]
  );

  const handleCloseProductDialog = useCallback(() => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  }, []);

  const handleViewProductDetail = useCallback((product: IProductBE) => {
    setProductDetail(product);
  }, []);

  const handleCloseProductDetail = useCallback(() => {
    setProductDetail(null);
  }, []);

  const handleChangePage = useCallback((_: SyntheticEvent | null, value: number) => {
    setPage(value);
  }, []);

  const handleOpenCreateCategory = useCallback(() => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: ICategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  }, []);

  const handleSubmitCategory = useCallback(
    (formValue: CategoryFormState) => {
      if (editingCategory) {
        const updatedCategory: ICategory = {
          ...editingCategory,
          ...formValue,
          updatedAt: new Date().toISOString(),
        };
        setCategories((prev) =>
          prev.map((category) => (category._id === editingCategory._id ? updatedCategory : category))
        );
        toast.success('Cập nhật danh mục thành công!', { description: formValue.category });
      } else {
        const now = new Date().toISOString();
        const newCategory: ICategory = {
          ...formValue,
          _id: generateObjectId(),
          createdAt: now,
          updatedAt: now,
        };
        setCategories((prev) => [newCategory, ...prev]);
        toast.success('Tạo danh mục thành công!', { description: formValue.category });
      }
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    },
    [editingCategory]
  );

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      const targetCategory = categories.find((item) => item._id === categoryId);
      if (window.confirm('Xoá danh mục sẽ gỡ danh mục này khỏi tất cả sản phẩm. Tiếp tục?')) {
        setCategories((prev) => prev.filter((category) => category._id !== categoryId));
        setProducts((prev) =>
          prev.map((product) => ({
            ...product,
            categoryId: product.categoryId.filter((id) => id !== categoryId),
          }))
        );
        setCategoryFilter((prev) => (prev === categoryId ? 'all' : prev));
        toast.success('Đã xoá danh mục', { description: targetCategory?.category });
      }
    },
    [categories]
  );

  const handleCloseCategoryDialog = useCallback(() => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  }, []);

  const handleOpenCreateTopping = useCallback(() => {
    setEditingTopping(null);
    setToppingDialogOpen(true);
  }, []);

  const handleEditTopping = useCallback((topping: ITopping) => {
    setEditingTopping(topping);
    setToppingDialogOpen(true);
  }, []);

  const handleSubmitTopping = useCallback(
    (formValue: ToppingFormState) => {
      if (editingTopping) {
        const updated: ITopping = {
          ...editingTopping,
          ...formValue,
          updatedAt: new Date().toISOString(),
        };
        setToppings((prev) =>
          prev.map((topping) => (topping._id === editingTopping._id ? updated : topping))
        );
        toast.success('Cập nhật topping thành công!', { description: formValue.name });
      } else {
        const now = new Date().toISOString();
        const newTopping: ITopping = {
          ...formValue,
          _id: generateObjectId(),
          createdAt: now,
          updatedAt: now,
        };
        setToppings((prev) => [newTopping, ...prev]);
        toast.success('Tạo topping thành công!', { description: formValue.name });
      }
      setToppingDialogOpen(false);
      setEditingTopping(null);
    },
    [editingTopping]
  );

  const handleDeleteTopping = useCallback(
    (toppingId: string) => {
      const target = toppings.find((item) => item._id === toppingId);
      if (window.confirm('Bạn có chắc chắn muốn xoá topping này?')) {
        setToppings((prev) => prev.filter((topping) => topping._id !== toppingId));
        setProducts((prev) =>
          prev.map((product) => ({
            ...product,
            toppingOptions: product.toppingOptions.filter((id) => id !== toppingId),
          }))
        );
        toast.success('Đã xoá topping', { description: target?.name });
      }
    },
    [toppings]
  );

  const handleCloseToppingDialog = useCallback(() => {
    setToppingDialogOpen(false);
    setEditingTopping(null);
  }, []);

  const handleOpenCreateSize = useCallback(() => {
    setEditingSize(null);
    setSizeDialogOpen(true);
  }, []);

  const handleEditSize = useCallback((size: ISize) => {
    setEditingSize(size);
    setSizeDialogOpen(true);
  }, []);

  const handleSubmitSize = useCallback(
    (formValue: SizeFormState) => {
      if (editingSize) {
        const updated: ISize = {
          ...editingSize,
          ...formValue,
          updatedAt: new Date().toISOString(),
        };
        setSizes((prev) => prev.map((size) => (size._id === editingSize._id ? updated : size)));
        toast.success('Cập nhật size thành công!', { description: formValue.name });
      } else {
        const now = new Date().toISOString();
        const newSize: ISize = {
          ...formValue,
          _id: generateObjectId(),
          createdAt: now,
          updatedAt: now,
        };
        setSizes((prev) => [newSize, ...prev]);
        toast.success('Tạo size mới thành công!', {
          description: `${formValue.size} - ${formValue.name}`,
        });
      }
      setSizeDialogOpen(false);
      setEditingSize(null);
    },
    [editingSize]
  );

  const handleDeleteSize = useCallback(
    (sizeId: string) => {
      const target = sizes.find((item) => item._id === sizeId);
      if (window.confirm('Bạn có chắc chắn muốn xoá size này?')) {
        setSizes((prev) => prev.filter((size) => size._id !== sizeId));
        setProducts((prev) =>
          prev.map((product) => ({
            ...product,
            sizeOptions: product.sizeOptions.filter((id) => id !== sizeId),
          }))
        );
        toast.success('Đã xoá size', {
          description: target ? `${target.size} - ${target.name}` : undefined,
        });
      }
    },
    [sizes]
  );

  const handleCloseSizeDialog = useCallback(() => {
    setSizeDialogOpen(false);
    setEditingSize(null);
  }, []);

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Product</Typography>
        </Box>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            px: { xs: 1, md: 0 },
            '& .MuiTabs-flexContainer': { flexWrap: 'wrap' },
          }}
        >
          <Tab value="products" label="Sản phẩm" icon={<Iconify icon="solar:cart-large-bold" />} iconPosition="start" />
          <Tab
            value="categories"
            label="Danh mục"
            icon={<Iconify icon="solar:folder-bold" />}
            iconPosition="start"
          />
          <Tab
            value="toppings"
            label="Topping"
            icon={<Iconify icon="solar:cup-hot-bold" />}
            iconPosition="start"
          />
          <Tab
            value="sizes"
            label="Size"
            icon={<Iconify icon="solar:ruler-bold" />}
            iconPosition="start"
          />
        </Tabs>

        <TabPanel currentTab={currentTab} value="products">
          <Card>
            <CardHeader
              title="Danh sách sản phẩm"
              subheader="Theo dõi danh sách sản phẩm, lọc theo danh mục và tìm kiếm nhanh."
              action={
                <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" />} onClick={handleOpenCreateProduct}>
                  Thêm sản phẩm
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
                  <OutlinedInput
                    fullWidth
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Tìm kiếm theo tên hoặc mô tả sản phẩm..."
                    startAdornment={
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" />
                      </InputAdornment>
                    }
                  />

                  <Autocomplete
                    options={[{ _id: 'all', category: 'Tất cả', icon: '', description: '' }, ...categories]}
                    getOptionLabel={(option) => option.category}
                    value={
                      categoryFilter === 'all'
                        ? { _id: 'all', category: 'Tất cả', icon: '', description: '' }
                        : categories.find((category) => category._id === categoryFilter) ?? null
                    }
                    onChange={(_, value) => {
                      if (!value || value._id === 'all') {
                        setCategoryFilter('all');
                      } else {
                        setCategoryFilter(value._id);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="Danh mục" placeholder="Lọc theo danh mục" />}
                    sx={{ width: { xs: '100%', md: 280 } }}
                  />
                </Stack>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Danh mục</TableCell>
                        <TableCell>Giá cơ bản</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Khóa</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedProducts.map((product) => (
                        <TableRow key={product._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                variant="rounded"
                                src={product.image}
                                alt={product.name}
                                sx={{ width: 56, height: 56, borderRadius: 2 }}
                              >
                                {product.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">{product.name}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                  <Rating value={product.rating} precision={0.1} readOnly size="small" />
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {product.rating.toFixed(1)}
      </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {product.categoryId.length === 0 && (
                                <Chip label="Chưa gán" variant="outlined" color="default" size="small" />
                              )}
                              {product.categoryId.map((categoryId) => {
                                const category = categoryMap.get(categoryId);
                                return (
                                  <Chip
                                    key={categoryId}
                                    label={category?.category ?? 'Đã xoá'}
                                    size="small"
                                    color={category ? 'primary' : 'default'}
                                  />
                                );
                              })}
                            </Stack>
                          </TableCell>
                          <TableCell>{currencyFormatter.format(product.basePrice || 0)}</TableCell>
                          <TableCell>
                            <Chip
                              label={product.status === 'new' ? 'Mới' : 'Cũ'}
                              color={product.status === 'new' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.isBanned ? 'Đang khóa' : 'Đang mở bán'}
                              size="small"
                              color={product.isBanned ? 'error' : 'success'}
                              icon={<Iconify icon={product.isBanned ? 'solar:forbidden-bold' : 'solar:unlock-bold'} width={16} />}
                              variant={product.isBanned ? 'filled' : 'soft'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton color="default" onClick={() => handleViewProductDetail(product)}>
                                <Iconify icon="solar:eye-bold" />
                              </IconButton>
                              <IconButton color="primary" onClick={() => handleEditProduct(product)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                              <Typography variant="subtitle1">Không tìm thấy sản phẩm phù hợp</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Thử chỉnh lại bộ lọc hoặc tạo sản phẩm mới.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {filteredProducts.length > rowsPerPage && (
                  <Stack direction="row" justifyContent="center">
                    <Pagination
                      color="primary"
                      page={page}
                      count={totalPages}
                      onChange={handleChangePage}
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel currentTab={currentTab} value="categories">
          <Card>
            <CardHeader
              title="Danh mục sản phẩm"
              subheader="Quản lý danh mục sản phẩm, icon và mô tả."
              action={
                <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" />} onClick={handleOpenCreateCategory}>
                  Thêm danh mục
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <OutlinedInput
                  value={categorySearch}
                  onChange={(event) => setCategorySearch(event.target.value)}
                  placeholder="Tìm kiếm danh mục..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  }
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Danh mục</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Icon</TableCell>
                        <TableCell>Ngày cập nhật</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category._id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{category.category}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {category.description || 'Chưa có mô tả'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {category.icon ? (
                              <Avatar src={category.icon} alt={category.category} variant="rounded" />
                            ) : (
                              <Chip label="Không icon" size="small" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString('vi-VN') : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton color="primary" onClick={() => handleEditCategory(category)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDeleteCategory(category._id)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredCategories.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                              <Typography variant="subtitle1">Không có danh mục phù hợp</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Hãy thử tìm kiếm khác hoặc tạo danh mục mới.
                              </Typography>
        </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel currentTab={currentTab} value="toppings">
          <Card>
            <CardHeader
              title="Danh sách topping"
              subheader="Quản lý topping kèm theo giá bán và icon."
              action={
                <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" />} onClick={handleOpenCreateTopping}>
                  Thêm topping
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <OutlinedInput
                  value={toppingSearch}
                  onChange={(event) => setToppingSearch(event.target.value)}
                  placeholder="Tìm kiếm topping..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  }
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Topping</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Icon</TableCell>
                        <TableCell>Ngày cập nhật</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredToppings.map((topping) => (
                        <TableRow key={topping._id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{topping.name}</Typography>
                          </TableCell>
                          <TableCell>{currencyFormatter.format(topping.price || 0)}</TableCell>
                          <TableCell>
                            {topping.icon ? (
                              <Avatar src={topping.icon} alt={topping.name} variant="rounded" />
                            ) : (
                              <Chip label="Không icon" size="small" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {topping.updatedAt ? new Date(topping.updatedAt).toLocaleDateString('vi-VN') : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton color="primary" onClick={() => handleEditTopping(topping)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDeleteTopping(topping._id)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredToppings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                              <Typography variant="subtitle1">Không tìm thấy topping phù hợp</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Hãy tạo topping mới để sử dụng cho sản phẩm.
                              </Typography>
      </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel currentTab={currentTab} value="sizes">
          <Card>
            <CardHeader
              title="Danh sách size"
              subheader="Quản lý kích thước, multiplier và dung tích đồ uống."
              action={
                <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" />} onClick={handleOpenCreateSize}>
                  Thêm size
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <OutlinedInput
                  value={sizeSearch}
                  onChange={(event) => setSizeSearch(event.target.value)}
                  placeholder="Tìm kiếm size..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  }
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ký hiệu</TableCell>
                        <TableCell>Tên hiển thị</TableCell>
                        <TableCell>Multiplier</TableCell>
                        <TableCell>Thể tích</TableCell>
                        <TableCell>Ngày cập nhật</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredSizes.map((size) => (
                        <TableRow key={size._id} hover>
                          <TableCell>
                            <Chip label={size.size} color="primary" size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">{size.name}</Typography>
                          </TableCell>
                          <TableCell>{size.multiplier}</TableCell>
                          <TableCell>{size.volume}</TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {size.updatedAt ? new Date(size.updatedAt).toLocaleDateString('vi-VN') : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton color="primary" onClick={() => handleEditSize(size)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDeleteSize(size._id)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredSizes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                              <Typography variant="subtitle1">Không tìm thấy size phù hợp</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Hãy tạo size mới để áp dụng cho sản phẩm.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>
      </Stack>

      <ProductDialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        onSubmit={handleSubmitProduct}
        categories={categories}
        toppings={toppings}
        sizes={sizes}
        initialValue={editingProduct ?? undefined}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={handleCloseCategoryDialog}
        onSubmit={handleSubmitCategory}
        initialValue={editingCategory ?? undefined}
      />

      <ToppingDialog
        open={toppingDialogOpen}
        onClose={handleCloseToppingDialog}
        onSubmit={handleSubmitTopping}
        initialValue={editingTopping ?? undefined}
      />

      <SizeDialog
        open={sizeDialogOpen}
        onClose={handleCloseSizeDialog}
        onSubmit={handleSubmitSize}
        initialValue={editingSize ?? undefined}
        existingSizes={sizes}
      />

      <ProductDetailDialog
        open={!!productDetail}
        product={productDetail}
        onClose={handleCloseProductDetail}
        categoryMap={categoryMap}
        sizeMap={sizeMap}
        toppingMap={toppingMap}
        onEdit={(product) => {
          handleCloseProductDetail();
          handleEditProduct(product);
        }}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type TabPanelProps = {
  value: TabValue;
  currentTab: TabValue;
  children: React.ReactNode;
};

function TabPanel({ currentTab, value, children }: TabPanelProps) {
  if (currentTab !== value) {
    return null;
  }
  return <Box>{children}</Box>;
}

type ProductDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: ProductFormState) => void;
  categories: ICategory[];
  toppings: ITopping[];
  sizes: ISize[];
  initialValue?: ProductFormState;
};

function ProductDialog({
  open,
  onClose,
  onSubmit,
  categories,
  toppings,
  sizes,
  initialValue,
}: ProductDialogProps) {
  const [formState, setFormState] = useState<ProductFormState>(defaultProductForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageKey, setImageKey] = useState(0);
  const [priceInput, setPriceInput] = useState('');

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 0,
      }),
    []
  );

  useEffect(() => {
    if (open) {
      setFormState(
        initialValue
          ? {
              ...defaultProductForm,
              ...initialValue,
              imagePreview: initialValue.image,
              imageFile: null,
            }
          : defaultProductForm
      );
      setErrors({});
      setImageKey((prev) => prev + 1);
      setPriceInput(
        initialValue && initialValue.basePrice
          ? numberFormatter.format(initialValue.basePrice)
          : ''
      );
    }
  }, [initialValue, numberFormatter, open]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    setFormState((prev) => ({
      ...prev,
      status: event.target.value as 'new' | 'old',
    }));
  }, []);

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormState((prev) => {
      if (prev.imagePreview && prev.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.imagePreview);
      }
      return {
        ...prev,
        imageFile: file,
        imagePreview: previewUrl,
      };
    });
  }, []);

  const handleClearImage = useCallback(() => {
    setFormState((prev) => {
      if (prev.imagePreview && prev.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.imagePreview);
      }
      return {
        ...prev,
        imageFile: null,
        imagePreview: '',
        image: '',
      };
    });
  }, []);

  const handlePriceChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value.replace(/\D/g, '');
      const numericValue = rawValue ? Number(rawValue) : 0;
      setPriceInput(rawValue ? numberFormatter.format(numericValue) : '');
      setFormState((prev) => ({
        ...prev,
        basePrice: numericValue,
      }));
    },
    [numberFormatter]
  );

  const handleSubmit = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      nextErrors.name = 'Tên sản phẩm không được bỏ trống';
    }
    if (!(formState.imagePreview || formState.image.trim())) {
      nextErrors.image = 'Cần chọn ảnh sản phẩm';
    }
    if (!formState.basePrice || formState.basePrice <= 0) {
      nextErrors.basePrice = 'Giá cơ bản phải lớn hơn 0';
    }
    if (!formState.categoryId.length) {
      nextErrors.categoryId = 'Chọn ít nhất một danh mục';
    }
    if (!formState.sizeOptions.length) {
      nextErrors.sizeOptions = 'Chọn ít nhất một size';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const { imageFile, imagePreview, ...rest } = formState;
    const nextImage = imagePreview || formState.image;
    onSubmit({ ...rest, image: nextImage });
  }, [formState, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{formState._id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <TextField
                label="Tên sản phẩm"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />
              <TextField
                label="Mô tả"
                name="description"
                value={formState.description ?? ''}
                onChange={handleInputChange}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Giá cơ bản"
                name="basePrice"
                value={priceInput}
                onChange={handlePriceChange}
                error={Boolean(errors.basePrice)}
                helperText={errors.basePrice ?? 'Đơn vị: VNĐ'}
                fullWidth
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                select
                label="Trạng thái"
                value={formState.status}
                onChange={handleStatusChange}
                fullWidth
              >
                <MenuItem value="new">Món mới</MenuItem>
                <MenuItem value="old">Món cũ</MenuItem>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={formState.isBanned ?? false}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        isBanned: event.target.checked,
                      }))
                    }
                  />
                }
                label="Khoá sản phẩm (isBanned)"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2} sx={{ height: '100%' }}>
        <Box
          sx={{
                  borderRadius: 2,
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  p: 2,
                  textAlign: 'center',
                  flexGrow: 1,
            display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
        }}
      >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Xem trước ảnh sản phẩm
                </Typography>
                {formState.imagePreview || formState.image ? (
        <Box
                    component="img"
                    src={formState.imagePreview || formState.image}
                    alt={formState.name || 'preview'}
          sx={{
                      width: '100%',
                      borderRadius: 1,
                      objectFit: 'cover',
                      aspectRatio: '4 / 3',
                    }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:image-bold" width={40} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Chưa có ảnh, vui lòng tải ảnh sản phẩm từ máy của bạn.
                    </Typography>
                  </Stack>
                )}
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Iconify icon="solar:upload-square-bold" />}
                >
                  Tải ảnh lên
                  <input
                    key={imageKey}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {(formState.imagePreview || formState.imageFile) && (
                  <Button color="error" onClick={handleClearImage}>
                    Gỡ ảnh
                  </Button>
                )}
              </Stack>
              <Stack spacing={0.5}>
                {formState.imageFile && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Đã chọn: {formState.imageFile.name}
                  </Typography>
                )}
                {!formState.imageFile && formState.image && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Đang sử dụng ảnh hiện có.
                  </Typography>
                )}
                {errors.image && (
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {errors.image}
                  </Typography>
                )}
              </Stack>

              <Autocomplete
                multiple
                options={categories}
                value={categories.filter((category) => formState.categoryId.includes(category._id))}
                onChange={(_, value) =>
                  setFormState((prev) => ({
                    ...prev,
                    categoryId: value.map((item) => item._id),
                  }))
                }
                getOptionLabel={(option) => option.category}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip {...getTagProps({ index })} label={option.category} />)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh mục"
                    placeholder="Chọn danh mục..."
                    error={Boolean(errors.categoryId)}
                    helperText={errors.categoryId}
                  />
                )}
              />

              <Autocomplete
                multiple
                options={sizes}
                value={sizes.filter((size) => formState.sizeOptions.includes(size._id))}
                onChange={(_, value) =>
                  setFormState((prev) => ({
                    ...prev,
                    sizeOptions: value.map((item) => item._id),
                  }))
                }
                getOptionLabel={(option) => `${option.size} - ${option.name}`}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={`${option.size} - ${option.name}`} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kích cỡ (sizeOptions)"
                    placeholder="Chọn kích cỡ..."
                    error={Boolean(errors.sizeOptions)}
                    helperText={errors.sizeOptions}
                  />
                )}
              />

              <Autocomplete
                multiple
                options={toppings}
                value={toppings.filter((topping) => formState.toppingOptions.includes(topping._id))}
                onChange={(_, value) =>
                  setFormState((prev) => ({
                    ...prev,
                    toppingOptions: value.map((item) => item._id),
                  }))
                }
                getOptionLabel={(option) => option.name}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip {...getTagProps({ index })} label={option.name} />)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Topping"
                    placeholder="Chọn topping..."
                  />
                )}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formState._id ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type CategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: CategoryFormState) => void;
  initialValue?: CategoryFormState;
};

function CategoryDialog({ open, onClose, onSubmit, initialValue }: CategoryDialogProps) {
  const [formState, setFormState] = useState<CategoryFormState>(defaultCategoryForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormState(initialValue ? { ...defaultCategoryForm, ...initialValue } : defaultCategoryForm);
      setErrors({});
    }
  }, [initialValue, open]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formState.category.trim()) {
      nextErrors.category = 'Tên danh mục không được bỏ trống';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit(formState);
  }, [formState, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formState._id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Tên danh mục"
            name="category"
            value={formState.category}
            onChange={handleChange}
            error={Boolean(errors.category)}
            helperText={errors.category}
            fullWidth
          />
          <TextField
            label="URL icon"
            name="icon"
            value={formState.icon}
            onChange={handleChange}
            helperText="Tải icon lên host và dán URL hoặc để trống"
            fullWidth
          />
          <TextField
            label="Mô tả"
            name="description"
            value={formState.description ?? ''}
            onChange={handleChange}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formState._id ? 'Lưu thay đổi' : 'Thêm danh mục'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ToppingDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: ToppingFormState) => void;
  initialValue?: ToppingFormState;
};

function ToppingDialog({ open, onClose, onSubmit, initialValue }: ToppingDialogProps) {
  const [formState, setFormState] = useState<ToppingFormState>(defaultToppingForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormState(initialValue ? { ...defaultToppingForm, ...initialValue } : defaultToppingForm);
      setErrors({});
    }
  }, [initialValue, open]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      nextErrors.name = 'Tên topping không được bỏ trống';
    }
    if (!formState.price || formState.price <= 0) {
      nextErrors.price = 'Giá topping phải lớn hơn 0';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit(formState);
  }, [formState, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formState._id ? 'Chỉnh sửa topping' : 'Thêm topping mới'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Tên topping"
            name="name"
            value={formState.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Giá"
            name="price"
            type="number"
            value={formState.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price ?? 'Đơn vị: VNĐ'}
            fullWidth
          />
          <TextField
            label="URL icon"
            name="icon"
            value={formState.icon}
            onChange={handleChange}
            helperText="Có thể để trống nếu chưa có icon"
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formState._id ? 'Lưu thay đổi' : 'Thêm topping'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type SizeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: SizeFormState) => void;
  initialValue?: SizeFormState;
  existingSizes: ISize[];
};

function SizeDialog({ open, onClose, onSubmit, initialValue, existingSizes }: SizeDialogProps) {
  const [formState, setFormState] = useState<SizeFormState>(defaultSizeForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormState(initialValue ? { ...defaultSizeForm, ...initialValue } : defaultSizeForm);
      setErrors({});
    }
  }, [initialValue, open]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'multiplier' ? Number(value) : value,
    }));
  }, []);

  const handleSizeChange = useCallback((event: SelectChangeEvent<string>) => {
    setFormState((prev) => ({
      ...prev,
      size: event.target.value as 'S' | 'M' | 'L',
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      nextErrors.name = 'Tên size không được bỏ trống';
    }
    if (!formState.volume.trim()) {
      nextErrors.volume = 'Thể tích không được bỏ trống';
    }
    if (!formState.multiplier || formState.multiplier <= 0) {
      nextErrors.multiplier = 'Multiplier phải lớn hơn 0';
    }
    const duplicateSize = existingSizes.some(
      (item) => item.size === formState.size && item._id !== formState._id
    );
    if (duplicateSize) {
      nextErrors.size = 'Ký hiệu size đã tồn tại';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit(formState);
  }, [existingSizes, formState, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formState._id ? 'Chỉnh sửa size' : 'Thêm size mới'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Ký hiệu size"
            value={formState.size}
            onChange={handleSizeChange}
            error={Boolean(errors.size)}
            helperText={errors.size ?? 'Theo schema backend: S, M, L'}
            fullWidth
          >
            <MenuItem value="S">S - Small</MenuItem>
            <MenuItem value="M">M - Medium</MenuItem>
            <MenuItem value="L">L - Large</MenuItem>
          </TextField>
          <TextField
            label="Tên hiển thị"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Multiplier"
            name="multiplier"
            type="number"
            value={formState.multiplier}
            onChange={handleInputChange}
            error={Boolean(errors.multiplier)}
            helperText={errors.multiplier ?? 'Nhân với giá gốc để ra giá theo size'}
            fullWidth
          />
          <TextField
            label="Thể tích"
            name="volume"
            value={formState.volume}
            onChange={handleInputChange}
            error={Boolean(errors.volume)}
            helperText={errors.volume ?? 'Ví dụ: 350ml, 450ml'}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formState._id ? 'Lưu thay đổi' : 'Thêm size'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ProductDetailDialogProps = {
  open: boolean;
  product: IProductBE | null;
  onClose: () => void;
  onEdit: (product: IProductBE) => void;
  categoryMap: Map<string, ICategory>;
  sizeMap: Map<string, ISize>;
  toppingMap: Map<string, ITopping>;
};

function ProductDetailDialog({
  open,
  product,
  onClose,
  onEdit,
  categoryMap,
  sizeMap,
  toppingMap,
}: ProductDetailDialogProps) {
  if (!product) {
    return null;
  }

  const categoryChips = product.categoryId.map((categoryId) => {
    const category = categoryMap.get(categoryId);
    return (
      <Chip
        key={categoryId}
        label={category?.category ?? 'Đã xoá'}
        color={category ? 'primary' : 'default'}
        size="small"
      />
    );
  });

  const sizeChips = product.sizeOptions.map((sizeId) => {
    const size = sizeMap.get(sizeId);
    return (
      <Chip
        key={sizeId}
        label={size ? `${size.size} - ${size.name}` : 'Đã xoá'}
        color={size ? 'info' : 'default'}
        size="small"
      />
    );
  });

  const toppingChips = product.toppingOptions.map((toppingId) => {
    const topping = toppingMap.get(toppingId);
    return (
      <Chip
        key={toppingId}
        label={topping ? topping.name : 'Đã xoá'}
        color={topping ? 'secondary' : 'default'}
        size="small"
      />
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: 1,
                borderRadius: 2,
                objectFit: 'cover',
                aspectRatio: '4 / 3',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
              <Chip
                label={product.status === 'new' ? 'Món mới' : 'Món cũ'}
                color={product.status === 'new' ? 'success' : 'default'}
                size="small"
              />
              <Chip
                label={product.isBanned ? 'Đang khoá' : 'Đang mở bán'}
                color={product.isBanned ? 'error' : 'success'}
                size="small"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">{product.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Stack>
        </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Mô tả
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.description || 'Chưa có mô tả'}
                </Typography>
      </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Giá cơ bản:</Typography>
                <Typography variant="body1">{currencyFormatter.format(product.basePrice || 0)}</Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Danh mục</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {categoryChips.length ? categoryChips : (
                    <Chip label="Chưa gán danh mục" variant="outlined" size="small" />
                  )}
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Size hỗ trợ</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {sizeChips.length ? sizeChips : (
                    <Chip label="Chưa gán size" variant="outlined" size="small" />
                  )}
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Topping hỗ trợ</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {toppingChips.length ? toppingChips : (
                    <Chip label="Không có topping" variant="outlined" size="small" />
                  )}
                </Stack>
              </Stack>

              {product.storeId && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">Store ID:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {product.storeId}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Grid>
      </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="contained" onClick={() => onEdit(product)}>
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

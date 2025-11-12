import {
  _id,
  _oid,
  _phone,
  _price,
  _times,
  _boolean,
  _company,
  _fullName,
  _promoCode,
  _taskNames,
  _postTitles,
  _promoImage,
  _description,
  _orderNumber,
  _promoExpiry,
  _productNames,
  _promoPercent,
} from './_mock';




// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? 'active' : 'banned',
  role:
    [
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index] || 'UI Designer',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

export const _traffic = [
  {
    value: 'facebook',
    label: 'Facebook',
    total: 19500,
  },
  {
    value: 'google',
    label: 'Google',
    total: 91200,
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: 69800,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: 84900,
  },
];

export const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Minimal',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
];

// ----------------------------------------------------------------------
// Promotions mock – khớp schema backend
// {
//   title: string;
//   description?: string;
//   promotionCode: string;    // unique, "TCC-XXXXXX"
//   discountPercent: number;  // 20 => 20%
//   expiryDate: string;       // MM/DD/YYYY (string OK, component đã format)
//   minOrder: number;         // default 0
//   isLock: boolean;          // default false
//   image: string;            // url
//   requiredPoints: number;   // default 0
// }

export const _promotions = [...Array(12)].map((_, index) => {
  const setIndex = index;

  return {
    id: _id(setIndex),
    title: 'GIFT CARD', // heading nhỏ trên thẻ
    description:
      setIndex % 2 === 0 ? 'Any Purchase' : _description(setIndex), // mô tả ngắn
    promotionCode: _promoCode(setIndex), // ✅ TCC-xxxxxx
    discountPercent: _promoPercent(setIndex),
    expiryDate: _promoExpiry(setIndex), // string MM/DD/YYYY
    minOrder:
      [0, 100000, 0, 200000, 50000, 0][setIndex % 6], // có/không đơn tối thiểu
    isLock: [false, false, true, false, false, false][setIndex % 6], // vài item bị khóa
    image: _promoImage(setIndex), // nền card
    requiredPoints: [0, 0, 100, 0, 200, 0][setIndex % 6], // pts để đổi (nếu có)
    // timestamps có thể thêm nếu cần: createdAt/updatedAt
  };
});


export const _orders = [...Array(12)].map((_, index) => {
  const qty = (index % 3) + 1;
  const basePrice = _price(index);
  const toppings = [
    { id: _id(index + 100), name: 'Thạch phô mai' },
    { id: _id(index + 200), name: 'Kem cheese' },
  ].slice(0, (index % 2) + 1);

  const subtotal = basePrice * qty;
  const deliveryFee = 15000;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + deliveryFee + tax;

  return {
    id: _id(index),
    userId: _id((index % 5) + 50), // 5 user demo
    orderNumber: _orderNumber(index),
    items: [
      {
        productId: _id(index),
        name: _productNames(index),
        size: ['S', 'M', 'L'][index % 3],
        toppings,
        quantity: qty,
        price: basePrice,
      },
    ],
    subtotal,
    deliveryFee,
    tax,
    total,
    deliveryAddress: `Số ${index + 12}, Đường Tôn Đức Thắng, Đà Nẵng`,
    phone: _phone(index),
    paymentMethod: index % 2 === 0 ? 'cod' : 'vietqr',
    qrCodeUrl:
      index % 2 === 0 ? '' : 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payme',
    deliveryTime: '25-35 phút',
    status: ['pending', 'processing', 'preparing', 'delivering', 'completed'][index % 5],
    cancelReason: index % 7 === 0 ? 'Khách yêu cầu huỷ' : null,
    createdAt: new Date(Date.now() - index * 86400000),
  };
});


// =====================
// CATEGORY (backend)
// =====================
export type ICategory = {
  _id: string;                // ObjectId mock
  category: string;
  icon: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export const _categories: ICategory[] = [
  {
    _id: _oid(1000),
    category: 'Coffee',
    icon: '/assets/icons/categories/ic-coffee.svg',
    description: 'Cà phê rang xay, espresso, latte, cappuccino...',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    _id: _oid(1001),
    category: 'Milk Tea',
    icon: '/assets/icons/categories/ic-milktea.svg',
    description: 'Trà sữa trân châu, macchiato, kem cheese…',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    _id: _oid(1002),
    category: 'Fruit Tea',
    icon: '/assets/icons/categories/ic-fruit-tea.svg',
    description: 'Trà trái cây tươi mát cho ngày năng động.',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    _id: _oid(1003),
    category: 'Smoothies',
    icon: '/assets/icons/categories/ic-smoothie.svg',
    description: 'Sinh tố hoa quả, yogurt, detox.',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    _id: _oid(1004),
    category: 'Bakery',
    icon: '/assets/icons/categories/ic-bakery.svg',
    description: 'Bánh ngọt ăn kèm đồ uống.',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    _id: _oid(1005),
    category: 'New',
    icon: '/assets/icons/categories/ic-new.svg',
    description: 'Danh mục các món mới ra mắt.',
    createdAt: '2024-04-09T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
];

// =====================
// PRODUCT (backend)
// =====================
export type IProductBE = {
  _id: string;                          // ObjectId mock
  name: string;
  description?: string;
  basePrice: number;
  image: string;
  status: 'new' | 'old';
  rating: number;                       // 0..5
  sizeOptions: string[];                // ObjectId[]
  toppingOptions: string[];             // ObjectId[]
  storeId?: string;                     // ObjectId
  categoryId: string[];                 // ObjectId[]
  isBanned?: boolean;
};

// =====================
// SIZE (backend)
// =====================
export type ISize = {
  _id: string;
  size: 'S' | 'M' | 'L';
  name: string;
  multiplier: number;
  volume: string;
  createdAt?: string;
  updatedAt?: string;
};

export const _sizes: ISize[] = [
  {
    _id: _oid(2000),
    size: 'S',
    name: 'Small',
    multiplier: 1,
    volume: '350ml',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
  {
    _id: _oid(2001),
    size: 'M',
    name: 'Medium',
    multiplier: 1.2,
    volume: '450ml',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
  {
    _id: _oid(2002),
    size: 'L',
    name: 'Large',
    multiplier: 1.5,
    volume: '550ml',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
];

// =====================
// TOPPING (backend)
// =====================
export type ITopping = {
  _id: string;
  name: string;
  price: number;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
};

export const _toppings: ITopping[] = [
  {
    _id: _oid(3000),
    name: 'Pearl',
    price: 7000,
    icon: '/assets/icons/toppings/ic-pearl.svg',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
  {
    _id: _oid(3001),
    name: 'Grass Jelly',
    price: 8000,
    icon: '/assets/icons/toppings/ic-jelly.svg',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
  {
    _id: _oid(3002),
    name: 'Cheese Foam',
    price: 12000,
    icon: '/assets/icons/toppings/ic-cheese.svg',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
  {
    _id: _oid(3003),
    name: 'Flan',
    price: 15000,
    icon: '/assets/icons/toppings/ic-flan.svg',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z',
  },
];

// Store mock id
const STORE_ID: string = _oid(9000);

// Lấy ids từ mock, có kiểu để tránh implicit any
const SIZE_IDS: string[] = _sizes.map((s: ISize) => s._id);
const TOPPING_IDS: string[] = _toppings.map((t: ITopping) => t._id);



export const _productsBE: IProductBE[] = [...Array(12)].map((_, index) => {
  const setIndex = index + 1;
  // gán category theo nhóm + luôn có thêm cate 'New' nếu status = 'new'
  const baseCate =
    (setIndex % 4 === 1 && _categories[0]._id) || // Coffee
    (setIndex % 4 === 2 && _categories[1]._id) || // Milk Tea
    (setIndex % 4 === 3 && _categories[2]._id) || // Fruit Tea
    _categories[3]._id;                            // Smoothies

  const status: 'new' | 'old' = setIndex % 3 === 0 ? 'new' : 'old';

  const categoryId =
    status === 'new' ? [baseCate, _categories[5]._id] : [baseCate];

  return {
    _id: _oid(5000 + index),
    name: _productNames(index),
    description: _description(index),
    basePrice: Math.round((_price(index) || 30) * 1000),
    image: `/assets/images/product/product-${setIndex}.webp`,
    status,
    rating: Number((4 + ((index % 10) / 10)).toFixed(1)), // ~4.0..4.9
    sizeOptions: SIZE_IDS.slice(0, (index % 3) + 1),
    toppingOptions: TOPPING_IDS.slice(0, (index % 4) + 1),
    storeId: STORE_ID,
    categoryId,
    isBanned: (index % 11 === 0) ? true : false,
  };
});

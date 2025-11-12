# Authentication Setup Guide

## Overview
Hệ thống authentication đã được tích hợp với axios, Redux, và React Router.

## Features
- ✅ Login với email/username và password
- ✅ Auto refresh token khi access token hết hạn
- ✅ Protected routes (yêu cầu authentication)
- ✅ Public routes (redirect nếu đã authenticated)
- ✅ Auto redirect khi không có session
- ✅ Logout với API call

## Configuration

### API URL
Mặc định API URL là `http://localhost:8080`. Để thay đổi, tạo file `.env` trong root directory:

```env
VITE_API_URL=http://localhost:8080
```

## Backend API Endpoints

Hệ thống expect các endpoints sau:

- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (requires authentication)

### Login Request
```json
{
  "email": "user@example.com",  // hoặc "username": "username"
  "password": "password"
}
```

### Login Response
```json
{
  "user": {
    "id": "user-id",
    "username": "username",
    "fullname": "Full Name",
    "email": "user@example.com",
    "role": "admin"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### Refresh Token Response
```json
{
  "accessToken": "new-jwt-access-token"
}
```

## How It Works

### 1. Login Flow
1. User nhập email/username và password
2. Gọi API `/api/auth/login`
3. Lưu `accessToken` và `refreshToken` vào localStorage
4. Update Redux state với user info và tokens
5. Redirect về dashboard (`/`)

### 2. Protected Routes
- Tất cả routes trong dashboard (/, /user, /products, etc.) được bảo vệ bởi `ProtectedRoute`
- Nếu không có token, tự động redirect về `/sign-in`

### 3. Public Routes
- Route `/sign-in` được bảo vệ bởi `PublicRoute`
- Nếu đã có token, tự động redirect về `/`

### 4. Token Refresh
- Khi API call nhận 401 (Unauthorized)
- Tự động gọi `/api/auth/refresh` để lấy access token mới
- Retry request ban đầu với token mới
- Nếu refresh fails, logout và redirect về `/sign-in`

### 5. Logout
- Gọi API `/api/auth/logout`
- Clear tokens khỏi localStorage
- Clear Redux state
- Redirect về `/sign-in`

## Usage

### Login
```tsx
import { useAppDispatch } from 'src/store/hooks';
import { login } from 'src/store/slices/authSlice';

const dispatch = useAppDispatch();

await dispatch(login({
  email: 'user@example.com',
  password: 'password'
}));
```

### Logout
```tsx
import { useAppDispatch } from 'src/store/hooks';
import { logout } from 'src/store/slices/authSlice';

const dispatch = useAppDispatch();

await dispatch(logout());
```

### Check Auth State
```tsx
import { useAppSelector } from 'src/store/hooks';

const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
```

### Make API Calls
```tsx
import axiosInstance from 'src/utils/axios';

// Token sẽ tự động được thêm vào header
const response = await axiosInstance.get('/api/users');
```

## Files Structure

```
src/
├── components/
│   └── auth/
│       ├── protected-route.tsx    # ProtectedRoute component
│       └── index.ts
├── services/
│   └── auth.service.ts            # Auth API calls
├── store/
│   └── slices/
│       └── authSlice.ts           # Auth Redux slice
├── utils/
│   └── axios.ts                   # Axios instance with interceptors
└── config-global.ts               # Config với API URL
```

## Notes

1. **CORS**: Backend cần config CORS để cho phép frontend origin
2. **Cookies**: Backend có thể lưu refreshToken trong httpOnly cookie (sử dụng `withCredentials: true`)
3. **Token Storage**: AccessToken và RefreshToken được lưu trong localStorage
4. **Auto Redirect**: Khi app load, nếu không có token → redirect về `/sign-in`
5. **Token Refresh**: Tự động refresh token khi nhận 401, không cần user action

## Troubleshooting

### Token không được refresh
- Kiểm tra backend có trả về refreshToken trong cookie hoặc response
- Kiểm tra CORS configuration
- Kiểm tra `withCredentials: true` trong axios config

### Redirect loop
- Kiểm tra ProtectedRoute và PublicRoute logic
- Kiểm tra auth state trong Redux
- Kiểm tra localStorage có token hay không

### 401 errors
- Kiểm tra token có được thêm vào header không
- Kiểm tra token format (Bearer token)
- Kiểm tra backend có verify token đúng không


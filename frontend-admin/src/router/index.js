import { createRouter, createWebHistory } from 'vue-router';
import BookManagement from '@/views/BookManagement.vue';
import BookForm from '@/components/BookForm.vue';
import ReaderManagement from '@/views/ReaderManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';
import EmployeeManagement from '@/views/EmployeeManagement.vue';
import BorrowManagement from '@/views/BorrowManagement.vue';
import EmployeeForm from '@/components/EmployeeForm.vue';
import PublisherForm from '@/components/PublisherForm.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/sach',
    name: 'BookManagement',
    component: BookManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/sach/them',
    name: 'BookAdd',
    component: BookForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/sach/sua/:MaSach',
    name: 'BookEdit',
    component: BookForm,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/docgia',
    name: 'ReaderManagement',
    component: ReaderManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhaxuatban',
    name: 'PublisherManagement',
    component: PublisherManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhaxuatban/them',
    name: 'PublisherAdd',
    component: PublisherForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhaxuatban/sua/:MaNXB',
    name: 'PublisherEdit',
    component: PublisherForm,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhanvien',
    name: 'EmployeeManagement',
    component: EmployeeManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhanvien/them',
    name: 'EmployeeAdd',
    component: EmployeeForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/nhanvien/sua/:MSNV',
    name: 'EmployeeEdit',
    component: EmployeeForm,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/muon',
    name: 'BorrowManagement',
    component: BorrowManagement,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard để kiểm tra xác thực
router.beforeEach((to, from, next) => {
  // Kiểm tra xem route có yêu cầu xác thực không
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const loggedIn = localStorage.getItem('token');

  if (requiresAuth && !loggedIn) {
    // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập, chuyển hướng đến trang Login
    next({ name: 'Login' });
  } else if (to.name === 'Login' && loggedIn) {
    // Nếu người dùng đã đăng nhập và cố gắng truy cập trang Login, chuyển hướng đến trang quản lý sách
    next({ name: 'BookManagement' });
  } else {
    // Cho phép truy cập
    next();
  }
});

export default router;
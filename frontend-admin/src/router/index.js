import { createRouter, createWebHistory } from 'vue-router';
import BookManagement from '@/views/BookManagement.vue';
import BookForm from '@/components/BookForm.vue';
import ReaderManagement from '@/views/ReaderManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';
import EmployeeManagement from '@/views/EmployeeManagement.vue';
import BorrowManagement from '@/views/BorrowManagement.vue';
import EmployeeForm from '@/components/EmployeeForm.vue';

const routes = [
  {
    path: '/',
    redirect: '/sach',
  },
  {
    path: '/sach',
    name: 'BookManagement',
    component: BookManagement,
  },
  {
    path: '/sach/them',
    name: 'BookAdd',
    component: BookForm,
  },
  {
    path: '/sach/sua/:MaSach',
    name: 'BookEdit',
    component: BookForm,
    props: true,
  },
  {
    path: '/docgia',
    name: 'ReaderManagement',
    component: ReaderManagement,
  },
  {
    path: '/nhaxuatban',
    name: 'PublisherManagement',
    component: PublisherManagement,
  },
  {
    path: '/nhanvien',
    name: 'EmployeeManagement',
    component: EmployeeManagement,
  },
  {
    path: '/nhanvien/them',
    name: 'EmployeeAdd',
    component: EmployeeForm,
  },
  {
    path: '/nhanvien/sua/:MSNV',
    name: 'EmployeeEdit',
    component: EmployeeForm,
    props: true,
  },
  {
    path: '/muon',
    name: 'BorrowManagement',
    component: BorrowManagement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
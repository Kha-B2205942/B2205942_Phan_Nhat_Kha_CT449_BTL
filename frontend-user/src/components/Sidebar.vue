<template>
  <div class="sidebar p-3 d-flex flex-column" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-header d-flex align-items-center mb-4">
      <div class="brand d-flex align-items-center flex-grow-1 overflow-hidden">
        <i class="fa-solid fa-book-open-reader fa-2x text-primary me-3 flex-shrink-0" style="width: 32px;"></i>
        <div class="brand-text-wrapper">
          <h5 class="brand-name fw-bold text-truncate">Thư Viện</h5>
          <span class="user-greeting small text-truncate">Xin chào, {{ authStore.user.HoTen }}</span>
        </div>
      </div>
      <button @click="toggleSidebar" class="btn btn-icon toggle-btn" title="Toggle Sidebar">
        <i class="fa-solid" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <ul class="nav flex-column flex-grow-1">
      <li class="nav-item" v-for="item in menu" :key="item.text">
        <router-link
          :to="item.to"
          class="nav-link d-flex align-items-center py-2 px-3 rounded mb-1"
          :class="{ active: isActive(item.to) }"
          :title="isCollapsed ? item.text : ''"
        >
          <i :class="item.icon" class="nav-icon"></i> 
          <span class="nav-text">{{ item.text }}</span>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer mt-auto">
        <a href="#" @click.prevent="handleLogout" class="nav-link d-flex align-items-center py-2 px-3 rounded mb-1" :title="isCollapsed ? 'Đăng xuất' : ''">
            <i class="fa-solid fa-right-from-bracket nav-icon"></i>
            <span class="nav-text">Đăng xuất</span>
        </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
    authStore.logout();
  }
};

const emit = defineEmits(['toggle']);
const route = useRoute();
const isCollapsed = ref(false);

const menu = [
  { text: 'Trang chủ', to: '/', icon: 'fa-solid fa-house' },
  { text: 'Khám phá sách', to: '/explore', icon: 'fa-solid fa-compass' },
  { text: 'Lịch sử mượn', to: '/history', icon: 'fa-solid fa-book-bookmark' },
  { text: 'Cá nhân', to: '/profile', icon: 'fa-solid fa-gear' }
];

const isActive = (path) => {
  return route.path === path;
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle', isCollapsed.value);
};
</script>

<style scoped>
.sidebar {
  position: fixed; /* Ghim sidebar vào màn hình */
  top: 0;
  left: 0;
  height: 100vh; /* Luôn cao bằng màn hình */
  z-index: 1030; /* Đảm bảo sidebar nằm trên các thành phần khác */
  background-color:white;
  border-right: 1px solid #dee2e6;
  width: 250px;
  transition: width 0.3s ease;
}

.nav-link {
  color: #495057; /* Màu chữ xám đậm cho dễ đọc */
}

.nav-link:not(.active):hover {
  background-color: #e9ecef; /* Màu nền khi di chuột */
  color: #212529;
}

.nav-link.active {
  background: #e9f2ff; /* Màu nền xanh nhạt cho mục đang active */
  color: #0a58ca !important; /* Màu chữ xanh đậm */
  font-weight: 500;
}
.sidebar-footer .nav-link:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
  font-weight: 500;
}


.btn-icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.toggle-btn:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.nav-icon {
  width: 24px;
  text-align: center;
  transition: margin 0.3s ease;
}

.nav-text {
  margin-left: 0.5rem;
  opacity: 1;
  transition: opacity 0.2s ease, margin-left 0.2s ease;
}

.brand-name {
  opacity: 1;
  white-space: nowrap;
  color: #212529; /* Màu chữ đen cho tên thương hiệu */
  transition: opacity 0.2s ease;
}

.user-greeting {
  display: block;
  line-height: 1.2;
  transition: opacity 0.2s ease;
}

/* Collapsed state */
.sidebar.is-collapsed {
  width: 80px;
}

.sidebar.is-collapsed .brand-name,
.sidebar.is-collapsed .nav-text,
.sidebar.is-collapsed .user-greeting {
  opacity: 0;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 0;
}

.sidebar.is-collapsed .nav-link {
  justify-content: center;
}

.sidebar.is-collapsed .nav-icon {
  margin-right: 0 !important;
}
</style>

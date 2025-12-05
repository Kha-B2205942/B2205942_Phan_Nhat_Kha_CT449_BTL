<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style=" background: linear-gradient(to bottom left, #37474F,#1F3A5F);">
    <div class="container-fluid">
      <!-- Tiêu đề -->
      <router-link class="navbar-brand fw-bold" to="/sach">
        <i ></i> QUẢN LÝ THƯ VIỆN
      </router-link>
      
      <!-- Nút Toggler cho màn hình nhỏ -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <!-- Menu -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="item in menuItems" :key="item.path" class="nav-item">
            <router-link :to="item.path" class="nav-link" active-class="active">
              <i :class="item.icon + ' me-1'"></i>
              {{ item.label }}
            </router-link>
          </li>
        </ul>
        
        <!-- Đăng xuất -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="#" @click.prevent="handleLogout" class="nav-link">
              <i class="fa-solid fa-right-from-bracket me-1"></i>
              Đăng xuất
            </a>
          </li>
        
      </ul>
    </div>
  </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const menuItems = [
  { label: "Quản lý Sách", path: "/sach", icon: "fa-solid fa-book" },
  { label: "Quản lý Mượn Sách", path: "/muon", icon: "fa-solid fa-handshake" },
  { label: "Quản lý Nhân Viên", path: "/nhanvien", icon: "fa-solid fa-user-tie" },
  { label: "Quản lý Nhà Xuất Bản", path: "/nhaxuatban", icon: "fa-solid fa-building" },
  { label: "Quản lý Độc Giả", path: "/docgia", icon: "fa-solid fa-users" },
];

const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
    localStorage.removeItem('token');
    router.push({ name: 'Login' }).then(() => window.location.reload());
  }
};
</script>

<style scoped>
</style>

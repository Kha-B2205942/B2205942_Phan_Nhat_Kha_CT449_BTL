<template>
  <div class="sidebar d-flex flex-column text-white p-3">
    <!-- Tiêu đề -->
    <h5 class="fw-bold mb-4 text-center">
      <i class="fa-solid fa-book me-2"></i> QUẢN LÝ THƯ VIỆN
    </h5>

    <!-- Chức năng ứng dụng -->
    <div class="mb-2">
      <p class="text-uppercase small fw-bold opacity-75">Chức năng ứng dụng</p>
    </div>

    <!-- Menu -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li v-for="item in menuItems" :key="item.path" class="nav-item">
        <router-link
          :to="item.path"
          class="nav-link text-white d-flex align-items-center py-2 px-3 rounded-3"
          active-class="active-link"
        >
          <i :class="item.icon + ' me-2'"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Nút thu gọn -->
    <div class="mt-auto text-center">
      <button class="btn btn-outline-light btn-sm rounded-circle" @click="toggleCollapse">
        <i class="fa-solid" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(false);

const menuItems = [
  { label: "Quản lý Sách", path: "/sach", icon: "fa-solid fa-book" },
  { label: "Quản lý Mượn Sách", path: "/muon", icon: "fa-solid fa-handshake" },
  { label: "Quản lý Nhân Viên", path: "/nhanvien", icon: "fa-solid fa-user-tie" },
  { label: "Quản lý Nhà Xuất Bản", path: "/nhaxuatban", icon: "fa-solid fa-building" },
  { label: "Quản lý Độc Giả", path: "/docgia", icon: "fa-solid fa-users" },
];

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  const sidebar = document.querySelector(".sidebar");
  if (isCollapsed.value) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background-color: #323a75; 
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar .nav-link {
  color: #ffffffb3;
  font-size: 15px;
  transition: background 0.2s;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.sidebar .active-link {
  background-color: #0d6efd;
  color: #fff !important;
  font-weight: 600;
}

.sidebar.collapsed .nav-link span {
  display: none;
}

.sidebar.collapsed h5 {
  font-size: 0;
  opacity: 0;
  height: 0;
}

.sidebar.collapsed button {
  transform: rotate(180deg);
}
</style>

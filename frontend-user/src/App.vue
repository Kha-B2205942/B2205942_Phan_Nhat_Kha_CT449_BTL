<script setup>
import { RouterView } from 'vue-router';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();
const authStore = useAuthStore();

// Kiểm tra xem có phải là trang công khai không (đăng nhập, đăng ký)
const isPublicPage = computed(() => route.meta.public);

// Chỉ hiển thị layout chính khi người dùng đã đăng nhập và không phải trang công khai
const showMainLayout = computed(() => authStore.user && !isPublicPage.value);

const isSidebarCollapsed = ref(false);

const handleSidebarToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};
</script>

<template>
  <!-- Nếu là trang công khai hoặc chưa đăng nhập, chỉ hiển thị nội dung trang -->
  <div v-if="!showMainLayout">
    <RouterView />
  </div>
  <!-- Nếu đã đăng nhập, hiển thị layout chính với Sidebar -->
  <div v-else class="main-layout">
    <Sidebar @toggle="handleSidebarToggle" />
    <main class="main-content" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <div class="container-fluid p-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
}

.main-content {
  margin-left: 250px; /* Bằng chiều rộng của sidebar */
  transition: margin-left 0.3s ease;
}

.main-content.is-collapsed {
  margin-left: 80px; /* Bằng chiều rộng của sidebar khi thu gọn */
}
</style>
<template>
  <!-- Nếu là trang đăng nhập, chỉ hiển thị nội dung của trang đó -->
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <!-- Với các trang khác, hiển thị layout chính với Sidebar -->
  <div v-else class="d-flex">
    <Sidebar v-if="showSidebar" />
    <div class="flex-grow-1 p-4" style="min-height: 100vh;">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const isLoginPage = computed(() => route.name === 'Login');
const showSidebar = computed(() => !!localStorage.getItem('token'));
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
 
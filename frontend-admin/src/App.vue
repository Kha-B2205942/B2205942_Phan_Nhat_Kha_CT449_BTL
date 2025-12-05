<template>
  <!-- Nếu là trang đăng nhập, chỉ hiển thị nội dung của trang đó -->
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <!-- Với các trang khác, hiển thị layout chính với Navbar -->
  <div v-else>
    <Navbar v-if="showNavbar" />
    <!-- Vùng chứa nội dung chính của trang -->
    <div class="container-fluid p-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Sidebar.vue'; 

const route = useRoute();
const isLoginPage = computed(() => route.name === 'Login');
const showNavbar = computed(() => !!localStorage.getItem('token'));
</script>
<style>
body {
  min-height: 100vh;
  background: linear-gradient(to top, #f0f2f5, #d9e2ec);
  background-attachment: fixed;
}
</style>
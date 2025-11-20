<template>
  <div class="d-flex">
    <Sidebar />
    <div class="flex-grow-1 p-4 bg-light" style="min-height: 100vh;">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
 
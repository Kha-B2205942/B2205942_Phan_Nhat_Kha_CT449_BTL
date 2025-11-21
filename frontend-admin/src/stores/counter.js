import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
// stores/authStore.js


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    // Trả về true nếu có token
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    // Hàm này được gọi khi đăng nhập thành công
    loginSuccess(token) {
      this.token = token;
      localStorage.setItem('token', token);
      // Có thể chuyển hướng ở đây hoặc trong component Đăng nhập
    },
    // Hàm này được gọi khi đăng xuất
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      router.push({ name: 'Login' });
    },
  },
});
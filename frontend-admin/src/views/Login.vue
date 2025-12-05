<template>
  <div class="login-container">
    <div class="login-card">
      <h3 class="text-center fw-bold mb-4">Đăng Nhập Hệ Thống Quản Trị</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="msnv" class="form-label">Mã Số Nhân Viên (MSNV)</label>
          <input
            type="text"
            class="form-control"
            id="msnv"
            v-model="msnv"
            required
            placeholder="Nhập MSNV của bạn"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật Khẩu</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            required
            placeholder="Nhập mật khẩu"
          />
        </div>

        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>

        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-else>Đăng Nhập</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/Auth.service.js';

const msnv = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const credentials = {
      MSNV: msnv.value,
      Password: password.value,
    };
    const response = await AuthService.login(credentials);

    // Lưu token và thông tin người dùng vào localStorage
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      // Chuyển hướng và tải lại trang để đảm bảo Sidebar được hiển thị
      router.push({ name: 'BookManagement' }).then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    errorMessage.value = error.response?.data?.message || 'MSNV hoặc mật khẩu không chính xác. Vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to top, #e6e9f0, #eef1f5);
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
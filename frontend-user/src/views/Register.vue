<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="title">Tạo Tài Khoản</h2>
      <p class="subtitle">Mã độc giả sẽ được tự động tạo</p>

      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Row 1: Họ Tên, Ngày Sinh -->
        <div class="form-row">
          <div class="input-group">
            <label>Họ Tên</label>
            <input v-model="formData.HoTen" type="text" placeholder="Nhập họ tên" required :disabled="isSubmitting" />
          </div>
          <div class="input-group">
            <label>Ngày Sinh</label>
            <input v-model="formData.NgaySinh" type="date" required :disabled="isSubmitting" />
          </div>
        </div>

        <!-- Row 2: Giới Tính, Điện Thoại -->
        <div class="form-row">
          <div class="input-group">
            <label>Giới Tính</label>
            <select v-model="formData.Phai" required :disabled="isSubmitting">
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div class="input-group">
            <label>Số Điện Thoại</label>
            <input v-model="formData.DienThoai" type="tel" placeholder="Điện thoại" required :disabled="isSubmitting" />
          </div>
        </div>

        <!-- Địa Chỉ -->
        <div class="input-group">
          <label>Địa Chỉ</label>
          <input v-model="formData.DiaChi" type="text" placeholder="Nhập địa chỉ" required :disabled="isSubmitting" />
        </div>

        <!-- Mật Khẩu -->
        <div class="input-group">
          <label>Mật Khẩu</label>
          <input v-model="formData.Password" type="password" placeholder="Nhập mật khẩu" required :disabled="isSubmitting" />
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký' }}
        </button>
      </form>

      <p class="redirect">
        Đã có tài khoản?
        <router-link to="/login">Đăng Nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ReaderService from '@/services/Reader.service';

const router = useRouter();
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = ref({
  HoTen: '',
  NgaySinh: '',
  Phai: '',
  DiaChi: '',
  DienThoai: '',
  Password: ''
});

// Tự động tạo Mã Độc Giả (VD: DG + timestamp)
const generateMaDocGia = () => {
  return 'DG' + Date.now();
};

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validate all fields
  if (!formData.value.HoTen || !formData.value.NgaySinh || 
      !formData.value.Phai || !formData.value.DiaChi || !formData.value.DienThoai || 
      !formData.value.Password) {
    errorMessage.value = 'Vui lòng điền đầy đủ tất cả các trường.';
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      MaDocGia: generateMaDocGia(),
      ...formData.value
    };
    const response = await ReaderService.register(payload);
    successMessage.value = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    errorMessage.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 500px;
  padding: 32px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  text-align: center;
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #1f2937;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 14px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.register-form {
  text-align: left;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.input-group {
  text-align: left;
  margin-bottom: 14px;
}

.form-row .input-group {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus,
select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input:disabled,
select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.redirect {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.redirect a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.redirect a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 22px;
  }
}
</style>

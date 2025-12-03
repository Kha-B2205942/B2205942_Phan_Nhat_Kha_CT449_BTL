<template>
  <div>
    <h4 class="fw-bold mb-4">{{ isEditMode ? 'Chỉnh Sửa Thông Tin Nhân Viên' : 'Thêm Nhân Viên Mới' }}</h4>

    <form @submit.prevent="handleSubmit" v-if="employee">
      <div class="row">
        <!-- Cột trái -->
        <div class="col-md-6">
          <div class="mb-3">
            <label for="msnv" class="form-label">Mã Số Nhân Viên (MSNV)</label>
            <input type="text" class="form-control" id="msnv" v-model="employee.MSNV" disabled required>
          </div>
          <div class="mb-3">
            <label for="hoTen" class="form-label">Họ và Tên</label>
            <input type="text" class="form-control" id="hoTen" v-model="employee.HoTenNV" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật Khẩu</label>
            <input type="password" class="form-control" id="password" v-model="employee.Password" :placeholder="isEditMode ? 'Để trống nếu không đổi' : ''" :required="!isEditMode">
            <small v-if="isEditMode" class="form-text text-muted">Nhập mật khẩu mới nếu bạn muốn thay đổi.</small>
          </div>
        </div>

        <!-- Cột phải -->
        <div class="col-md-6">
          <div class="mb-3">
            <label for="chucVu" class="form-label">Chức Vụ</label>
            <input type="text" class="form-control" id="chucVu" v-model="employee.ChucVu" required>
          </div>
          <div class="mb-3">
            <label for="diaChi" class="form-label">Địa Chỉ</label>
            <input type="text" class="form-control" id="diaChi" v-model="employee.DiaChi" required>
          </div>
          <div class="mb-3">
            <label for="soDienThoai" class="form-label">Số Điện Thoại</label>
            <input type="tel" class="form-control" id="soDienThoai" v-model="employee.SoDienThoai" required>
          </div>
        </div>
      </div>

      <!-- Nút chức năng -->
      <div class="mt-3">
        <button type="submit" class="btn btn-primary me-2">
          <i class="fa-solid fa-save me-1"></i> {{ isEditMode ? 'Lưu Thay Đổi' : 'Thêm Mới' }}
        </button>
        <router-link to="/nhanvien" class="btn btn-secondary">
          <i class="fa-solid fa-arrow-left me-1"></i> Quay Lại
        </router-link>
      </div>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </form>
    <div v-else class="text-center">Đang tải...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EmployeeService from '@/services/Employee.service.js';

const route = useRoute();
const router = useRouter();

const employee = ref(null);
const errorMessage = ref('');

// Xác định xem form đang ở chế độ chỉnh sửa hay thêm mới
const isEditMode = computed(() => !!route.params.MSNV);

// Tự động tạo Mã Nhân Viên (VD: NV + timestamp)
const generateMSNV = () => {
  return 'NV' + Date.now();
};

onMounted(async () => {
  if (isEditMode.value) {
    try {
      // Lấy thông tin nhân viên để chỉnh sửa
      employee.value = await EmployeeService.get(route.params.MSNV);
      employee.value.Password = ''; // Không hiển thị mật khẩu cũ
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
      errorMessage.value = "Không thể tải thông tin nhân viên để chỉnh sửa.";
    }
  } else {
    // Khởi tạo đối tượng nhân viên mới
    employee.value = {
      MSNV: generateMSNV(),
      HoTenNV: '',
      Password: '',
      ChucVu: '',
      DiaChi: '',
      SoDienThoai: ''
    };
  }
});

const handleSubmit = async () => {
  try {
    errorMessage.value = '';
    if (isEditMode.value) {
      // Chế độ sửa: loại bỏ mật khẩu nếu không được nhập
      const dataToUpdate = { ...employee.value };
      if (!dataToUpdate.Password) delete dataToUpdate.Password;
      await EmployeeService.update(employee.value.MSNV, dataToUpdate);
      alert('Cập nhật thông tin nhân viên thành công!');
    } else {
      // Chế độ thêm mới
      await EmployeeService.create(employee.value);
      alert('Thêm nhân viên mới thành công!');
    }
    router.push({ name: 'EmployeeManagement' }); 
  } catch (error) {
    console.error("Lỗi khi lưu thông tin nhân viên:", error);
    errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
};
</script>
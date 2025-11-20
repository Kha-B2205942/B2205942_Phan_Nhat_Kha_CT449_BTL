<template>
  <div>
    <h4 class="fw-bold mb-4">{{ isEditMode ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới' }}</h4>

    <form @submit.prevent="handleSubmit" v-if="book">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label for="maSach" class="form-label">Mã Sách</label>
            <input type="text" class="form-control" id="maSach" v-model="book.MaSach" :disabled="isEditMode" required>
          </div>
          <div class="mb-3">
            <label for="tenSach" class="form-label">Tên Sách</label>
            <input type="text" class="form-control" id="tenSach" v-model="book.TenSach" required>
          </div>
          <div class="mb-3">
            <label for="tacGia" class="form-label">Tác Giả</label>
            <input type="text" class="form-control" id="tacGia" v-model="book.TacGia" required>
          </div>
          <div class="mb-3">
            <label for="maNXB" class="form-label">Mã Nhà Xuất Bản</label>
            <input type="text" class="form-control" id="maNXB" v-model="book.MaNXB" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label for="donGia" class="form-label">Đơn Giá</label>
            <input type="number" class="form-control" id="donGia" v-model.number="book.DonGia" required>
          </div>
          <div class="mb-3">
            <label for="soQuyen" class="form-label">Số Quyển</label>
            <input type="number" class="form-control" id="soQuyen" v-model.number="book.SoQuyen" required>
          </div>
          <div class="mb-3">
            <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
            <input type="number" class="form-control" id="namXuatBan" v-model.number="book.NamXuatBan" required>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary me-2">
          <i class="fa-solid fa-save me-1"></i> {{ isEditMode ? 'Lưu thay đổi' : 'Thêm mới' }}
        </button>
        <router-link to="/sach" class="btn btn-secondary">
          <i class="fa-solid fa-arrow-left me-1"></i> Quay lại
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
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const book = ref(null);
const errorMessage = ref('');

const isEditMode = computed(() => !!route.params.MaSach);

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await axios.get(`/api/sach/${route.params.MaSach}`);
      book.value = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sách:", error);
      errorMessage.value = "Không thể tải thông tin sách để chỉnh sửa.";
    }
  } else {
    // Khởi tạo sách mới
    book.value = {
      MaSach: '',
      TenSach: '',
      DonGia: 0,
      SoQuyen: 1,
      NamXuatBan: new Date().getFullYear(),
      MaNXB: '',
      TacGia: ''
    };
  }
});

const handleSubmit = async () => {
  try {
    errorMessage.value = '';
    if (isEditMode.value) {
      // Chế độ sửa
      await axios.put(`/api/sach/${book.value.MaSach}`, book.value);
      alert('Cập nhật sách thành công!');
    } else {
      // Chế độ thêm mới
      await axios.post('/api/sach', book.value);
      alert('Thêm sách mới thành công!');
    }
    router.push({ name: 'BookManagement' });
  } catch (error) {
    console.error("Lỗi khi lưu sách:", error);
    errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
};
</script>

<style scoped>
/* Thêm style nếu cần */
</style>
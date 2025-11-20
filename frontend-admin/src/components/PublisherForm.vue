<template>
  <div>
    <h4 class="fw-bold mb-4">{{ isEditMode ? 'Chỉnh Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới' }}</h4>

    <form @submit.prevent="handleSubmit" v-if="publisher">
      <div class="row">
        <div class="col-md-8">
          <div class="mb-3">
            <label for="maNXB" class="form-label">Mã Nhà Xuất Bản</label>
            <input type="text" class="form-control" id="maNXB" v-model="publisher.MaNXB" :disabled="isEditMode" required>
          </div>
          <div class="mb-3">
            <label for="tenNXB" class="form-label">Tên Nhà Xuất Bản</label>
            <input type="text" class="form-control" id="tenNXB" v-model="publisher.TenNXB" required>
          </div>
          <div class="mb-3">
            <label for="diaChi" class="form-label">Địa Chỉ</label>
            <input type="text" class="form-control" id="diaChi" v-model="publisher.DiaChi" required>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary me-2">
          <i class="fa-solid fa-save me-1"></i> {{ isEditMode ? 'Lưu thay đổi' : 'Thêm mới' }}
        </button>
        <router-link :to="{ name: 'PublisherManagement' }" class="btn btn-secondary">
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
import PublisherService from '@/services/Publisher.service.js';

const route = useRoute();
const router = useRouter();

const publisher = ref(null);
const errorMessage = ref('');

const isEditMode = computed(() => !!route.params.MaNXB);

onMounted(async () => {
  if (isEditMode.value) {
    try {
      // Lấy thông tin nhà xuất bản để chỉnh sửa
      publisher.value = await PublisherService.get(route.params.MaNXB);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhà xuất bản:", error);
      errorMessage.value = "Không thể tải thông tin nhà xuất bản để chỉnh sửa.";
    }
  } else {
    // Khởi tạo đối tượng nhà xuất bản mới
    publisher.value = {
      MaNXB: '',
      TenNXB: '',
      DiaChi: ''
    };
  }
});

const handleSubmit = async () => {
  try {
    errorMessage.value = '';
    if (isEditMode.value) {
      // Chế độ sửa: gọi API cập nhật
      await PublisherService.update(publisher.value.MaNXB, publisher.value);
      alert('Cập nhật nhà xuất bản thành công!');
    } else {
      // Chế độ thêm mới: gọi API tạo mới
      await PublisherService.create(publisher.value);
      alert('Thêm nhà xuất bản mới thành công!');
    }
    // Chuyển hướng về trang quản lý nhà xuất bản
    router.push({ name: 'PublisherManagement' });
  } catch (error) {
    console.error("Lỗi khi lưu nhà xuất bản:", error);
    errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
};
</script>

<style scoped>
/* Bạn có thể thêm style tùy chỉnh tại đây nếu cần */
</style>
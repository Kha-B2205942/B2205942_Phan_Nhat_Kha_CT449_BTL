<template>
  <div>
    <h4 class="fw-bold mb-4">
      {{ isEditMode ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới' }}
    </h4>

    <form @submit.prevent="handleSubmit" v-if="book">
      <div class="row">

        <!-- Ảnh bìa -->
        <div class="col-md-4">
          <div class="mb-3">
            <label class="form-label">Ảnh Bìa</label>

            <div class="image-preview mb-2">
              <img
                :src="imagePreview || 'https://via.placeholder.com/150x220.png?text=No+Image'"
                alt="Preview"
                class="img-fluid rounded"
              >
            </div>

            <input 
              type="file" 
              class="form-control" 
              @change="handleFileChange"
              accept="image/*"
              :disabled="isSubmitting"
            >
            <small class="text-muted d-block mt-2">Hỗ trợ: JPEG, PNG, GIF, WebP (Max 5MB)</small>
          </div>
        </div>

        <!-- Thông tin sách -->
        <div class="col-md-8">
          <div class="row">

            <div class="col-md-6 mb-3">
              <label class="form-label">Mã Sách</label>
              <input type="text" class="form-control"
                v-model="book.MaSach" disabled required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Tên Sách</label>
              <input type="text" class="form-control"
                v-model="book.TenSach" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Đơn Giá</label>
              <input type="number" class="form-control"
                v-model.number="book.DonGia" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Số Quyển</label>
              <input type="number" class="form-control"
                v-model.number="book.SoQuyen" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Năm Xuất Bản</label>
              <input type="number" class="form-control"
                v-model.number="book.NamXuatBan" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Nhà Xuất Bản</label>
              <select class="form-select" v-model="book.MaNXB" required>
                <option v-for="p in publishers" :value="p.MaNXB">
                  {{ p.TenNXB }}
                </option>
              </select>
            </div>

          </div>

          <div class="mb-3">
            <label class="form-label">Tác Giả</label>
            <input type="text" class="form-control" v-model="book.TacGia" required>
          </div>

        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary me-2" :disabled="isSubmitting">
          <i 
            :class="isSubmitting ? 'fa-solid fa-spinner fa-spin me-1' : 'fa-solid fa-save me-1'"
          ></i>
          {{ isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Lưu Thay Đổi' : 'Thêm Mới') }}
        </button>

        <router-link to="/sach" class="btn btn-secondary" :class="{ disabled: isSubmitting }">
          <i class="fa-solid fa-arrow-left me-1"></i> Quay Lại
        </router-link>
      </div>

      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </form>

    <div v-else class="text-center">Đang tải...</div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import BookService from "@/services/Book.service.js";
import PublisherService from "@/services/Publisher.service.js";

const route = useRoute();
const router = useRouter();

const book = ref(null);
const publishers = ref([]);
const imagePreview = ref("");
const selectedFile = ref(null);
const errorMessage = ref("");
const isSubmitting = ref(false);

const originalBookData = ref(null); // Lưu trữ dữ liệu sách gốc khi chỉnh sửa
const isEditMode = computed(() => !!route.params.MaSach);

// Tự động tạo Mã Sách (VD: S + timestamp)
const generateMaSach = () => {
  return 'S' + Date.now();
};

onMounted(async () => {
  try {
    publishers.value = await PublisherService.getAll();

    if (isEditMode.value) {
      book.value = await BookService.get(route.params.MaSach);
      originalBookData.value = { ...book.value }; // Lưu lại bản gốc

      if (book.value.HinhAnh) {
        imagePreview.value = `http://localhost:3000${book.value.HinhAnh}`;
      }

    } else {
      book.value = {
        MaSach: generateMaSach(),
        TenSach: "",
        DonGia: 0,
        SoQuyen: 1,
        NamXuatBan: new Date().getFullYear(),
        MaNXB: publishers.value[0]?.MaNXB || "",
        TacGia: "",
        HinhAnh: null,
      };
    }

  } catch (error) {
    errorMessage.value = "Không thể tải dữ liệu.";
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Kiểm tra loại file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      errorMessage.value = "Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WebP).";
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = "Kích thước ảnh không được vượt quá 5MB.";
      return;
    }

    errorMessage.value = "";
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    errorMessage.value = "";

    // Xử lý logic cập nhật số lượng khi chỉnh sửa
    if (isEditMode.value && originalBookData.value) {
      const soQuyenChange = book.value.SoQuyen - originalBookData.value.SoQuyen;
      if (soQuyenChange > 0) { // Chỉ tăng, không giảm để tránh lỗi logic mượn
        book.value.SoLuongHienCo = (originalBookData.value.SoLuongHienCo || 0) + soQuyenChange;
      }
    }

    const formData = new FormData();

    // Thêm tất cả các trường của book vào formData
    for (const key in book.value) {
      if (book.value[key] !== null && book.value[key] !== undefined) {
        formData.append(key, book.value[key]);
      }
    }

    // Nếu có file mới được chọn, thêm vào formData
    if (selectedFile.value) {
      formData.append('HinhAnh', selectedFile.value);
    }

    if (isEditMode.value) {
      await BookService.update(book.value.MaSach, formData);
      alert("Cập nhật sách thành công!");
    } else {
      await BookService.create(formData);
      alert("Thêm sách mới thành công!");
    }

    router.push({ name: "BookManagement" });

  } catch (err) {
    console.error(err);
    errorMessage.value = err.response?.data?.message || "Lỗi khi lưu dữ liệu.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Độc Giả</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="goToAddReader"><i class="fa-solid fa-plus me-1"></i>Thêm mới</button>
      </div>
      <!-- Thanh tìm kiếm -->
      <div>
        <InputSearch v-model="searchText" />
      </div>
    </div>
 
    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
 
    <!-- Hiển thị component ReaderList và truyền dữ liệu vào -->
    <ReaderList 
      :filteredReaders="filteredReaders"
      :isLoading="isLoading"
      :goToEditReader="goToEditReader"
      :deleteReader="deleteReader"
    />
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue'; 
import ReaderList from '@/components/ReaderList.vue'; 
import ReaderService from '@/services/Reader.service.js'; 
 
const readers = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();
 
const filteredReaders = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  if (!query) {
    return readers.value; // Nếu không có từ khóa, trả về toàn bộ danh sách
  }
 
  // Lọc độc giả theo Tên hoặc Mã Độc Giả
  return readers.value.filter(reader =>
      reader.HoTen.toLowerCase().includes(query) ||
      reader.MaDocGia.toLowerCase().includes(query)
  );
});
 
const fetchReaders = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // Sử dụng ReaderService để lấy dữ liệu
    readers.value = await ReaderService.getAll();
  } catch (err) {
    console.error("Lỗi tải danh sách độc giả:", err);
    error.value = "Không thể tải danh sách độc giả. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};
 
const deleteReader = async (MaDocGia) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa độc giả có mã "${MaDocGia}" không?`)) {
    try {
      await ReaderService.delete(MaDocGia);
      await fetchReaders(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      console.error("Lỗi khi xóa độc giả:", err);
      alert("Đã xảy ra lỗi khi xóa độc giả. Vui lòng thử lại.");
    }
  }
};
 
const goToAddReader = () => {
  router.push({ name: 'ReaderAdd' });
};
 
const goToEditReader = (MaDocGia) => {
  router.push({ name: 'ReaderEdit', params: { MaDocGia: MaDocGia } });
};
 
onMounted(() => {
  fetchReaders();
});

// Theo dõi sự thay đổi của route để tải lại dữ liệu nếu cần
watch(() => router.currentRoute.value, (to, from) => {
    if (to.name === 'ReaderManagement' && from.name && (from.name === 'ReaderEdit' || from.name === 'ReaderAdd')) {
        fetchReaders();
    }
});
</script>

<style scoped>
.search-box .input-group-text {
  background-color: white;
  border-left: none;
  color: #6c757d;
}
.search-box .form-control:focus {
    box-shadow: none;
    border-color: #0d6efd;
}
</style>
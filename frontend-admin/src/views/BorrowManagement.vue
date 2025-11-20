<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Mượn Sách</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Thanh tìm kiếm -->
      <div class="w-50">
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Hiển thị component BorrowList và truyền dữ liệu vào -->
    <BorrowList 
      :filteredBorrows="filteredBorrows"
      :isLoading="isLoading"
      :updateBorrowStatus="updateBorrowStatus"
      :deleteBorrow="deleteBorrow"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import InputSearch from '@/components/InputSearch.vue';
import BorrowList from '@/components/BorrowList.vue';
import BorrowService from '@/services/Borrow.service.js';

const borrows = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);

const filteredBorrows = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  if (!query) {
    return borrows.value;
  }

  // Lọc theo Mã độc giả hoặc Mã sách
  return borrows.value.filter(borrow => 
    borrow.MaDocGia.toLowerCase().includes(query) ||
    borrow.MaSach.toLowerCase().includes(query)
  );
});

const fetchBorrows = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    borrows.value = await BorrowService.getAll();
  } catch (err) {
    console.error("Lỗi tải danh sách mượn sách:", err);
    error.value = "Không thể tải danh sách mượn sách. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

const updateBorrowStatus = async (id, newStatus) => {
  if (window.confirm(`Bạn có chắc muốn cập nhật trạng thái lượt mượn này thành "${newStatus}" không?`)) {
    try {
      await BorrowService.update(id, { TrangThai: newStatus });
      await fetchBorrows();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  }
};

const deleteBorrow = async (id) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa lượt mượn này không?`)) {
    try {
      await BorrowService.delete(id);
      await fetchBorrows();
    } catch (err) {
      console.error("Lỗi khi xóa lượt mượn:", err);
      alert("Đã xảy ra lỗi khi xóa lượt mượn.");
    }
  }
};

onMounted(() => {
  fetchBorrows();
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
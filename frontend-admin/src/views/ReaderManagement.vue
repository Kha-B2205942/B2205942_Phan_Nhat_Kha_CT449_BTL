<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Sách</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="goToAddBook"><i class="fa-solid fa-plus me-1"></i>Thêm mới</button>
      </div>
      <!-- Thanh tìm kiếm -->
      <div>
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Hiển thị component BookList và truyền dữ liệu vào -->
    <BookList 
      :filteredBooks="filteredBooks"
      :isLoading="isLoading"
      :goToEditBook="goToEditBook"
      :deleteBook="deleteBook"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue'; // Import component InputSearch
import BookList from '@/components/BookList.vue'; // Import component BookList
import BookService from '@/services/book.service.js'; // Import BookService

const books = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();

const filteredBooks = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  if (!query) {
    return books.value; // Nếu không có từ khóa, trả về toàn bộ danh sách
  }

  // Lọc sách theo Tên Sách hoặc Mã Sách
  return books.value.filter(book => 
    book.TenSach.toLowerCase().includes(query) ||
    book.MaSach.toLowerCase().includes(query) ||
    book.TacGia.toLowerCase().includes(query) ||
    (book.SoLuongHienCo !== undefined && book.SoLuongHienCo.toString().includes(query))
  );
});

const fetchBooks = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // Sử dụng BookService để lấy dữ liệu
    books.value = await BookService.getAll();
  } catch (err) {
    console.error("Lỗi tải sách:", err);
    error.value = "Không thể tải danh sách sách. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

const deleteBook = async (MaSach) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa sách có mã "${MaSach}" không?`)) {
    try {
      // Sử dụng BookService để xóa
      await BookService.delete(MaSach);
      // Tải lại danh sách sách sau khi xóa thành công
      await fetchBooks();
    } catch (err) {
      console.error("Lỗi khi xóa sách:", err);
      alert("Đã xảy ra lỗi khi xóa sách. Vui lòng thử lại.");
    }
  }
};

const goToAddBook = () => {
  router.push({ name: 'BookAdd' });
};

const goToEditBook = (MaSach) => {
  router.push({ name: 'BookEdit', params: { MaSach: MaSach } });
};

onMounted(() => {
  fetchBooks();
});

// Theo dõi sự thay đổi của route để tải lại dữ liệu nếu cần
watch(() => router.currentRoute.value, (to, from) => {
    if (to.name === 'BookManagement' && from.name && (from.name === 'BookEdit' || from.name === 'BookAdd')) {
        fetchBooks();
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
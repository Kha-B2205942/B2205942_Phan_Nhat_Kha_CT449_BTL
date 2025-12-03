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
      :filteredBooks="paginatedBooks"
      :isLoading="isLoading"
      :goToEditBook="goToEditBook"
      :deleteBook="deleteBook"
    />

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" class="mt-4" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">&laquo;</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">&raquo;</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue';
import BookList from '@/components/BookList.vue'; 
import BookService from '@/services/Book.service.js';

const books = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();
const currentPage = ref(1);
const booksPerPage = ref(4); // Hiển thị 4 sách mỗi trang

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

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / booksPerPage.value);
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * booksPerPage.value;
  const end = start + booksPerPage.value;
  return filteredBooks.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const fetchBooks = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // Sử dụng BookService để lấy dữ liệu
    books.value = await BookService.getAll();
  } catch (err) {
    console.error("Lỗi tải sách:", err);
    error.value = err.response?.data?.message || "Không thể tải danh sách sách. Vui lòng thử lại sau.";
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

watch(searchText, () => {
  currentPage.value = 1; // Reset về trang 1 khi tìm kiếm
});

onMounted(() => {
  fetchBooks();
});


watch(
  () => router.currentRoute.value,
  (toRoute) => {
    if (toRoute.name === 'BookManagement') fetchBooks();
  }, { immediate: true } // `immediate: true` đảm bảo nó chạy ngay lần đầu khi component được tạo, thay thế cho onMounted
);
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
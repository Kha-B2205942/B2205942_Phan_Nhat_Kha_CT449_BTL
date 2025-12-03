<template>
  <div>
        <h3 class="fw-bold mb-4">Khám Phá Sách</h3>
        <!-- Search & Filter Info -->
        <div class="row g-2 mb-4">
          <!-- Filter by Publisher -->
          <div class="col-md-3">
            <select class="form-select" v-model="selectedPublisher">
              <option :value="null">Tất cả Nhà xuất bản</option>
              <option v-for="pub in allPublishers" :key="pub.MaNXB" :value="pub.MaNXB">{{ pub.TenNXB }}</option>
            </select>
          </div>
          <!-- Filter by Author -->
          <div class="col-md-3">
            <select class="form-select" v-model="selectedAuthor">
              <option :value="null">Tất cả Tác giả</option>
              <option v-for="author in allAuthors" :key="author" :value="author">{{ author }}</option>
            </select>
          </div>
          <!-- Search by Name -->
          <div class="col-md-6">
            <InputSearch v-model="searchText" placeholder="Tìm kiếm theo tên sách..." />
          </div>
          <div v-if="selectedAuthor || selectedPublisher" class="col-12 mt-2">
            <button class="btn btn-sm btn-light" @click="clearAllFilters">Xóa bộ lọc</button>
          </div>
        </div>

        <!-- Book Grid -->
        <section class="section">
          <div class="book-grid">
            <BookCard 
              v-for="book in visibleBooks"
              :key="book.MaSach || book._id" 
              :book="book" 
            />
          </div>
          <div v-if="hasMoreBooks" class="text-center mt-4">
            <button @click="loadMoreBooks" class="btn btn-outline-primary px-5 rounded-pill">Xem thêm</button>
          </div>
        </section>
        
        <div v-if="!isLoading && filteredBooks.length === 0" class="text-center py-5">
            <i class="fa-solid fa-magnifying-glass fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Không tìm thấy sách phù hợp.</h5>
            <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import InputSearch from '@/components/InputSearch.vue';
import BookCard from '@/components/BookCard.vue';
import BookService from '@/services/Book.service.js';
import PublisherService from '@/services/Publisher.service.js';

const books = ref([]);
const publishers = ref([]);
const searchText = ref('');
const selectedAuthor = ref(null);
const selectedPublisher = ref(null);
const isLoading = ref(true);
const displayLimit = ref(12);

onMounted(async () => {
  isLoading.value = true;
  try {
    const [allBooks, allPublishers] = await Promise.all([
      BookService.getAll(),
      PublisherService.getAll()
    ]);

    publishers.value = allPublishers;
    const publisherMap = new Map(allPublishers.map(p => [p.MaNXB, p.TenNXB]));

    books.value = allBooks.map(book => ({
      ...book,
      TenNXB: publisherMap.get(book.MaNXB) || 'Không rõ',
      HinhAnh: book.HinhAnh 
        ? (book.HinhAnh.includes('http') ? book.HinhAnh : `http://localhost:3000${book.HinhAnh}`) 
        : `https://placehold.co/240x320?text=${encodeURIComponent(book.TenSach)}`
    }));
  } catch (err) {
    console.error('Error fetching data for explore page:', err);
  } finally {
    isLoading.value = false;
  }
});

const filteredBooks = computed(() => {
  let tempBooks = books.value;
  if (selectedAuthor.value) tempBooks = tempBooks.filter(book => book.TacGia === selectedAuthor.value);
  if (selectedPublisher.value) tempBooks = tempBooks.filter(book => book.MaNXB === selectedPublisher.value);
  const query = searchText.value.toLowerCase().trim();
  if (query) tempBooks = tempBooks.filter(book => book.TenSach.toLowerCase().includes(query));
  return tempBooks;
});

const visibleBooks = computed(() => filteredBooks.value.slice(0, displayLimit.value));
const hasMoreBooks = computed(() => displayLimit.value < filteredBooks.value.length);
const allAuthors = computed(() => [...new Set(books.value.map(b => b.TacGia).filter(Boolean))]);
const allPublishers = computed(() => publishers.value);

const clearAllFilters = () => {
  // Giữ lại searchText, chỉ xóa bộ lọc dropdown
  selectedAuthor.value = null;
  selectedPublisher.value = null;
};

const loadMoreBooks = () => displayLimit.value += 12;
</script>

<style scoped>
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
</style>
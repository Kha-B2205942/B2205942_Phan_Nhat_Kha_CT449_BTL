<template>
  <div>
        <!-- Recommended for you -->
        <section class="section mb-5" v-if="books.length > 0">
          <div class="section-head d-flex justify-content-between align-items-center mb-3">
            <h4 class="section-title">Sách nổi bật</h4>
          </div>

          <div class="book-grid">
            <BookCard 
              v-for="book in visibleBooks" 
              :key="book.MaSach || book._id || book.id" 
              :book="book" 
            />
          </div>
          <div v-if="hasMoreBooks" class="text-center mt-4">
            <button @click="loadMoreBooks" class="btn btn-outline-primary px-5 rounded-pill">Xem thêm</button>
          </div>
        </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BookCard from '@/components/BookCard.vue';
import BookService from '@/services/Book.service.js';

const books = ref([]);
const isLoading = ref(false);
const error = ref(null);
const displayLimit = ref(9); // Hiển thị 9 sách ban đầu (2 hàng x 3 cột)

const fetchBooks = async () => {
  isLoading.value = true;
  try {
    const all = await BookService.getAll();
    books.value = all.map(b => ({
      ...b,
      HinhAnh: b.HinhAnh ? (b.HinhAnh.includes('http') ? b.HinhAnh : `http://localhost:3000${b.HinhAnh}`) : `https://placehold.co/240x320?text=${encodeURIComponent(b.TenSach)}`
    }));
  } catch (err) {
    console.error('fetchBooks', err);
    error.value = 'Không thể tải sách';
  } finally { isLoading.value = false; }
};

onMounted(fetchBooks);

// Lấy danh sách sách để hiển thị dựa trên giới hạn
const visibleBooks = computed(() => books.value.slice(0, displayLimit.value));

// Kiểm tra xem còn sách để tải thêm không
const hasMoreBooks = computed(() => displayLimit.value < books.value.length);

const authors = computed(() => {
  const map = new Map();
  books.value.forEach(b => {
    const name = (b.TacGia || 'Unknown').trim();
    if (!map.has(name)) {
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E6EEF8&color=2B6CB0&rounded=true&size=128`;
      map.set(name, { name, avatar });
    }
  });
  return Array.from(map.values()).slice(0, 10);
});

// Hàm tải thêm sách, mỗi lần tải thêm 6 cuốn
const loadMoreBooks = () => {
  displayLimit.value += 6;
};
</script>

<style scoped>

/* Sections */
.section-title { font-weight: 700; font-size: 18px; }
.see-all { color: #6b7280; text-decoration: none; }

/* Book Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.authors-row { display: flex; gap: 18px; overflow-x: auto; padding: 8px 0; }
.author-card { width: 110px; background: #fff; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 8px 20px rgba(2,6,23,0.06); }
.author-card img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; }
.author-name { font-size: 13px; color: #374151; }

</style>

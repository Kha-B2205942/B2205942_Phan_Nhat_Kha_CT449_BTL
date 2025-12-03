<template>
  <div>
        <h3 class="fw-bold mb-4">Lịch Sử Mượn Sách</h3>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải lịch sử mượn sách...</p>
        </div>

        <!-- Error Message -->
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Borrow History List -->
        <div v-else-if="borrowsWithDetails.length > 0">
          <div class="list-group">
            <div v-for="borrow in borrowsWithDetails" :key="borrow._id" class="list-group-item list-group-item-action flex-column align-items-start p-3 mb-3 border rounded-3">
              <div class="row g-3">
                <!-- Book Image -->
                <div class="col-auto">
                  <img :src="borrow.book.HinhAnh" :alt="borrow.book.TenSach" class="borrow-history-img">
                </div>

                <!-- Book and Borrow Info -->
                <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1 fw-bold">{{ borrow.book.TenSach }}</h5>
                    <span class="badge" :class="getStatusClass(borrow.TrangThai)">{{ borrow.TrangThai }}</span>
                  </div>
                  <p class="mb-1 text-muted">Số lượng: <span class="fw-medium text-dark">{{ borrow.SoLuong }}</span></p>
                  <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-2 small mt-2">
                    <div class="col"><strong>Ngày mượn:</strong> {{ formatDate(borrow.NgayMuon) }}</div>
                    <div class="col"><strong>Hạn trả:</strong> {{ formatDate(borrow.HanTra) }}</div>
                    <div class="col"><strong>Ngày trả:</strong> {{ borrow.NgayTra ? formatDate(borrow.NgayTra) : 'Chưa trả' }}</div>
                  </div>
                </div>

                <!-- Actions -->
                <div v-if="borrow.TrangThai === 'Đang chờ duyệt'" class="col-12 col-md-auto d-flex align-items-center justify-content-end">
                  <button class="btn btn-sm btn-outline-danger" @click="cancelBorrowRequest(borrow._id)">
                    <i class="fa-solid fa-times me-1"></i> Hủy yêu cầu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Borrows Found -->
        <div v-else class="text-center py-5 border rounded-3 bg-light">
          <i class="fa-solid fa-book-open-reader fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Bạn chưa có lịch sử mượn sách.</h5>
          <p>Hãy bắt đầu khám phá và mượn những cuốn sách yêu thích nhé!</p>
          <router-link to="/explore" class="btn btn-primary mt-2">
            <i class="fa-solid fa-compass me-2"></i>Khám phá sách ngay
          </router-link>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import BorrowService from '@/services/Borrow.service';
import BookService from '@/services/Book.service';

const router = useRouter();
const authStore = useAuthStore();

const borrows = ref([]);
const books = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  if (!authStore.user) {
    alert("Vui lòng đăng nhập để xem lịch sử mượn sách.");
    router.push({ name: 'Login' });
    return;
  }

  try {
    isLoading.value = true;
    const readerId = authStore.user.MaDocGia;
    
    // Fetch borrows and all books in parallel
    const [borrowsData, booksData] = await Promise.all([
      BorrowService.findByReader(readerId),
      BookService.getAll()
    ]);

    // Sort borrows by NgayMuon descending
    borrows.value = borrowsData.sort((a, b) => new Date(b.NgayMuon) - new Date(a.NgayMuon));
    books.value = booksData;

  } catch (err) {
    console.error("Error fetching borrow history:", err);
    error.value = "Không thể tải lịch sử mượn sách. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
});

const borrowsWithDetails = computed(() => {
  return borrows.value.map(borrow => {
    const bookDetail = books.value.find(b => b.MaSach === borrow.MaSach) || {};
    return {
      ...borrow,
      book: {
        TenSach: bookDetail.TenSach || 'Sách không xác định',
        HinhAnh: bookDetail.HinhAnh 
          ? (bookDetail.HinhAnh.startsWith('http') ? bookDetail.HinhAnh : `http://localhost:3000${bookDetail.HinhAnh}`)
          : 'https://placehold.co/80x110?text=No+Image'
      }
    };
  });
});

const cancelBorrowRequest = async (borrowId) => {
  if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu mượn sách này không?")) {
    return;
  }
  try {
    // We can use the update service to change the status to "Đã hủy"
    await BorrowService.update(borrowId, { TrangThai: 'Đã hủy' });
    // Refresh the list
    const borrowToUpdate = borrows.value.find(b => b._id === borrowId);
    if (borrowToUpdate) {
      borrowToUpdate.TrangThai = 'Đã hủy';
    }
    alert("Đã hủy yêu cầu mượn sách thành công.");
  } catch (err) {
    console.error("Error cancelling borrow request:", err);
    alert("Đã xảy ra lỗi khi hủy yêu cầu. Vui lòng thử lại.");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getStatusClass = (status) => {
  if (status === 'Đã duyệt') return 'bg-success';
  if (status === 'Đang chờ duyệt') return 'bg-warning text-dark';
  if (status === 'Đã trả') return 'bg-secondary';
  if (status === 'Đã hủy') return 'bg-danger';
  return 'bg-info';
};
</script>
<style scoped>
.borrow-history-img {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
}
.list-group-item {
  transition: background-color 0.2s ease-in-out;
}
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
<template>
  <div class="container my-4">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải dữ liệu sách...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="alert alert-danger">
      <h4 class="alert-heading">Đã xảy ra lỗi!</h4>
      <p>{{ error }}</p>
      <hr>
      <router-link to="/" class="btn btn-primary">Quay về trang chủ</router-link>
    </div>

    <!-- Book Content -->
    <div v-else-if="book" class="row g-4 g-lg-5">
      <!-- Left Column: Book Cover -->
      <div class="col-md-4 text-center">
        <img :src="bookImage" class="book-cover shadow-sm" :alt="book.TenSach" />
      </div>

      <!-- Right Column: Book Info -->
      <div class="col-md-8">
        <h2 class="book-title fw-bold mb-2">{{ book.TenSach }}</h2>
        <p class="book-author text-muted mb-3">
          Tác giả: <span class="fw-medium text-dark">{{ book.TacGia }}</span>
        </p>

        <div class="book-price mb-4">
          <span class="current-price fw-bold">{{ formatCurrency(book.DonGia) }}</span>
        </div>

        <div class="d-flex align-items-center gap-2 mb-4">
          <!-- Quantity Selector -->
          <div v-if="book.SoLuongHienCo > 0">
            <label class="form-label small text-muted">Số lượng</label>
            <div class="input-group input-group-lg" style="width: 150px;">
              <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity" :disabled="borrowQuantity <= 1">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input type="text" class="form-control text-center fw-bold" :value="borrowQuantity" readonly>
              <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity" :disabled="borrowQuantity >= book.SoLuongHienCo">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <button 
            @click="handleBorrow" 
            class="btn btn-primary btn-lg px-4 py-2 align-self-end"
            :disabled="book.SoLuongHienCo <= 0"
          >
            <i class="fa-solid fa-cart-plus me-2"></i>
            {{ book.SoLuongHienCo > 0 ? 'Mượn Sách' : 'Đã hết' }}
          </button>
        </div>

        <hr class="my-4">

        <!-- Book Details Section -->
        <div class="book-meta">
          <h5 class="fw-semibold mb-3">Thông tin chi tiết</h5>
          <ul class="list-unstyled">
            <li><strong>Nhà xuất bản:</strong> {{ publisherName }}</li>
            <li><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</li>
            <li><strong>Số lượng còn lại:</strong> {{ book.SoLuongHienCo }} / {{ book.SoQuyen }} quyển</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
             <h5 class="modal-title w-100 text-center fw-bold">Đăng Ký Mượn Thành Công!</h5>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="fa-solid fa-circle-check text-success" style="font-size: 5rem;"></i>
            </div>
            <p>Yêu cầu mượn sách của bạn đã được gửi đi.</p>
            <p class="text-muted small">Vui lòng chờ nhân viên thư viện duyệt. Bạn có thể theo dõi trạng thái trong trang Lịch sử mượn sách.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-primary" @click="goToBorrowHistory">Xem Lịch Sử Mượn</button>
            <button type="button" class="btn btn-outline-secondary" @click="showSuccessModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Xác Nhận Mượn Sách</h5>
            <button type="button" class="btn-close" @click="showConfirmationModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Vui lòng kiểm tra lại thông tin đăng ký mượn sách:</p>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Tên sách:
                <span class="fw-bold text-end">{{ book.TenSach }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Số lượng:
                <span class="badge bg-primary rounded-pill fs-6">{{ borrowQuantity }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Ngày mượn:
                <span>{{ borrowDate }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <label for="returnDate" class="form-label mb-0">Ngày trả (dự kiến):</label>
                <input type="date" id="returnDate" class="form-control form-control-sm" style="width: 150px;" 
                       v-model="selectedReturnDate" :min="minReturnDate">
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showConfirmationModal = false">Hủy</button>
            <button type="button" class="btn btn-primary" @click="confirmBorrow" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ isSubmitting ? 'Đang xử lý...' : 'Xác Nhận' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookService from '@/services/Book.service.js';
import PublisherService from '@/services/Publisher.service.js';
import BorrowService from '@/services/Borrow.service.js';
import { useAuthStore } from '@/stores/auth.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const book = ref(null);
const publishers = ref([]);
const isLoading = ref(true);
const error = ref(null);
const borrowQuantity = ref(1); // Thêm ref để lưu số lượng mượn
const showConfirmationModal = ref(false); // State để điều khiển modal
const isSubmitting = ref(false); // State cho nút xác nhận
const showSuccessModal = ref(false); // State cho modal thông báo thành công
const selectedReturnDate = ref(''); // State cho ngày trả được chọn

// Lấy chi tiết sách và danh sách NXB khi component được tạo
onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const maSach = route.params.id;

    // Gọi API song song để tăng tốc độ tải trang
    const [bookData, publishersData] = await Promise.all([
      BookService.get(maSach),
      PublisherService.getAll()
    ]);

    book.value = bookData;
    publishers.value = publishersData;

  } catch (err) {
    console.error("Lỗi khi tải chi tiết sách:", err);
    if (err.response && err.response.status === 404) {
      error.value = "Không tìm thấy sách bạn yêu cầu. Sách có thể đã bị xóa hoặc không tồn tại.";
    } else {
      error.value = "Không thể tải dữ liệu sách. Vui lòng thử lại sau.";
    }
  } finally {
    isLoading.value = false;
  }
});

// Lấy đường dẫn hình ảnh, có fallback
const bookImage = computed(() => {
  if (book.value?.HinhAnh) {
    return book.value.HinhAnh.startsWith('http') ? book.value.HinhAnh : `http://localhost:3000${book.value.HinhAnh}`;
  }
  return `https://placehold.co/300x450?text=${encodeURIComponent(book.value?.TenSach || 'Book')}`;
});

// Tìm tên nhà xuất bản từ MaNXB
const publisherName = computed(() => {
  if (!book.value || !publishers.value.length) return 'Đang cập nhật...';
  const publisher = publishers.value.find(p => p.MaNXB === book.value.MaNXB);
  return publisher ? publisher.TenNXB : 'Không rõ';
});

// Ngày mượn và ngày trả dự kiến
const borrowDate = computed(() => new Date().toLocaleDateString('vi-VN'));

// Ngày trả tối thiểu là ngày mai
const minReturnDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

// Set ngày trả mặc định là 14 ngày kể từ hôm nay
selectedReturnDate.value = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0];

const openConfirmationModal = () => {
  // Validate quantity before opening modal
  if (borrowQuantity.value < 1 || (book.value && borrowQuantity.value > book.value.SoLuongHienCo)) {
    alert(`Số lượng mượn không hợp lệ. Vui lòng chọn từ 1 đến ${book.value.SoLuongHienCo}.`);
    return;
  }
  showConfirmationModal.value = true;
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  const numericValue = Number(value);
  // Nếu giá trị không phải là số, trả về 0 đ
  if (isNaN(numericValue)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numericValue);
};

// Hàm tăng/giảm số lượng
const decreaseQuantity = () => {
  if (borrowQuantity.value > 1) {
    borrowQuantity.value--;
  }
};
const increaseQuantity = () => {
  if (book.value && borrowQuantity.value < book.value.SoLuongHienCo) {
    borrowQuantity.value++;
  }
};

// Xử lý sự kiện mượn sách
const handleBorrow = () => {
  if (!authStore.user) {
    alert("Vui lòng đăng nhập để mượn sách.");
    router.push({ name: 'Login' });
    return;
  }
  openConfirmationModal();
};

// Hàm xác nhận mượn sách từ modal
const confirmBorrow = async () => {
  isSubmitting.value = true;
  try {
    // Gửi một yêu cầu duy nhất với số lượng
    await BorrowService.create({
      MaDocGia: authStore.user.MaDocGia,
      MaSach: book.value.MaSach,
      SoLuong: borrowQuantity.value,
      NgayMuon: new Date().toISOString().slice(0, 10),
      HanTra: selectedReturnDate.value,
      TrangThai: 'Đang chờ duyệt', // Thêm trạng thái mặc định
    });

    showConfirmationModal.value = false;
    showSuccessModal.value = true; // Hiển thị modal thành công

    // Tải lại thông tin sách ở chế độ nền để cập nhật số lượng
    BookService.get(book.value.MaSach).then(updatedBook => book.value = updatedBook);

  } catch (err) {
    console.error("Lỗi khi mượn sách:", err);
    alert(err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký mượn sách.");
  } finally {
    isSubmitting.value = false;
  }
};

const goToBorrowHistory = () => {
  showSuccessModal.value = false;
  router.push({ name: 'BorrowHistory' });
};
</script>

<style scoped>
.book-cover {
  width: 100%;
  max-width: 300px;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 12px;
}
.book-title {
  font-size: 2rem;
}
.current-price {
  font-size: 1.75rem;
  color: #d7100f;
}
.book-meta ul li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.book-meta ul li strong {
  color: #495057;
  min-width: 140px;
  display: inline-block;
}
</style>
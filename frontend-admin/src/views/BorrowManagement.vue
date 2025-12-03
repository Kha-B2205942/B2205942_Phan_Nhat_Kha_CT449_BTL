<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Mượn Sách</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Bộ lọc trạng thái -->
      <div class="btn-group" role="group">
        <button v-for="status in ['Tất cả', 'Đang chờ duyệt', 'Đã duyệt', 'Đã trả', 'Đã hủy']" 
                :key="status" 
                type="button" 
                class="btn btn-sm"
                :class="statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'"
                @click="statusFilter = status">
          {{ status }}
        </button>
      </div>

      <!-- Thanh tìm kiếm -->
      <div style="max-width: 400px;">
        <InputSearch v-model="searchText" placeholder="Tìm theo mã độc giả, mã sách..." />
      </div>
    </div>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Hiển thị component BorrowList và truyền dữ liệu vào -->
    <BorrowList 
      :filteredBorrows="filteredBorrows"
      :isLoading="isLoading"
      :updateBorrowStatus="handleUpdateStatus"
      :goToEditBorrow="goToEditBorrow"
      :deleteBorrow="deleteBorrow"
    />

    <!-- Edit Borrow Modal -->
    <div v-if="editingBorrow" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh Sửa Lượt Mượn</h5>
            <button type="button" class="btn-close" @click="editingBorrow = null"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Mã Độc Giả:</label>
              <input type="text" class="form-control" :value="editingBorrow.MaDocGia" disabled>
            </div>
            <div class="mb-3">
              <label class="form-label">Mã Sách:</label>
              <input type="text" class="form-control" :value="editingBorrow.MaSach" disabled>
            </div>
            <div class="mb-3">
              <label for="statusSelect" class="form-label">Trạng Thái:</label>
              <select id="statusSelect" class="form-select" v-model="newStatus">
                <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="editingBorrow = null">Hủy</button>
            <button type="button" class="btn btn-primary" @click="confirmUpdateStatus">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Date Modal -->
    <div v-if="returnDateModal.show" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác Nhận Trả Sách</h5>
            <button type="button" class="btn-close" @click="closeReturnDateModal"></button>
          </div>
          <div class="modal-body">
            <p>Vui lòng nhập ngày độc giả đã trả sách.</p>
            <div class="mb-3">
              <label for="returnDate" class="form-label">Ngày Trả:</label>
              <input type="date" id="returnDate" class="form-control" v-model="returnDateModal.date">
            </div>
            <div v-if="returnDateModal.error" class="text-danger">{{ returnDateModal.error }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeReturnDateModal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="confirmReturnDate">
              Xác Nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import InputSearch from '@/components/InputSearch.vue';
import BorrowList from '@/components/BorrowList.vue';
import BorrowService from '@/services/Borrow.service.js';
import BookService from '@/services/Book.service.js';

const borrows = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const editingBorrow = ref(null); // State để lưu thông tin lượt mượn đang sửa
const newStatus = ref(''); // State để lưu trạng thái mới được chọn trong modal
const returnDateModal = ref({ // State cho modal nhập ngày trả
  show: false,
  borrowId: null,
  date: new Date().toISOString().slice(0, 10),
  error: ''
});
const statusFilter = ref('Tất cả'); // State cho bộ lọc trạng thái

const filteredBorrows = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  let filtered = borrows.value;

  // 1. Lọc theo trạng thái
  if (statusFilter.value !== 'Tất cả') {
    filtered = filtered.filter(borrow => borrow.TrangThai === statusFilter.value);
  }

  // 2. Lọc theo từ khóa tìm kiếm
  if (!query) {
    return filtered;
  }
  return filtered.filter(borrow => 
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

const updateBorrowStatus = async (id, updateData) => {
  try {
    await BorrowService.update(id, updateData);
    await fetchBorrows(); // Tải lại danh sách để cập nhật giao diện
    // alert('Cập nhật trạng thái thành công!'); // Bỏ alert chung, xử lý riêng lẻ
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
    alert(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
    throw err; // Ném lỗi ra ngoài để hàm gọi có thể bắt
  }
};

const handleUpdateStatus = async (id, newStatusValue, fromModal = false) => {
  const borrow = borrows.value.find(b => String(b._id) === String(id));
  if (!borrow) return alert('Không tìm thấy lượt mượn.');

  const oldStatus = borrow.TrangThai;
  if (oldStatus === newStatusValue) return; // Không làm gì nếu trạng thái không đổi

  // Kiểm tra logic nghiệp vụ cơ bản ở frontend
  if (newStatusValue === 'Đã trả' && oldStatus === 'Đang chờ duyệt') {
    alert('Lượt mượn này cần được duyệt trước khi xác nhận trả sách.');
    return;
  }

  // 2. Xử lý các trường hợp đặc biệt (như modal ngày trả)
  if (newStatusValue === 'Đã trả' && oldStatus !== 'Đã trả') {
    openReturnDateModal(id);
    return; // Dừng lại và chờ xác nhận từ modal
  }

  // 3. Xác nhận và cập nhật
  const confirmMessage = `Bạn có chắc muốn đổi trạng thái từ "${oldStatus}" thành "${newStatusValue}"?`;
  if (fromModal || window.confirm(confirmMessage)) {
    try {
      // Chỉ cần gửi yêu cầu cập nhật trạng thái, backend sẽ xử lý logic số lượng
      const updateData = { TrangThai: newStatusValue };
      if (oldStatus === 'Đã trả' && newStatusValue !== 'Đã trả') {
        updateData.NgayTra = null;
      }
      await updateBorrowStatus(id, updateData);
      alert(`Đã cập nhật trạng thái thành công!`);
    } catch (error) {
      // Lỗi đã được alert trong hàm updateBorrowStatus
    }
  }
};

// Mở modal chỉnh sửa
const goToEditBorrow = (id) => {
  const borrowToEdit = borrows.value.find(b => String(b._id) === String(id));
  if (borrowToEdit) {
    editingBorrow.value = { ...borrowToEdit }; // Tạo bản sao để tránh thay đổi trực tiếp
    newStatus.value = borrowToEdit.TrangThai; // Gán trạng thái hiện tại cho select box
  }
};

// Hàm xác nhận cập nhật từ modal
const confirmUpdateStatus = async () => {
  if (!editingBorrow.value) return;  
  await handleUpdateStatus(editingBorrow.value._id, newStatus.value, true);
  editingBorrow.value = null;
};

const openReturnDateModal = (borrowId) => {
  const borrow = borrows.value.find(b => String(b._id) === String(borrowId));
  returnDateModal.value = {
    show: true,
    borrowId: borrowId,
    date: borrow?.NgayTra ? new Date(borrow.NgayTra).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    error: ''
  };
};

const closeReturnDateModal = () => {
  returnDateModal.value.show = false;
};

const confirmReturnDate = async () => {
  const { borrowId, date } = returnDateModal.value;
  if (!date) {
    returnDateModal.value.error = 'Ngày trả không được để trống.';
    return;
  }
  const updateData = { TrangThai: 'Đã trả', NgayTra: date };
  try {
    await updateBorrowStatus(borrowId, updateData);
    alert('Xác nhận trả sách thành công!');
    closeReturnDateModal();
  } catch (error) {
    // Lỗi đã được xử lý
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
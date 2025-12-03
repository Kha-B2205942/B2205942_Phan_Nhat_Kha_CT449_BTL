<template>
    <div class="table-responsive position-relative">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-info">
          <tr>
            <th>Mã Độc Giả</th>
            <th>Mã Sách</th>
            <th>Ngày Mượn</th>
            <th>Số Lượng</th>
            <th>Ngày Trả</th>
            <th>Hạn Trả</th>
            <th style="width: 150px;">Trạng Thái</th>
            <th style="width: 100px;">Chức Năng</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in filteredBorrows" :key="borrow._id">
            <td>{{ borrow.MaDocGia }}</td>
            <td>{{ borrow.MaSach }}</td>
            <td>{{ new Date(borrow.NgayMuon).toLocaleDateString('vi-VN') }}</td>
            <td class="fw-bold">{{ borrow.SoLuong }}</td> 
            <td>{{ borrow.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString('vi-VN') : 'Chưa trả' }}</td>
            <td :class="getHanTraClass(borrow)">
              <span v-if="borrow.HanTra">
                {{ new Date(borrow.HanTra).toLocaleDateString('vi-VN') }}
                <span v-if="isOverdue(borrow)" class="d-block small">(Quá hạn)</span>
              </span>
            </td>
            <td>
              <span class="badge" :class="getStatusClass(borrow.TrangThai)">
                {{ borrow.TrangThai }}
              </span>
            </td>
            <td>
              <!-- Nút duyệt nhanh -->
              <button v-if="borrow.TrangThai === 'Đang chờ duyệt'" class="btn btn-sm btn-success me-1" @click="updateBorrowStatus(borrow._id, 'Đã duyệt')" title="Duyệt">
                <i class="fa-solid fa-check"></i>
              </button>
              <!-- Nút xác nhận trả nhanh -->
              <button v-if="borrow.TrangThai === 'Đã duyệt'" class="btn btn-sm btn-primary me-1" @click="updateBorrowStatus(borrow._id, 'Đã trả')" title="Xác nhận đã trả">
                <i class="fa-solid fa-undo"></i>
              </button>
              <!-- Nút chỉnh sửa chung -->
              <button class="btn btn-sm btn-warning me-1" @click="goToEditBorrow(borrow._id)" title="Chỉnh sửa">
                <i class="fa-solid fa-pen"></i>
              </button>
              <!-- Nút xóa -->
              <button class="btn btn-sm btn-danger" @click="deleteBorrow(borrow._id)" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          
          <tr v-if="!isLoading && filteredBorrows.length === 0">
            <td colspan="8">Không có lượt mượn nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  filteredBorrows: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  updateBorrowStatus: {
    type: Function,
    required: true,
  },
  goToEditBorrow: {
    type: Function,
    required: false,
  },
  deleteBorrow: {
    type: Function,
    required: true,
  },
});

const getStatusClass = (status) => {
  if (status === 'Đã duyệt') return 'badge bg-success';
  if (status === 'Đang chờ duyệt') return 'badge bg-warning text-dark';
  if (status === 'Đã trả') return 'badge bg-secondary';
  if (status === 'Đã hủy') return 'badge bg-danger';
  return 'badge bg-info'; // Trạng thái khác
};

const isOverdue = (borrow) => {
  if (!borrow.HanTra || borrow.TrangThai === 'Đã trả' || borrow.TrangThai === 'Đã hủy') {
    return false;
  }
  const hanTraDate = new Date(borrow.HanTra);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  hanTraDate.setHours(0, 0, 0, 0);
  return hanTraDate < today;
};

const getHanTraClass = (borrow) => {
  if (isOverdue(borrow)) {
    return 'text-danger fw-bold';
  }
  return '';
};

</script>
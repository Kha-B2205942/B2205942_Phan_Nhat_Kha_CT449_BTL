<template>
    <div class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-info">
          <tr>
            <th>Mã Độc Giả</th>
            <th>Mã Sách</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
            <th style="width: 100px;">Chức Năng</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in filteredBorrows" :key="borrow._id">
            <td>{{ borrow.MaDocGia }}</td>
            <td>{{ borrow.MaSach }}</td>
            <td>{{ new Date(borrow.NgayMuon).toLocaleDateString('vi-VN') }}</td>
            <td>{{ borrow.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString('vi-VN') : 'Chưa trả' }}</td>
            <td>
              <span :class="getStatusClass(borrow.TrangThai)">
                {{ borrow.TrangThai }}
              </span>
            </td>
            <td>
              <button v-if="borrow.TrangThai === 'Đang chờ duyệt'" class="btn btn-sm btn-success me-1" @click="updateBorrowStatus(borrow._id, 'Đã duyệt')" title="Duyệt"><i class="fa-solid fa-check"></i></button>
              <button v-if="borrow.TrangThai === 'Đã duyệt'" class="btn btn-sm btn-primary me-1" @click="updateBorrowStatus(borrow._id, 'Đã trả')" title="Xác nhận đã trả"><i class="fa-solid fa-undo"></i></button>
              <button class="btn btn-sm btn-primary me-1" @click="goToEditBorrow(borrow._id)" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-danger" @click="deleteBorrow(borrow._id)" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          
          <tr v-if="!isLoading && filteredBorrows.length === 0">
            <td colspan="6">Không có lượt mượn nào.</td>
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
  deleteBorrow: {
    type: Function,
    required: true,
  },
});

const getStatusClass = (status) => {
  if (status === 'Đã duyệt') return 'badge bg-success';
  if (status === 'Đang chờ duyệt') return 'badge bg-warning text-dark';
  if (status === 'Đã trả') return 'badge bg-secondary';
  return 'badge bg-danger'; // Ví dụ: 'Đã hủy'
};
</script>
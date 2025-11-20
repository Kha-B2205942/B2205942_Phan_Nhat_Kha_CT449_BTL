<template>
    <div class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-info">
          <tr>
            <th>Mã Độc Giả</th>
            <th>Họ Lót</th>
            <th>Tên</th>
            <th>Ngày Sinh</th>
            <th>Phái</th>
            <th>Địa Chỉ</th>
            <th>Điện Thoại</th>
            <th style="width: 100px;">Chức Năng</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in filteredReaders" :key="reader.MaDocGia">
            <td>{{ reader.MaDocGia }}</td>
            <td>{{ reader.HoLot }}</td>
            <td>{{ reader.Ten }}</td>
            <td>{{ reader.NgaySinh ? new Date(reader.NgaySinh).toLocaleDateString('vi-VN') : '' }}</td>
            <td>{{ reader.Phai }}</td>
            <td>{{ reader.DiaChi }}</td>
            <td>{{ reader.DienThoai }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="goToEditReader(reader.MaDocGia)" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-danger" @click="deleteReader(reader.MaDocGia)" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          
          <tr v-if="!isLoading && filteredReaders.length === 0">
            <td colspan="8">Không tìm thấy độc giả nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
// Định nghĩa các props mà component này sẽ nhận từ component cha
defineProps({
  filteredReaders: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  goToEditReader: {
    type: Function,
    required: true,
  },
  deleteReader: {
    type: Function,
    required: true,
  },
})
</script>
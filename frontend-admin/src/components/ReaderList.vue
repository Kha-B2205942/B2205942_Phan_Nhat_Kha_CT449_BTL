<template>
    <div class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-info">
          <tr>
            <th>Mã Sách</th>
            <th>Tên Sách</th>
            <th>Đơn Giá</th>
            <th>Số Quyển</th>
            <th>SL Hiện Có</th>
            <th>Năm XB</th>
            <th>Mã NXB</th>
            <th>Tác Giả</th>
            <th style="width: 100px;">Chức Năng</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.MaSach">
            <td>{{ book.MaSach }}</td>
            <td>{{ book.TenSach }}</td>
            <td>{{ book.DonGia}} Vnđ</td>
            <td>{{ book.SoQuyen }}</td>
            <td>{{ book.SoQuyen }}</td>
            <td>{{ book.NamXuatBan }}</td>
            <td>{{ book.MaNXB }}</td>
            <td>{{ book.TacGia }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="goToEditBook(book.MaSach)" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-danger" @click="deleteBook(book.MaSach)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          
          <tr v-if="!isLoading && filteredBooks.length === 0">
            <td colspan="9">Không tìm thấy sách phù hợp.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Định nghĩa các props mà component này sẽ nhận từ component cha
defineProps({
  filteredBooks: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  goToEditBook: {
    type: Function,
    required: true,
  },
  deleteBook: {
    type: Function,
    required: true,
  },
});
</script>
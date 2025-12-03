<template>
  <div class="table-responsive">
    <table class="table table-bordered align-middle text-center">
      <thead class="table-info">
        <tr>
          <th style="width: 100px;">Ảnh Bìa</th>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Đơn Giá</th>
          <th>Số Quyển</th>
          <th>SL Hiện Có</th>
          <th>Năm XB</th>
          <th>NXB</th>
          <th>Tác Giả</th>
          <th style="width: 100px;">Chức Năng</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="book in filteredBooks" :key="book.MaSach">
          <td>
            <img
              :src="getImage(book.HinhAnh)"
              :alt="book.TenSach"
              class="book-thumb"
            />
          </td>

          <td>{{ book.MaSach }}</td>
          <td>{{ book.TenSach }}</td>
          <td>{{ formatCurrency(book.DonGia) }}</td>
          <td>{{ book.SoQuyen }}</td>
          <td>
            {{ book.SoLuongHienCo }}
          </td>
          <td>{{ book.NamXuatBan }}</td>
          <td>{{ book.MaNXB }}</td>
          <td>{{ book.TacGia }}</td>

          <td>
            <button
              class="btn btn-sm btn-primary me-1"
              title="Chỉnh sửa"
              @click="goToEditBook(book.MaSach)"
            >
              <i class="fa-solid fa-pen"></i>
            </button>

            <button
              class="btn btn-sm btn-danger"
              title="Xóa"
              @click="deleteBook(book.MaSach)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>

        <tr v-if="!isLoading && filteredBooks.length === 0">
          <td colspan="10">Không tìm thấy sách nào.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  filteredBooks: Array,
  isLoading: Boolean,
  goToEditBook: Function,
  deleteBook: Function,
});

// -----------------------
// HELPER FUNCTIONS
// -----------------------
const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const getImage = (path) => {
  if (!path) {
    return "https://via.placeholder.com/80x110.png?text=No+Image";
  }
  // Nếu path chứa localhost, trả về nguyên path
  if (path.includes('localhost') || path.includes('http')) {
    return path;
  }
  // Nếu không, thêm baseURL
  return `http://localhost:3000${path}`;
};

</script>

<style scoped>
.book-thumb {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

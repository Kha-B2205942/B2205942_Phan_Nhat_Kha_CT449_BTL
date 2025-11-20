<template>
  <div class="table-responsive">
    <table class="table table-bordered align-middle text-center">
      <thead class="table-info">
        <tr>
          <th>MSNV</th>
          <th>Họ và Tên</th>
          <th>Chức Vụ</th>
          <th>Địa Chỉ</th>
          <th>Số Điện Thoại</th>
          <th style="width: 100px;">Chức Năng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in filteredEmployees" :key="employee.MSNV">
          <td>{{ employee.MSNV }}</td>
          <td>{{ employee.HoTenNV }}</td>
          <td>{{ employee.ChucVu }}</td>
          <td>{{ employee.DiaChi }}</td>
          <td>{{ employee.SoDienThoai }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" @click="goToEditEmployee(employee.MSNV)" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" @click="deleteEmployee(employee.MSNV)" title="Xóa"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
        <tr v-if="!isLoading && filteredEmployees.length === 0">
          <td colspan="6">Không tìm thấy nhân viên phù hợp.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  filteredEmployees: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  goToEditEmployee: {
    type: Function,
    required: true,
  },
  deleteEmployee: {
    type: Function,
    required: true,
  },
});
</script>
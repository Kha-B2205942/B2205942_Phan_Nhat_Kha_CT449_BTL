<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Nhân Viên</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="goToAddEmployee"><i class="fa-solid fa-plus me-1"></i>Thêm mới</button>
      </div>
      <!-- Thanh tìm kiếm -->
      <div>
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Hiển thị component EmployeeList và truyền dữ liệu vào -->
    <EmployeeList 
      :filteredEmployees="filteredEmployees"
      :isLoading="isLoading"
      :goToEditEmployee="goToEditEmployee"
      :deleteEmployee="deleteEmployee"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue';
import EmployeeList from '@/components/EmployeeList.vue';
import EmployeeService from '@/services/Employee.service.js';

const employees = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();

const filteredEmployees = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  if (!query) {
    return employees.value;
  }

  // Lọc nhân viên theo Tên, MSNV, Số điện thoại, Chức vụ, hoặc Địa chỉ
  return employees.value.filter(employee => 
    employee.HoTenNV?.toLowerCase().includes(query) ||
    employee.MSNV?.toLowerCase().includes(query) ||
    employee.SoDienThoai?.toLowerCase().includes(query) ||
    employee.ChucVu?.toLowerCase().includes(query) ||
    employee.DiaChi?.toLowerCase().includes(query)
  );
});

const fetchEmployees = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    employees.value = await EmployeeService.getAll();
  } catch (err) {
    console.error("Lỗi tải danh sách nhân viên:", err);
    error.value = "Không thể tải danh sách nhân viên. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

const deleteEmployee = async (MSNV) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên có mã "${MSNV}" không?`)) {
    try {
      await EmployeeService.delete(MSNV);
      await fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      console.error("Lỗi khi xóa nhân viên:", err);
      alert("Đã xảy ra lỗi khi xóa nhân viên. Vui lòng thử lại.");
    }
  }
};

const goToAddEmployee = () => {
  router.push({ name: 'EmployeeAdd' });
};

const goToEditEmployee = (MSNV) => {
  router.push({ name: 'EmployeeEdit', params: { MSNV: MSNV } });
};

onMounted(() => {
  fetchEmployees();
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
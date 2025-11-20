<template>
  <div>
    <h4 class="fw-bold mb-3">Danh Sách Nhà Xuất Bản</h4>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button class="btn btn-primary me-2" @click="goToAddPublisher"><i class="fa-solid fa-plus me-1"></i>Thêm Nhà Xuất Bản</button>
      </div>
      <!-- Thanh tìm kiếm -->
      <div>
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Hiển thị component BookList và truyền dữ liệu vào -->
    <PublisherList 
      :filteredPublishers="filteredPublishers"
      :isLoading="isLoading"
      :goToEditPublisher="goToEditPublisher"
      :deletePublisher="deletePublisher"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import InputSearch from '@/components/InputSearch.vue'; // Import component InputSearch
import PublisherList from '@/components/PublisherList.vue'; // Import component PublisherList
import PublisherService from '@/services/Publisher.service.js'; // Import PublisherService

const publishers = ref([]);
const searchText = ref('');
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();

const filteredPublishers = computed(() => {
  const query = searchText.value.toLowerCase().trim();
  if (!query) {
    return publishers.value; // Nếu không có từ khóa, trả về toàn bộ danh sách
  }

  // Lọc nhà xuất bản theo Tên NXB hoặc Mã NXB
  return publishers.value.filter(publisher => 
    publisher.TenNXB.toLowerCase().includes(query) ||
    publisher.MaNXB.toLowerCase().includes(query)
  );
});

const fetchPublishers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // Sử dụng PublisherService để lấy dữ liệu
    publishers.value = await PublisherService.getAll();
  } catch (err) {
    console.error("Lỗi tải nhà xuất bản:", err);
    error.value = "Không thể tải danh sách nhà xuất bản. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

const deletePublisher = async (MaNXB) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản có mã "${MaNXB}" không?`)) {
    try {
      // Sử dụng PublisherService để xóa
      await PublisherService.delete(MaNXB);
      // Tải lại danh sách nhà xuất bản sau khi xóa thành công
      await fetchPublishers();
    } catch (err) {
      console.error("Lỗi khi xóa nhà xuất bản:", err);
      alert("Đã xảy ra lỗi khi xóa nhà xuất bản. Vui lòng thử lại.");
    }
  }
};

const goToAddPublisher = () => {
  router.push({ name: 'PublisherAdd' });
};

const goToEditPublisher = (MaNXB) => {
  router.push({ name: 'PublisherEdit', params: { MaNXB: MaNXB } });
};

onMounted(() => {
  fetchPublishers();
});

// Theo dõi sự thay đổi của route để tải lại dữ liệu nếu cần
watch(() => router.currentRoute.value, (to, from) => {
    if (to.name === 'PublisherManagement' && from.name && (from.name === 'PublisherEdit' || from.name === 'PublisherAdd')) {
        fetchPublishers();
    }
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
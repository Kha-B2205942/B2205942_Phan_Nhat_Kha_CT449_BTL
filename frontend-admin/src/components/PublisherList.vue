<template>
    <div class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-info">
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa Chỉ</th>
            <th style="width: 100px;">Chức Năng</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in filteredPublishers" :key="publisher.MaNXB">
            <td>{{ publisher.MaNXB }}</td>
            <td>{{ publisher.TenNXB }}</td>
            <td>{{ publisher.DiaChi }}</td>
            <td>
              <button 
                class="btn btn-sm btn-primary me-1" 
                @click="goToEditPublisher(publisher.MaNXB)" 
                title="Chỉnh sửa"
              ><i class="fa-solid fa-pen"></i></button>
              <button 
                class="btn btn-sm btn-danger" 
                @click="deletePublisher(publisher.MaNXB)"
                title="Xóa"
              ><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          
          <tr v-if="!isLoading && filteredPublishers.length === 0">
            <td colspan="4">Không tìm thấy nhà xuất bản phù hợp.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Định nghĩa các props mà component này sẽ nhận từ component cha
defineProps({ 
  filteredPublishers: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  goToEditPublisher: {
    type: Function,
    required: true,
  },
  deletePublisher: {
    type: Function,
    required: true,
  },
});
</script>
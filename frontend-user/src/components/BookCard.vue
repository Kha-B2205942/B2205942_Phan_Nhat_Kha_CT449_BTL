<template>
  <RouterLink
    :to="{ name: 'BookDetail', params: { id: book.MaSach } }"
    class="text-decoration-none text-dark"
  >
    <div
      class="d-flex p-2 shadow-sm bg-white position-relative"
      style="width: 100%; border-radius: 14px; align-items: flex-start; min-height: 135px;"
    >
      <!-- LEFT: Book Cover -->
      <img
        :src="bookImage"
        class="rounded"
        style="width: 95px; height: 135px; object-fit: cover;"
        :alt="book.TenSach"
      />
  
      <!-- RIGHT: Content -->
      <div class="ms-3 d-flex flex-column" style="flex: 1; padding-bottom: 30px;">
        <!-- Title -->
        <div
          class="fw-semibold text-truncate"
          style="font-size: 16px; line-height: 1.2; max-width: 180px;"
        >
          {{ book.TenSach }}
        </div>
  
        <!-- Author -->
        <div class="text-muted d-flex align-items-center mb-1" style="font-size: 14px;">
          <i class="bi bi-person"></i>
          <span class="ms-1">{{ book.TacGia }}</span>
        </div>
  
        <!-- Price -->
        <div class="fw-bold mt-auto" style="font-size: 17px;">
          {{ formatCurrency(book.DonGia) }}
        </div>
      </div>
  
      <!-- Borrow Button -->
      <button 
        class="btn btn-primary btn-sm position-absolute" 
        style="bottom: 8px; right: 8px;"
        @click.prevent.stop="$emit('borrow-click', book)">
        <i class="fa-solid fa-cart-plus me-1"></i>Mượn
      </button>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed, defineEmits } from 'vue';

// Định nghĩa sự kiện mà component có thể phát ra
const emit = defineEmits(['borrow-click']);

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const bookImage = computed(() => {
  if (props.book.HinhAnh) {
    return props.book.HinhAnh.startsWith('http') ? props.book.HinhAnh : `http://localhost:3000${props.book.HinhAnh}`;
  }
  return `https://placehold.co/95x135?text=No+Image`;
});

const formatCurrency = (value) => {
  if (!value && value !== 0) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
</script>

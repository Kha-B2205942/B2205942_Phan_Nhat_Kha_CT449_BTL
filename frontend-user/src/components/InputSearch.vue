<template>
    <div class="input-group">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Nhập thông tin cần tìm..."
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <span class="input-group-text"><i class="fas fa-search"></i></span>
      </div>
</template>

<script setup>
// Định nghĩa prop 'modelValue' để tương thích với v-model
defineProps(['modelValue']);

// Định nghĩa event 'update:modelValue' để cập nhật giá trị cho component cha
defineEmits(['update:modelValue']);
</script>
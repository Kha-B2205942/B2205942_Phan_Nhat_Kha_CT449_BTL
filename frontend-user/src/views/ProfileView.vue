<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { authApiService } from '@/services/api.service';// Dùng apiService thường, nhưng cần auth (chúng ta đã cấu hình interceptor rồi)

const authStore = useAuthStore();
const activeTab = ref('info'); // 'info' hoặc 'password'
const loading = ref(false);
const message = ref({ type: '', text: '' }); // { type: 'success' | 'danger', text: '...' }

// Dữ liệu form thông tin
const userInfo = ref({
    HoTen: '', NgaySinh: '', Phai: 'Nam', DiaChi: '', DienThoai: ''
});

// Dữ liệu form đổi mật khẩu
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Hàm định dạng ngày tháng cho input type="date"
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

// Lấy thông tin user mới nhất từ Server
async function fetchProfile() {
    // Vì ta chưa có API get /profile, ta có thể dùng lại thông tin trong authStore
    // Hoặc gọi API get user by ID. Ở đây tạm dùng authStore cho nhanh
    const user = authStore.user;
    
    // Sao chép và định dạng lại ngày sinh
    userInfo.value = { 
        ...user, 
        NgaySinh: formatDateForInput(user.NgaySinh) 
    };
}

// Cập nhật thông tin
async function handleUpdateProfile() {
    loading.value = true;
    try {
        const response = await authApiService.put('/docgia/profile', userInfo.value);
        message.value = { type: 'success', text: 'Cập nhật thông tin thành công!' };
        // Cập nhật lại kho Pinia và LocalStorage
        // Sử dụng action của store để cập nhật một cách nhất quán
        authStore.updateUser(response.data.user);
    } catch (err) {
        message.value = { type: 'danger', text: "Lỗi: " + (err.response?.data?.message || err.message) };
    } finally {
        loading.value = false;
        setTimeout(() => {
            message.value.text = '';
        }, 5000);
    }
}

// Đổi mật khẩu
async function handleChangePassword() {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return; // Giữ lại alert cho lỗi client-side nhanh
    }
    
    loading.value = true;
    try {
        await authApiService.post('/docgia/change-password', {
            oldPassword: passwordForm.value.oldPassword,
            newPassword: passwordForm.value.newPassword
        });
        // Không cần set message vì sẽ logout ngay
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại."); 
        authStore.logout();
    } catch (err) {
        message.value = { type: 'danger', text: "Lỗi: " + (err.response?.data?.message || err.message) };
    } finally {
        loading.value = false;
    }
}

// Xóa message khi chuyển tab
watch(activeTab, () => {
    message.value.text = '';
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
});

onMounted(() => {
    fetchProfile();
});
</script>

<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white border-bottom-0 pt-4 pb-0">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <a class="nav-link fw-bold" :class="{ active: activeTab === 'info' }" href="#" @click.prevent="activeTab = 'info'">
                                    <i class="fa-solid fa-user me-2"></i> Thông tin cá nhân
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-bold" :class="{ active: activeTab === 'password' }" href="#" @click.prevent="activeTab = 'password'">
                                    <i class="fa-solid fa-key me-2"></i> Đổi mật khẩu
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body p-4">
                        <!-- Thông báo -->
                        <div v-if="message.text" :class="`alert alert-${message.type}`" role="alert">
                            {{ message.text }}
                        </div>

                        <!-- Form thông tin cá nhân -->
                        <form v-if="activeTab === 'info'" @submit.prevent="handleUpdateProfile">
                            <div class="mb-3">
                                <label for="hoTen" class="form-label">Họ và Tên</label>
                                <input type="text" id="hoTen" class="form-control" v-model="userInfo.HoTen" required>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="ngaySinh" class="form-label">Ngày sinh</label>
                                    <input type="date" class="form-control" v-model="userInfo.NgaySinh">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Giới tính</label>
                                    <div class="d-flex align-items-center h-100">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" id="male" value="Nam" v-model="userInfo.Phai">
                                            <label class="form-check-label" for="male">Nam</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" id="female" value="Nữ" v-model="userInfo.Phai">
                                            <label class="form-check-label" for="female">Nữ</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="dienThoai" class="form-label">Điện thoại</label>
                                <input type="tel" class="form-control" v-model="userInfo.DienThoai">
                            </div>
                            <div class="mb-3">
                                <label for="diaChi" class="form-label">Địa chỉ</label>
                                <input type="text" class="form-control" v-model="userInfo.DiaChi">
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                <i v-else class="fa-solid fa-save me-1"></i>
                                {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </form>

                        <!-- Form đổi mật khẩu -->
                        <form v-if="activeTab === 'password'" @submit.prevent="handleChangePassword">
                            <div class="mb-3">
                                <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
                                <input type="password" class="form-control" v-model="passwordForm.oldPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">Mật khẩu mới</label>
                                <input type="password" class="form-control" v-model="passwordForm.newPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
                                <input type="password" class="form-control" v-model="passwordForm.confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                <i v-else class="fa-solid fa-shield-halved me-1"></i>
                                {{ loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
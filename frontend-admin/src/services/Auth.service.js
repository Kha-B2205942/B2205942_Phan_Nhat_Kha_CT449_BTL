import createApiClient from './api.service';

class AuthService {
    constructor(baseUrl = '/api/nhanvien') {
        this.api = createApiClient(baseUrl);
    }

    async login(credentials) {
        try {
            const response = await this.api.post('/login', credentials);
            const { token, user } = response.data;

            // Lưu token và thông tin người dùng vào localStorage
            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Lỗi trong quá trình đăng nhập:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default new AuthService();
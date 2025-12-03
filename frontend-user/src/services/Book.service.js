import { apiService } from './api.service';

class BookService {
    async getAll() {
        return (await apiService.get('/sach')).data;
    }

    async get(MaSach) {
        return (await apiService.get(`/sach/${MaSach}`)).data;
    }
}

export default new BookService();
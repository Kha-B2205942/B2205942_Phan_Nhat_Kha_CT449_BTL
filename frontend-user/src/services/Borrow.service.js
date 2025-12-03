import { authApiService } from './api.service';

class BorrowService {
    async create(data) {
        return (await authApiService.post('/muon', data)).data;
    }

    async getAll() {
        return (await authApiService.get('/muon')).data;
    }

    async findByReader(readerId) {
        return (await authApiService.get(`/muon/reader/${readerId}`)).data;
    }

    async update(id, data) {
        return (await authApiService.put(`/muon/${id}`, data)).data;
    }
}

export default new BorrowService();

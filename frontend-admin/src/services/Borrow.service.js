import createApiClient from "./api.service";

class BorrowService {
    constructor(baseUrl = "/api/muon") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async findByReader(readerId) {
        return (await this.api.get(`/borrows/reader/${readerId}`)).data;
    }
}

export default new BorrowService();
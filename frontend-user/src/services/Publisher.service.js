import { apiService } from "./api.service";

class PublisherService {
    async getAll() {
        return (await apiService.get("/nhaxuatban")).data;
    }

    async get(id) {
        return (await apiService.get(`/nhaxuatban/${id}`)).data;
    }
}

export default new PublisherService();
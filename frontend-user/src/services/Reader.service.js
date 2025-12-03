import { apiService } from "./api.service";

class ReaderService {
  async register(data) {
      return (await apiService.post("/docgia", data)).data;
  }
  async getAll() {
      return (await apiService.get("/docgia")).data;
  }
  async create(data) {
      return (await apiService.post("/docgia", data)).data;
  }
  async get(MaDocGia) {
      return (await apiService.get(`/docgia/${MaDocGia}`)).data;
  }
  async update(MaDocGia, data) {
      return (await apiService.put(`/docgia/${MaDocGia}`, data)).data;
  }
  async delete(MaDocGia) {
      return (await apiService.delete(`/docgia/${MaDocGia}`)).data;
  }
}
export default new ReaderService();
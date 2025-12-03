import createApiClient from "./api.service";

class BookService {
    constructor(baseUrl = "/api/sach") {
      this.api = createApiClient(baseUrl); // For JSON data
      this.apiMultipart = createApiClient(baseUrl, true); // For multipart/form-data
      this.uploadApi = createApiClient("/api/upload"); // For upload endpoint
  }
  async getAll() {
      return (await this.api.get("/")).data;
  }
  async create(data) {
      // Nếu data là FormData, sử dụng apiMultipart
      const api = data instanceof FormData ? this.apiMultipart : this.api;
      return (await api.post("/", data)).data;
  }
  async deleteAll() {
      return (await this.api.delete("/")).data;
  }
  async get(MaSach) {
      return (await this.api.get(`/${MaSach}`)).data;
  }
  async update(MaSach, data) {
      // Nếu data là FormData, sử dụng apiMultipart
      const api = data instanceof FormData ? this.apiMultipart : this.api;
      return (await api.put(`/${MaSach}`, data)).data;
  }
  async delete(MaSach) {
      return (await this.api.delete(`/${MaSach}`)).data;
  }
  async uploadImage(file) {
      const formData = new FormData();
      formData.append('file', file);
      return (await this.uploadApi.post("/", formData)).data;
  }
}
export default new BookService();
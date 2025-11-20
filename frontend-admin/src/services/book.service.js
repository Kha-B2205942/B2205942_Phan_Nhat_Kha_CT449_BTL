import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/sach") {
      this.api = createApiClient(baseUrl);
  }
  async getAll() {
      return (await this.api.get("/")).data;
  }
  async create(data) {
      return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
      return (await this.api.delete("/")).data;
  }
  async get(MaSach) {
      return (await this.api.get(`/${MaSach}`)).data;
  }
  async update(MaSach, data) {
      return (await this.api.put(`/${MaSach}`, data)).data;
  }
  async delete(MaSach) {
      return (await this.api.delete(`/${MaSach}`)).data;
  }
}
export default new BookService();
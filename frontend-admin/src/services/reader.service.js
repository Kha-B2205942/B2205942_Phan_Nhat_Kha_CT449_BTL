import createApiClient from "./api.service";

class bookService {
  constructor(baseUrl = "/api/docgia") {
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
  async get(MaDocGia) {
      return (await this.api.get(`/${MaDocGia}`)).data;
  }
  async update(MaDocGia, data) {
      return (await this.api.put(`/${MaDocGia}`, data)).data;
  }
  async delete(MaDocGia) {
      return (await this.api.delete(`/${MaDocGia}`)).data;
  }
}
export default new bookService();
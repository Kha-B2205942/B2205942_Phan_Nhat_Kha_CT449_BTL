import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/nhaxuatban") {
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
  async get(MaNXB) {
      return (await this.api.get(`/${MaNXB}`)).data;
  }
  async update(MaNXB, data) {
      return (await this.api.put(`/${MaNXB}`, data)).data;
  }
  async delete(MaNXB) {
      return (await this.api.delete(`/${MaNXB}`)).data;
  }
}
export default new PublisherService();
import createApiClient from "./api.service";

class EmployeeService {
    constructor(baseUrl = "/api/nhanvien") {
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
    async get(MSNV) {
        return (await this.api.get(`/${MSNV}`)).data;
    }
    async update(MSNV, data) {
        return (await this.api.put(`/${MSNV}`, data)).data;
    }
    async delete(MSNV) {
        return (await this.api.delete(`/${MSNV}`)).data;
    }
}
export default new EmployeeService();
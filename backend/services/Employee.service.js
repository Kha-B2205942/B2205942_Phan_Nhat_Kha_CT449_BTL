const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class EmployeeService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  extractNhanVienData(payload) {
    const nhanvien = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
    };

    Object.keys(nhanvien).forEach(
      (key) => nhanvien[key] === undefined && delete nhanvien[key]
    );

    return nhanvien;
  }

  async create(payload) {
    const existing = await this.NhanVien.findOne({ MSNV: payload.MSNV });
    if (existing) {
      throw new Error(`Mã nhân viên ${payload.MSNV} đã tồn tại`);
    }

    const hashedPassword = await bcrypt.hash(payload.Password, 10);

    const nhanvienData = this.extractNhanVienData(payload);
    nhanvienData.Password = hashedPassword; // Sử dụng mật khẩu đã được mã hóa
    const result = await this.NhanVien.insertOne(nhanvienData);

    return result.acknowledged ? nhanvienData : null;
  }

  async find(filter) {
    return await this.NhanVien.find(filter).toArray();
  }

  async findByName(HoTenNV) {
    return await this.find({
      HoTenNV: { $regex: new RegExp(HoTenNV, "i") },
    });
  }

  async findByMSNV(MSNV) {
    return await this.NhanVien.findOne({ MSNV: MSNV });
  }

  async update(MSNV, payload) {
    const updateData = this.extractNhanVienData(payload);

    if (updateData.Password) {
      updateData.Password = await bcrypt.hash(updateData.Password, 10); // Mã hóa mật khẩu mới
    }

    const result = await this.NhanVien.findOneAndUpdate(
      { MSNV },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(MSNV) {
    return await this.NhanVien.findOneAndDelete({ MSNV: MSNV });
  }

  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = EmployeeService;

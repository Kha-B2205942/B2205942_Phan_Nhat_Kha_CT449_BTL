const { ObjectId } = require("mongodb");

class NhanVienService {
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
      SoDienThoai: payload.SoDienThoai
    };
    Object.keys(nhanvien).forEach(
      (key) => nhanvien[key] === undefined && delete nhanvien[key]
    );
    return nhanvien;
  }

    async create(payload) {
        const nhanvien = this.extractNhanVienData(payload);
        const existing = await this.NhanVien.findOne({ MSNV: nhanvien.MSNV });
        if (existing) {
            throw new Error(`Mã độc giả ${nhanvien.MSNV} đã tồn tại`);
        }
        const result = await this.NhanVien.insertOne(nhanvien);
        if (result.acknowledged) {
            return nhanvien;
        }
        return null;
    }

    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
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
        const update = this.extractNhanVienData(payload);
        const result = await this.NhanVien.findOneAndUpdate(
            { MSNV: MSNV },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MSNV) {
        const result = await this.NhanVien.findOneAndDelete({
            MSNV: MSNV
        });
        return result;
    }

    async deleteAll() {
        const result = await this.NhanVien.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NhanVienService;

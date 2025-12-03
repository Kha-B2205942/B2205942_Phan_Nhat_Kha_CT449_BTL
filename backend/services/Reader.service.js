const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class ReaderService {
    constructor(client) {
      this.DocGia = client.db().collection("docgia");
    }

    extractDocGiaData(payload) {
      const docgia = {
        MaDocGia: payload.MaDocGia,
        HoTen: payload.HoTen,
        Password: payload.Password,
        NgaySinh: payload.NgaySinh,
        Phai: payload.Phai,
        DiaChi: payload.DiaChi,
        DienThoai: payload.DienThoai,
      };
      Object.keys(docgia).forEach(
        (key) => docgia[key] === undefined && delete docgia[key]
      );
      return docgia;
    }

    async create(payload) {
        const docgia = this.extractDocGiaData(payload);
        const existing = await this.DocGia.findOne({ MaDocGia: docgia.MaDocGia });
        if (existing) {
            throw new Error(`Mã độc giả ${docgia.MaDocGia} đã tồn tại`);
        }
        // Hash mật khẩu trước khi lưu
        if (docgia.Password) {
            docgia.Password = await bcrypt.hash(docgia.Password, 10);
        }
        const result = await this.DocGia.insertOne(docgia);
        if (result.acknowledged) {
            return docgia;
        }
        return null;
    }

    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }

    async findByName(HoTen) {
        return await this.find({
        HoTen: { $regex: new RegExp(HoTen, "i") },
        });
    }

    async findByMaDocGia(MaDocGia) {
    return await this.DocGia.findOne({ MaDocGia: MaDocGia });
    }

    async update(MaDocGia, payload) {
        const update = this.extractDocGiaData(payload);
        // Hash mật khẩu nếu có cập nhật
        if (update.Password) {
            update.Password = await bcrypt.hash(update.Password, 10);
        }
        const result = await this.DocGia.findOneAndUpdate(
            { MaDocGia: MaDocGia },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MaDocGia) {
        const result = await this.DocGia.findOneAndDelete({
            MaDocGia: MaDocGia
        });
        return result;
    }

    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ReaderService;

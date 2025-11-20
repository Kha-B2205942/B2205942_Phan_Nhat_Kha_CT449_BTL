const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.Sach = client.db().collection("sach");
    }

    extractSachData(payload) {
        const sach = {
            MaSach: payload.MaSach,
            TenSach: payload.TenSach,
            DonGia: payload.DonGia,
            SoQuyen: payload.SoQuyen,
            SoLuongHienCo: payload.SoLuongHienCo,
            NamXuatBan: payload.NamXuatBan,
            MaNXB: payload.MaNXB,
            TacGia: payload.TacGia,
        };

        Object.keys(sach).forEach(
        (key) => sach[key] === undefined && delete sach[key]
        );

        return sach;
    }

    async create(payload) {
        const sach = this.extractSachData(payload);
        // Khởi tạo số lượng hiện có bằng tổng số quyển nếu không được cung cấp
        if (sach.SoLuongHienCo === undefined) {
            sach.SoLuongHienCo = sach.SoQuyen;
        }
        const existing = await this.Sach.findOne({ MaSach: sach.MaSach });
        if (existing) {
            throw new Error(`Mã sách ${sach.MaSach} đã tồn tại`);
        }
        const result = await this.Sach.insertOne(sach);
        if (result.acknowledged) {
            return sach;
        }
        return null;
    }

    async find(filter) {
        const cursor = await this.Sach.find(filter);
        return await cursor.toArray();
    }

    async findByName(TenSach) {
        return await this.find({
        TenSach: { $regex: new RegExp(TenSach, "i") },
        });
    }

    async findByMaSach(MaSach) {
    return await this.Sach.findOne({ MaSach: MaSach });
    }

    async update(MaSach, payload) {
        const update = this.extractSachData(payload);
        const result = await this.Sach.findOneAndUpdate(
            { MaSach: MaSach },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MaSach) {
        const result = await this.Sach.findOneAndDelete({
            MaSach: MaSach
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Sach.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;

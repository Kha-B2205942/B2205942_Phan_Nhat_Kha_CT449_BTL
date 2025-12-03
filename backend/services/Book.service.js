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
            HinhAnh: payload.HinhAnh, // Thêm trường ảnh
        };

        Object.keys(sach).forEach(
        (key) => sach[key] === undefined && delete sach[key]
        );

        return sach;
    }

    async create(payload) {
        const sach = this.extractSachData(payload);
        // Chuẩn hóa và khởi tạo số lượng hiện có
        sach.SoQuyen = sach.SoQuyen !== undefined ? parseInt(sach.SoQuyen) || 0 : 0;
        if (sach.SoLuongHienCo === undefined) {
            sach.SoLuongHienCo = sach.SoQuyen;
        } else {
            // Nếu client truyền SoLuongHienCo, đảm bảo nằm trong khoảng hợp lệ [0, SoQuyen]
            sach.SoLuongHienCo = Math.max(0, Math.min(parseInt(sach.SoLuongHienCo) || 0, sach.SoQuyen));
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
        const existing = await this.Sach.findOne({ MaSach: MaSach });
        if (!existing) return null;

        const update = this.extractSachData(payload);

        // Nếu SoQuyen thay đổi, điều chỉnh SoLuongHienCo tương ứng nếu client không cung cấp rõ
        if (update.SoQuyen !== undefined) {
            const newSoQuyen = parseInt(update.SoQuyen) || 0;
            const oldSoQuyen = parseInt(existing.SoQuyen) || 0;
            const delta = newSoQuyen - oldSoQuyen;

            if (update.SoLuongHienCo !== undefined) {
                // Nếu client truyền SoLuongHienCo, giới hạn trong [0, newSoQuyen]
                update.SoLuongHienCo = Math.max(0, Math.min(parseInt(update.SoLuongHienCo) || 0, newSoQuyen));
            } else {
                // Nếu không, điều chỉnh hiện có theo delta, và giới hạn
                const current = parseInt(existing.SoLuongHienCo) || 0;
                update.SoLuongHienCo = Math.max(0, Math.min(current + delta, newSoQuyen));
            }

            // đảm bảo kiểu số cho SoQuyen
            update.SoQuyen = newSoQuyen;
        } else if (update.SoLuongHienCo !== undefined) {
            // Nếu chỉ cập nhật SoLuongHienCo, đảm bảo không vượt quá SoQuyen hiện tại
            const max = parseInt(existing.SoQuyen) || parseInt(update.SoLuongHienCo) || 0;
            update.SoLuongHienCo = Math.max(0, Math.min(parseInt(update.SoLuongHienCo) || 0, max));
        }

        const result = await this.Sach.findOneAndUpdate(
            { MaSach: MaSach },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    // Tăng/Giảm số lượng hiện có (delta có thể âm)
    async adjustSoLuong(MaSach, delta) {
        const book = await this.Sach.findOne({ MaSach: MaSach });
        if (!book) throw new Error(`Không tìm thấy sách ${MaSach}`);

        const soQuyen = parseInt(book.SoQuyen) || 0;
        const current = parseInt(book.SoLuongHienCo) || 0;
        let newVal = current + Number(delta);
        newVal = Math.max(0, Math.min(newVal, soQuyen));

        const result = await this.Sach.findOneAndUpdate(
            { MaSach: MaSach },
            { $set: { SoLuongHienCo: newVal } },
            { returnDocument: "after" }
        );
        return result.value;
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

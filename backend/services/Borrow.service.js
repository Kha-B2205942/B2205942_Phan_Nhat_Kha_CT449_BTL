const { ObjectId } = require("mongodb");

class BorrowService {
    constructor(client) {
        const db = client.db();
        this.Muon = db.collection("theodoimuonsach");
        this.Sach = db.collection("sach");
    }

    extractMuonData(payload) {
        const muon = {
            MaDocGia: payload.MaDocGia,
            MaSach: payload.MaSach,
            NgayMuon: payload.NgayMuon,
            NgayTra: payload.NgayTra,
            TinhTrang: payload.TinhTrang,
        };
        Object.keys(muon).forEach(
            (key) => muon[key] === undefined && delete muon[key]
        );
        return muon;
    }

    async create(payload) {
        const muon = this.extractMuonData(payload);

        // Giảm số lượng sách hiện có
        const book = await this.Sach.findOne({ MaSach: muon.MaSach });
        if (!book) {
            throw new Error("Không tìm thấy sách để mượn.");
        }
        if (book.SoLuongHienCo <= 0) {
            throw new Error("Sách đã hết, không thể mượn.");
        }
        await this.Sach.updateOne({ MaSach: muon.MaSach }, { $inc: { SoLuongHienCo: -1 } });

        const result = await this.Muon.insertOne(muon);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...muon }; // trả về document vừa tạo
        }
        return null;
    }

    async find(filter = {}) {
        return await this.Muon.find(filter).toArray();
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.Muon.findOne({ _id: new ObjectId(id) });
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) return null;

        const oldBorrowRecord = await this.findById(id);
        if (!oldBorrowRecord) {
            return null;
        }

        const update = this.extractMuonData(payload);
        const result = await this.Muon.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: "after" }
        );
        // Nếu sách được trả, tăng lại số lượng
        if (result && result.TinhTrang === 'Đã trả' && oldBorrowRecord.TinhTrang !== 'Đã trả') {
            await this.Sach.updateOne({ MaSach: result.MaSach }, { $inc: { SoLuongHienCo: 1 } });
        }
        return result; 
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) return null;
        const result = await this.Muon.findOneAndDelete({ _id: new ObjectId(id) });
        return result;
    }

    async deleteAll() {
        const result = await this.Muon.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BorrowService;

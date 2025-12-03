const { ObjectId } = require("mongodb");
const BookService = require("./Book.service");

class BorrowService {
    constructor(client) {
        const db = client.db();
        this.Muon = db.collection("theodoimuonsach");
        this.Sach = db.collection("sach");
        this.bookService = new BookService(client);
    }

    extractMuonData(payload) {
        const muon = {
            MaDocGia: payload.MaDocGia,
            MaSach: payload.MaSach,
            NgayMuon: payload.NgayMuon,
            SoLuong: payload.SoLuong,
            NgayTra: payload.NgayTra,
            HanTra: payload.HanTra, // Thêm trường Hạn Trả (ngày trả dự kiến)
            TrangThai: payload.TrangThai,
        };
        Object.keys(muon).forEach(
            (key) => muon[key] === undefined && delete muon[key]
        );
        return muon;
    }

    async create(payload) {
        const muon = this.extractMuonData(payload);

        const result = await this.Muon.insertOne(muon);
        if (result.acknowledged) {
            // Khi tạo mới, không trừ số lượng. Số lượng chỉ bị trừ khi admin duyệt.
            return { _id: result.insertedId, ...muon }; // trả về document vừa tạo
        }
        return null;
    }

    async find(filter = {}) {
        return await this.Muon.find(filter).toArray();
    }

    // Hàm mới để tìm các lượt mượn theo mã độc giả
    async findByReader(readerId) {
        return await this.find({ MaDocGia: readerId });
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

        const newStatus = payload.TrangThai;
        const oldStatus = oldBorrowRecord.TrangThai;
        const borrowQuantity = parseInt(oldBorrowRecord.SoLuong) || 1;
        let quantityChange = 0;

        // Logic tính toán thay đổi số lượng
        // 1. Từ chờ duyệt -> duyệt (giảm SL)
        if (oldStatus === 'Đang chờ duyệt' && newStatus === 'Đã duyệt') {
            const book = await this.bookService.findByMaSach(oldBorrowRecord.MaSach);
            if (!book || book.SoLuongHienCo < borrowQuantity) {
                throw new Error(`Sách không đủ số lượng để duyệt. Chỉ còn ${book?.SoLuongHienCo || 0} quyển.`);
            }
            quantityChange = -borrowQuantity;
        }
        // 2. Từ đã duyệt -> trả hoặc hủy (tăng SL)
        else if (oldStatus === 'Đã duyệt' && (newStatus === 'Đã trả' || newStatus === 'Đã hủy')) {
            quantityChange = +borrowQuantity;
        }
        // 3. Hoàn tác: từ đã trả/hủy -> duyệt (giảm SL)
        else if ((oldStatus === 'Đã trả' || oldStatus === 'Đã hủy') && newStatus === 'Đã duyệt') {
            const book = await this.bookService.findByMaSach(oldBorrowRecord.MaSach);
            if (!book || book.SoLuongHienCo < borrowQuantity) {
                throw new Error(`Sách không đủ số lượng để hoàn tác. Chỉ còn ${book?.SoLuongHienCo || 0} quyển.`);
            }
            quantityChange = -borrowQuantity;
        }
        // 4. Hoàn tác: từ đã duyệt -> chờ duyệt (tăng SL)
        else if (oldStatus === 'Đã duyệt' && newStatus === 'Đang chờ duyệt') {
            quantityChange = +borrowQuantity;
        }

        // Nếu có thay đổi số lượng, thực hiện cập nhật
        if (quantityChange !== 0) {
            await this.bookService.adjustSoLuong(oldBorrowRecord.MaSach, quantityChange);
        }

        const update = this.extractMuonData(payload);
        const result = await this.Muon.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: "after" }
        );
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

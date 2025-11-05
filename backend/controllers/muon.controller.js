const MuonService = require("../services/muon.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo mới phiếu mượn
exports.create = async (req, res, next) => {
    if (!req.body?.MaDocGia || !req.body?.MaSach) {
        return next(new ApiError(400, "Mã độc giả và mã sách không được bỏ trống"));
    }

    try {
        const muonService = new MuonService(MongoDB.client);
        const document = await muonService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo phiếu mượn"));
    }
};

// Lấy danh sách tất cả phiếu mượn
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const muonService = new MuonService(MongoDB.client);
        documents = await muonService.find({});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
    }
    return res.send(documents);
};

// Lấy thông tin phiếu mượn theo ID
exports.findOne = async (req, res, next) => {
    try {
        const muonService = new MuonService(MongoDB.client);
        const document = await muonService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy phiếu mượn có id=${req.params.id}`));
    }
};

// Cập nhật phiếu mượn
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const muonService = new MuonService(MongoDB.client);
        const document = await muonService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
        }
        return res.send({ message: "Cập nhật phiếu mượn thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật phiếu mượn có id=${req.params.id}`));
    }
};

// Xóa phiếu mượn
exports.delete = async (req, res, next) => {
    try {
        const muonService = new MuonService(MongoDB.client);
        const document = await muonService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy phiếu mượn để xóa"));
        }
        return res.send({ message: "Xóa phiếu mượn thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa phiếu mượn có id=${req.params.id}`));
    }
};

// Xóa tất cả phiếu mượn
exports.deleteAll = async (_req, res, next) => {
    try {
        const muonService = new MuonService(MongoDB.client);
        const deletedCount = await muonService.deleteAll();
        return res.send({
            message: `${deletedCount} phiếu mượn đã được xóa thành công`,
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa tất cả phiếu mượn"));
    }
};

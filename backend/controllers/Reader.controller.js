const ReaderService = require("../services/Reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create
exports.create = async (req, res, next) => {
  const requiredFields = [
    "MaDocGia",
    "HoTen",
    "NgaySinh",
    "Phai",
    "DiaChi",
    "Password",
    "DienThoai",
  ];
  const missingFields = requiredFields.filter(
    (field) => !req.body[field] || req.body[field].toString().trim() === ""
  );

  if (missingFields.length > 0) {
    return next(
      new ApiError(
        400,
        `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`
      )
    );
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message.includes("đã tồn tại")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Lỗi khi tạo độc giả"));
  }
};

// Find all
exports.findAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const { HoTen } = req.query;
    const documents = HoTen
      ? await readerService.findByName(HoTen)
      : await readerService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
  }
};

// Find one
exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findByMaDocGia(req.params.MaDocGia);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy độc giả mã: ${req.params.MaDocGia}`));
  }
};

// Update
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Không có dữ liệu cập nhật"));

  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.MaDocGia, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Cập nhật độc giả thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return next(new ApiError(500, `Lỗi cập nhật độc giả mã: ${req.params.MaDocGia}`));
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.delete(req.params.MaDocGia);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Xóa độc giả thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    return next(new ApiError(500, `Lỗi xóa độc giả mã: ${req.params.MaDocGia}`));
  }
};

// Delete all
exports.deleteAll = async (_req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const deletedCount = await readerService.deleteAll();
    return res.send({ message: `${deletedCount} độc giả đã được xóa` });
  } catch (error) {
    console.error("Lỗi xóa tất cả:", error);
    return next(new ApiError(500, "Lỗi khi xóa tất cả độc giả"));
  }
};

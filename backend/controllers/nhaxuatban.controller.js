const NXBService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create
exports.create = async (req, res, next) => {
  const requiredFields = [
    "MaNXB",
    "TenNXB",
    "DiaChi",
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
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message.includes("đã tồn tại")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Lỗi khi tạo nhà xuất bản"));
  }
};

// Find all
exports.findAll = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const { TenNXB } = req.query;
    const documents = TenNXB
      ? await nxbService.findByName(TenNXB)
      : await nxbService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhà xuất bản"));
  }
};

// Find one
exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.findByMaNXB(req.params.MaNXB);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy nhà xuất bản mã: ${req.params.MaNXB}`));
  }
};

// Update
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Không có dữ liệu cập nhật"));

  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.update(req.params.MaNXB, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Cập nhật nhà xuất bản thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return next(new ApiError(500, `Lỗi cập nhật nhà xuất bản mã: ${req.params.MaNXB}`));
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.delete(req.params.MaNXB);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Xóa nhà xuất bản thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    return next(new ApiError(500, `Lỗi xóa nhà xuất bản mã: ${req.params.MaNXB}`));
  }
};

// Delete all
exports.deleteAll = async (_req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();
    return res.send({ message: `${deletedCount} nhà xuất bản đã được xóa` });
  } catch (error) {
    console.error("Lỗi xóa tất cả:", error);
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhà xuất bản"));
  }
};

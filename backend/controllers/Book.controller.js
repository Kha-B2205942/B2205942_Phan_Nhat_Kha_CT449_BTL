const BookService = require("../services/Book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create
exports.create = async (req, res, next) => {
  const requiredFields = [
    "MaSach",
    "TenSach",
    "DonGia",
    "SoQuyen",
    "NamXuatBan",
    "MaNXB",
    "TacGia",
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
    const bookService = new BookService(MongoDB.client);
    // Nếu có file được upload bởi multer, gán đường dẫn vào req.body
    if (req.file) {
      req.body.HinhAnh = `/uploads/${req.file.filename}`;
    }

    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message.includes("đã tồn tại")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Lỗi khi tạo sách"));
  }
};

// Find all
exports.findAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const { TenSach } = req.query;
    const documents = TenSach
      ? await bookService.findByName(TenSach)
      : await bookService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
  }
};

// Find one
exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findByMaSach(req.params.MaSach);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy sách mã: ${req.params.MaSach}`));
  }
};

// Update
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Không có dữ liệu cập nhật"));

  try {
    const bookService = new BookService(MongoDB.client);
    // Nếu có file mới được upload, gán đường dẫn vào req.body để cập nhật
    if (req.file) {
      req.body.HinhAnh = `/uploads/${req.file.filename}`;
    }

    const document = await bookService.update(req.params.MaSach, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Cập nhật sách thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return next(new ApiError(500, `Lỗi cập nhật sách mã: ${req.params.MaSach}`));
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.MaSach);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Xóa sách thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    return next(new ApiError(500, `Lỗi xóa sách mã: ${req.params.MaSach}`));
  }
};

// Delete all
exports.deleteAll = async (_req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({ message: `${deletedCount} sách đã được xóa` });
  } catch (error) {
    console.error("Lỗi xóa tất cả:", error);
    return next(new ApiError(500, "Lỗi khi xóa tất cả sách"));
  }
};

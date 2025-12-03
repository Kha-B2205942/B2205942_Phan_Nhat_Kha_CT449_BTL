const ReaderService = require("../services/Reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login độc giả (user)
exports.login = async (req, res, next) => {
  try {
    const { DienThoai, Password } = req.body;
    if (!DienThoai || !Password) {
      return next(new ApiError(400, "Thiếu Số điện thoại hoặc Mật khẩu"));
    }

    const readerCollection = MongoDB.client.db().collection("docgia");
    const reader = await readerCollection.findOne({ DienThoai: DienThoai });
    if (!reader) {
      return next(new ApiError(401, "Số điện thoại hoặc mật khẩu không chính xác"));
    }

    // So sánh mật khẩu một cách an toàn
    const isHashed = reader.Password && reader.Password.startsWith("$2");
    const validPassword = isHashed ? await bcrypt.compare(Password, reader.Password) : Password === reader.Password;

    if (!validPassword) {
      return next(new ApiError(401, "Số điện thoại hoặc mật khẩu không chính xác"));
    }

    const token = jwt.sign(
      { MaDocGia: reader.MaDocGia, HoTen: reader.HoTen, role: "reader" },
      config.jwt.secret,
      { expiresIn: "1d" }
    );

    const user = { ...reader };
    if (user.Password) delete user.Password;
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Reader login error:", error);
    return next(new ApiError(500, "Lỗi khi đăng nhập độc giả"));
  }
};

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

// Cập nhật thông tin cá nhân của độc giả đang đăng nhập
exports.updateProfile = async (req, res, next) => {
    // Middleware xác thực đã thêm MaDocGia vào req.userId (đã chuẩn hóa ở middleware)
    if (!req.userId) {
        return next(new ApiError(401, "Không được phép. Vui lòng đăng nhập."));
    }
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    // Tạo một bản sao của req.body để tránh thay đổi dữ liệu gốc
    const updateData = { ...req.body };
    // Không cho phép cập nhật mật khẩu qua route này
    if (updateData.Password) {
        delete updateData.Password;
    }

    try {
        const readerService = new ReaderService(MongoDB.client);
        // Cập nhật dựa trên MaDocGia từ token
        const updated = await readerService.update(req.userId, updateData);
        if (!updated) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        // Tìm lại thông tin người dùng để đảm bảo dữ liệu trả về là mới nhất và an toàn
        const user = await readerService.findByMaDocGia(req.userId);
        return res.send({ message: "Cập nhật thông tin thành công", user });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Lỗi khi cập nhật thông tin cá nhân`));
    }
};

// Đổi mật khẩu của độc giả đang đăng nhập
exports.changePassword = async (req, res, next) => {
    // Middleware xác thực đã thêm MaDocGia vào req.userId
    if (!req.userId) {
        return next(new ApiError(401, "Không được phép. Vui lòng đăng nhập."));
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return next(new ApiError(400, "Mật khẩu cũ và mật khẩu mới không được để trống."));
    }

    try {
        const readerService = new ReaderService(MongoDB.client);
        const reader = await readerService.findByMaDocGia(req.userId);
        if (!reader) {
            return next(new ApiError(404, "Không tìm thấy độc giả."));
        }

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, reader.Password);
        if (!isMatch) {
            return next(new ApiError(401, "Mật khẩu cũ không chính xác."));
        }

        // Cập nhật mật khẩu mới (service sẽ tự động hash)
        await readerService.update(req.userId, { Password: newPassword });

        return res.send({ message: "Đổi mật khẩu thành công." });

    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        return next(new ApiError(500, "Lỗi khi đổi mật khẩu."));
    }
};

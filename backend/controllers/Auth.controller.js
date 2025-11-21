const NhanVien = require("../services/Employee.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;

    // Kiểm tra xem MSNV và Password có được cung cấp không
    if (!MSNV || !Password) {
      return next(new ApiError(400, "MSNV và Mật khẩu không được để trống"));
    }

    const employeeService = new NhanVien(MongoDB.client);
    // Tìm nhân viên dựa trên MSNV
    const nhanvien = await employeeService.findByMSNV(MSNV);
    if (!nhanvien) {
      return next(new ApiError(401, "MSNV hoặc mật khẩu không chính xác"));
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã hash trong DB
    const isMatch = await bcrypt.compare(Password, nhanvien.Password);
    if (!isMatch) {
      return next(new ApiError(401, "MSNV hoặc mật khẩu không chính xác"));
    }

    // Tạo token
    const token = jwt.sign(
      { id: nhanvien._id, msnv: nhanvien.MSNV },
      process.env.JWT_SECRET || "my-secret-key", // Nên đặt secret key trong file .env
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    // Loại bỏ mật khẩu khỏi đối tượng user trả về
    const user = { ...nhanvien };
    delete user.Password;

    res.status(200).json({ token, user });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi trong quá trình đăng nhập"));
  }
};
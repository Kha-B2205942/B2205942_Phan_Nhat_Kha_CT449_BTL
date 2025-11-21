const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    MSNV: {
      type: String,
      required: [true, "MSNV là bắt buộc"],
      unique: true,
    },
    HoTenNV: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
    },
    Password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
    },
    ChucVu: {
      type: String,
      required: [true, "Chức vụ là bắt buộc"],
    },
    DiaChi: {
      type: String,
    },
    SoDienThoai: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
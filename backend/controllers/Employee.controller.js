const EmployeeService = require("../services/Employee.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create
exports.create = async (req, res, next) => {
  if (!req.body?.HoTenNV || !req.body?.MSNV || !req.body?.Password) {
    return next(new ApiError(400, "MSNV, Họ tên và Mật khẩu không được để trống"));
  }
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message.includes("đã tồn tại")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Lỗi khi tạo nhân viên"));
  }
};

// Find all
exports.findAll = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const { HoTenNV } = req.query;
    const documents = HoTenNV
      ? await employeeService.findByName(HoTenNV)
      : await employeeService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

// Find one
exports.findOne = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.findByMSNV(req.params.MSNV);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy nhân viên mã: ${req.params.MSNV}`));
  }
};

// Update
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Không có dữ liệu cập nhật"));
  }
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.update(req.params.MSNV, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Cập nhật nhân viên thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return next(new ApiError(500, `Lỗi cập nhật nhân viên mã: ${req.params.MSNV}`));
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.delete(req.params.MSNV);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    return next(new ApiError(500, `Lỗi xóa nhân viên mã: ${req.params.MSNV}`));
  }
};

// Delete all
exports.deleteAll = async (_req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const deletedCount = await employeeService.deleteAll();
    return res.send({ message: `${deletedCount} nhân viên đã được xóa` });
  } catch (error) {
    console.error("Lỗi xóa tất cả:", error);
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhân viên"));
  }
};

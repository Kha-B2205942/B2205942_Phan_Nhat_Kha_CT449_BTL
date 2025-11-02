const { getDb } = require("../utils/mongodb.util");

// Lấy danh sách nhân viên
exports.getAll = async (req, res) => {
  const db = getDb();
  const data = await db.collection("nhanvien").find().toArray();
  res.json(data);
};

// Lấy nhân viên theo mã
exports.getById = async (req, res) => {
  const db = getDb();
  const nv = await db.collection("nhanvien").findOne({ MSNV: req.params.MSNV });
  if (!nv) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json(nv);
};

// Thêm nhân viên mới
exports.create = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhanvien").insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
};

// Cập nhật thông tin nhân viên
exports.update = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhanvien").updateOne(
    { MSNV: req.params.MSNV },
    { $set: req.body }
  );
  res.json({ modifiedCount: result.modifiedCount });
};

// Xóa nhân viên
exports.delete = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhanvien").deleteOne({ MSNV: req.params.MSNV });
  res.json({ deletedCount: result.deletedCount });
};

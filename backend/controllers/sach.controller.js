const { getDb } = require("../utils/mongodb.util");

// Lấy tất cả sách
exports.getAll = async (req, res) => {
  const db = getDb();
  const data = await db.collection("sach").find().toArray();
  res.json(data);
};

// Lấy sách theo mã
exports.getById = async (req, res) => {
  const db = getDb();
  const doc = await db.collection("sach").findOne({ MaSach: req.params.MaSach });
  if (!doc) return res.status(404).json({ message: "Không tìm thấy sách" });
  res.json(doc);
};

// Thêm sách mới
exports.create = async (req, res) => {
  const db = getDb();
  const result = await db.collection("sach").insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
};

// Cập nhật thông tin sách
exports.update = async (req, res) => {
  const db = getDb();
  const result = await db.collection("sach").updateOne(
    { MaSach: req.params.MaSach },
    { $set: req.body }
  );
  res.json({ modifiedCount: result.modifiedCount });
};

// Xóa sách
exports.delete = async (req, res) => {
  const db = getDb();
  const result = await db.collection("sach").deleteOne({ MaSach: req.params.MaSach });
  res.json({ deletedCount: result.deletedCount });
};

const { getDb } = require("../utils/mongodb.util");

// Lấy tất cả độc giả
exports.getAll = async (req, res) => {
  const db = getDb();
  const data = await db.collection("docgia").find().toArray();
  res.json(data);
};

// Lấy độc giả theo mã
exports.getById = async (req, res) => {
  const db = getDb();
  const doc = await db.collection("docgia").findOne({ MaDocGia: req.params.MaDocGia });
  if (!doc) return res.status(404).json({ message: "Không tìm thấy độc giả" });
  res.json(doc);
};

// Thêm độc giả mới
exports.create = async (req, res) => {
  const db = getDb();
  const result = await db.collection("docgia").insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
};

// Cập nhật thông tin độc giả
exports.update = async (req, res) => {
  const db = getDb();
  const result = await db.collection("docgia").updateOne(
    { MaDocGia: req.params.MaDocGia },
    { $set: req.body }
  );
  res.json({ modifiedCount: result.modifiedCount });
};

// Xóa độc giả
exports.delete = async (req, res) => {
  const db = getDb();
  const result = await db.collection("docgia").deleteOne({ MaDocGia: req.params.MaDocGia });
  res.json({ deletedCount: result.deletedCount });
};

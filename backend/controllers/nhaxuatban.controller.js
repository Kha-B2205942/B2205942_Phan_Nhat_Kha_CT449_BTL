const { getDb } = require("../utils/mongodb.util");

// Lấy danh sách nhà xuất bản
exports.getAll = async (req, res) => {
  const db = getDb();
  const data = await db.collection("nhaxuatban").find().toArray();
  res.json(data);
};

// Lấy NXB theo mã
exports.getById = async (req, res) => {
  const db = getDb();
  const nxb = await db.collection("nhaxuatban").findOne({ MaNXB: req.params.MaNXB });
  if (!nxb) return res.status(404).json({ message: "Không tìm thấy NXB" });
  res.json(nxb);
};

// Thêm NXB mới
exports.create = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhaxuatban").insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
};

// Cập nhật NXB
exports.update = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhaxuatban").updateOne(
    { MaNXB: req.params.MaNXB },
    { $set: req.body }
  );
  res.json({ modifiedCount: result.modifiedCount });
};

// Xóa NXB
exports.delete = async (req, res) => {
  const db = getDb();
  const result = await db.collection("nhaxuatban").deleteOne({ MaNXB: req.params.MaNXB });
  res.json({ deletedCount: result.deletedCount });
};

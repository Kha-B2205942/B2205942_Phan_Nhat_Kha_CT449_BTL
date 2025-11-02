const { getDb } = require("../utils/mongodb.util");

// Lấy danh sách mượn (kèm lookup sách và độc giả)
exports.getAll = async (req, res) => {
  const db = getDb();
  const data = await db.collection("theodoimuonsach").aggregate([
    {
      $lookup: {
        from: "docgia",
        localField: "MaDocGia",
        foreignField: "MaDocGia",
        as: "DocGia"
      }
    },
    {
      $lookup: {
        from: "sach",
        localField: "MaSach",
        foreignField: "MaSach",
        as: "Sach"
      }
    }
  ]).toArray();
  res.json(data);
};

// Lấy 1 bản ghi mượn theo MaDocGia + MaSach
exports.getById = async (req, res) => {
  const db = getDb();
  const data = await db.collection("theodoimuonsach").findOne({
    MaDocGia: req.params.MaDocGia,
    MaSach: req.params.MaSach
  });
  if (!data) return res.status(404).json({ message: "Không tìm thấy bản ghi mượn" });
  res.json(data);
};

// Thêm bản ghi mượn
exports.create = async (req, res) => {
  const db = getDb();
  const result = await db.collection("theodoimuonsach").insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
};

// Cập nhật thông tin mượn (ví dụ khi trả sách)
exports.update = async (req, res) => {
  const db = getDb();
  const result = await db.collection("theodoimuonsach").updateOne(
    {
      MaDocGia: req.params.MaDocGia,
      MaSach: req.params.MaSach
    },
    { $set: req.body }
  );
  res.json({ modifiedCount: result.modifiedCount });
};

// Xóa bản ghi mượn
exports.delete = async (req, res) => {
  const db = getDb();
  const result = await db.collection("theodoimuonsach").deleteOne({
    MaDocGia: req.params.MaDocGia,
    MaSach: req.params.MaSach
  });
  res.json({ deletedCount: result.deletedCount });
};

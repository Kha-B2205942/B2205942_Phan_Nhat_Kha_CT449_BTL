const express = require("express");
const sach = require("../controllers/Book.controller");
const upload = require("../middleware/upload");

const router = express.Router();
router.route("/")
    .get(sach.findAll)
    .post(upload.single('HinhAnh'), sach.create) // Sử dụng multer middleware
    .delete(sach.deleteAll);

router.route("/:MaSach")
    .get(sach.findOne)
    .put(upload.single('HinhAnh'), sach.update) // Sử dụng multer middleware
    .delete(sach.delete);
    
module.exports = router;

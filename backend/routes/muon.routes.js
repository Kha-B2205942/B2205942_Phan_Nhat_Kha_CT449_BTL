const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/muon.controller");

router.get("/", ctrl.getAll);
router.get("/:MaDocGia/:MaSach", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:MaDocGia/:MaSach", ctrl.update);
router.delete("/:MaDocGia/:MaSach", ctrl.delete);

module.exports = router;

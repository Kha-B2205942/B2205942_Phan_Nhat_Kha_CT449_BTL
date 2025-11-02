const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/docgia.controller");

router.get("/", ctrl.getAll); 
router.get("/:MaDocGia", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:MaDocGia", ctrl.update);
router.delete("/:MaDocGia", ctrl.delete);

module.exports = router;

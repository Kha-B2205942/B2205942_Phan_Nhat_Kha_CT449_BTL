const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/nhaxuatban.controller");

router.get("/", ctrl.getAll);
router.get("/:MaNXB", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:MaNXB", ctrl.update);
router.delete("/:MaNXB", ctrl.delete);

module.exports = router;

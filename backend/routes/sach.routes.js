const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sach.controller");

router.get("/", ctrl.getAll);
router.get("/:MaSach", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:MaSach", ctrl.update);
router.delete("/:MaSach", ctrl.delete);

module.exports = router;

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/nhanvien.controller");

router.get("/", ctrl.getAll);
router.get("/:MSNV", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:MSNV", ctrl.update);
router.delete("/:MSNV", ctrl.delete);

module.exports = router;

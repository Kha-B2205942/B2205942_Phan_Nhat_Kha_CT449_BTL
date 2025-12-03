const express = require("express");
const nhanvien = require("../controllers/Employee.controller");

const router = express.Router();

router.post('/login', nhanvien.login);

router.route("/")
    .get(nhanvien.findAll)     
    .post(nhanvien.create)
    .delete(nhanvien.deleteAll);

router.route("/:MSNV")
    .get(nhanvien.findOne)
    .put(nhanvien.update)
    .delete(nhanvien.delete);

module.exports = router;

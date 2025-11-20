const express = require("express");
const docgia = require("../controllers/Reader.controller");

const router = express.Router();

router.route("/")
    .get(docgia.findAll)     
    .post(docgia.create)
    .delete(docgia.deleteAll);

router.route("/:MaDocGia")
    .get(docgia.findOne)
    .put(docgia.update)
    .delete(docgia.delete);

module.exports = router;


const express = require("express");
const sach = require("../controllers/Book.controller");

const router = express.Router();
router.route("/")
    .get(sach.findAll)
    .post(sach.create)
    .delete(sach.deleteAll);

router.route("/:MaSach")
    .get(sach.findOne)
    .put(sach.update)
    .delete(sach.delete);
    
module.exports = router;

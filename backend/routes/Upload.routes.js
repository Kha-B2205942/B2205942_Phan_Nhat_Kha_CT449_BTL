const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

// Route để upload file
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;

const express = require("express");
const cors = require("cors");
const path = require("path"); // Thêm path
const ApiError = require("./api-error");

const docgiaRoutes = require("./routes/Reader.routes.js");
const sachRoutes = require("./routes/Book.routes.js");
const nhanvienRoutes = require("./routes/Employee.routes.js");
const muonRoutes = require("./routes/Borrow.routes.js");
const nhaxuatbanRoutes = require("./routes/Publisher.routes.js");
const uploadRouter = require("./routes/Upload.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/docgia", docgiaRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/muon", muonRoutes);
app.use("/api/nhaxuatban", nhaxuatbanRoutes);
app.use("/api/upload", uploadRouter); 

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Phục vụ các file upload (ảnh bìa, ...)
app.use('/uploads', express.static(path.join(__dirname, './uploads')));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to book management application." });
});
// handle 404 response
app.use((req, res, next) =>{
    return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next ) => {
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

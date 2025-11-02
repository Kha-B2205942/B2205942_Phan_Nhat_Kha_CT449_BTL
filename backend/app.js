const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./api-error");

const docgiaRoutes = require("./routes/docgia.routes");
const sachRoutes = require("./routes/sach.routes");
const nhanvienRoutes = require("./routes/nhanvien.routes");
const muonRoutes = require("./routes/muon.routes");
const nhaxuatbanRoutes = require("./routes/nhaxuatban.routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/docgia", docgiaRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/muon", muonRoutes);
app.use("/api/nhaxuatban", nhaxuatbanRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Quản Lý Mượn Sách!");
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

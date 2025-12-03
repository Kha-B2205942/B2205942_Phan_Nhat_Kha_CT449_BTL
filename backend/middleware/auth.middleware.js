const jwt = require("jsonwebtoken");
const config = require("../config/index"); // Lấy secret key từ config
const ApiError = require("../api-error"); // Dùng class ApiError

//xac thuc token - giai ma va gan vao req.user
const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
        return next(new ApiError(403, "No token provided!"));
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
        if (error) {
            return next(new ApiError(401, "Unauthorized! Invalid Token."));
        }
        req.userId = decoded.MaDocGia || decoded.id; // Lấy MaDocGia cho reader hoặc id cho employee
        req.userRole = decoded.role;
        next(); 
    });
};

//Phan quyen admin - kiem tra req.user.role
const isAdmin = (req, res, next) => {
    if (req.userRole === "admin") {
        next(); 
        return;
    }
    return next(new ApiError(403, "Require Admin Role! (Access Denied)"));
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};

module.exports = authJwt;
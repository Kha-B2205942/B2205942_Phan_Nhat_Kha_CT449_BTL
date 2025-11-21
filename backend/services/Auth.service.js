import Employee from "../models/Employee.model.js";   // nếu bạn có model Sequelize/Mongo
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {

    async loginEmployee(msnv, password) {

        // 1. Kiểm tra nhân viên có tồn tại không
        const employee = await Employee.findOne({ where: { msnv } });
        if (!employee) {
            const error = new Error("MSNV không tồn tại");
            error.status = 400;
            throw error;
        }

        // 2. Kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(password, employee.password);
        if (!validPassword) {
            const error = new Error("Sai mật khẩu");
            error.status = 400;
            throw error;
        }

        // 3. Tạo token
        const token = jwt.sign(
            {
                id: employee.id,
                msnv: employee.msnv,
                role: employee.role || "employee"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { token, employee };
    }
}

export default new AuthService();

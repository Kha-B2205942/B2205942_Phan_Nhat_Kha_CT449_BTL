const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
	// Đăng nhập cho Nhân Viên (Admin) - dùng collection passed-in nếu cần
	async loginEmployee(msnv, password, employeeCollection) {
		const employee = await employeeCollection.findOne({ MSNV: msnv });
		if (!employee) {
			const error = new Error("MSNV không tồn tại");
			error.status = 401;
			throw error;
		}

		let validPassword = false;
		try {
			validPassword = await bcryptjs.compare(password, employee.Password);
		} catch (err) {
			validPassword = password === employee.Password;
		}

		if (!validPassword) {
			const error = new Error("MSNV hoặc mật khẩu không chính xác");
			error.status = 401;
			throw error;
		}

		const token = jwt.sign(
			{
				id: employee._id,
				msnv: employee.MSNV,
				role: employee.Role || "admin",
			},
			process.env.JWT_SECRET || "my-secret-key",
			{ expiresIn: "1d" }
		);

		const user = { ...employee };
		if (user.Password) delete user.Password;
		return { token, user: { ...user, role: "admin" } };
	}

	// Đăng nhập cho Độc Giả (Reader)
	async loginReader(hoTen, password, readerCollection) {
		const reader = await readerCollection.findOne({ HoTen: hoTen });
		if (!reader) {
			const error = new Error("Họ tên không tồn tại");
			error.status = 401;
			throw error;
		}

		let validPassword = false;
		try {
			validPassword = await bcryptjs.compare(password, reader.Password);
		} catch (err) {
			validPassword = password === reader.Password;
		}

		if (!validPassword) {
			const error = new Error("Họ tên hoặc mật khẩu không chính xác");
			error.status = 401;
			throw error;
		}

		const token = jwt.sign(
			{
				MaDocGia: reader.MaDocGia,
				HoTen: reader.HoTen,
				role: "reader",
			},
			process.env.JWT_SECRET || "my-secret-key",
			{ expiresIn: "1d" }
		);

		const user = { ...reader };
		if (user.Password) delete user.Password;
		return { token, user: { ...user, role: "reader" } };
	}
}

module.exports = new AuthService();


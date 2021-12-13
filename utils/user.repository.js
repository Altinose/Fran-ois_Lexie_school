const { getConnection } = require("../utils/db.js");

pool = require("../utils/db.js");
// JS include = relative to CONTROLLERS
// VIEW include  = relative to VIEWS

module.exports = {
	getBlankCar() {
		// define the entity model
		return {
			car_id: 0,
			car_brand: 0,
			car_name: "lala",
			car_baseprice: 0,
			car_isFancy: 0,
			car_realPrice: 0,
		};
	},


	async getStudentclass(thestudent_id) {
		try {
			conn = await pool.getConnection();
			sql = "SELECT * FROM student WHERE student_id  = ?;";
			const student_class = await conn.query(sql, thestudent_id);

			conn.end();
			return student_class;
		} catch (err) {
			throw err;
		}

	},


	async grade(id, user) {
		try {
			for (var q of user) {
				student_class = q.student_class;
			}
			console.log(id);

			conn = await pool.getConnection();
			if (id == "math") {
				sql = "SELECT * FROM student INER JOIN grade ON student_id = grade_student  WHERE student_class = ? ORDER BY grade.grade_math DESC;";
			} else if (id == "french") {
				sql = "SELECT * FROM student INER JOIN grade ON student_id = grade_student  WHERE student_class = ? ORDER BY grade.grade_french DESC;";
			} else if (id == "history") {
				sql = "SELECT * FROM student INER JOIN grade ON student_id = grade_student  WHERE student_class = ? ORDER BY grade.grade_history DESC;";
			} else if (id == "name") {
				sql = "SELECT * FROM student INER JOIN grade ON student_id = grade_student  WHERE student_class = ? ORDER BY student_first_name ASC;";
			} else if (id == "lastname") {
				sql = "SELECT * FROM student INER JOIN grade ON student_id = grade_student  WHERE student_class = ? ORDER BY student_last_name ASC;";
			}
			const rows = await conn.query(sql, [student_class]);
			conn.end();
			console.log("ROWS FETCHED: " + rows.length);
			return rows;
		} catch (err) {
			throw err;
		}
	},

	async getOneUser(username) {
		try {
			conn = await pool.getConnection();
			sql = "SELECT login_id,login_user_name,login_level FROM login WHERE login_user_name = ? "; // must leave out the password+hash
			const rows = await conn.query(sql, username);
			conn.end();
			if (rows.length == 1) {
				return rows[0];
			} else {
				return false;
			}
		} catch (err) {
			throw err;
		}
	},

	async areValidCredentials(username, password) {
		try {
			conn = await pool.getConnection();
			sql = "SELECT * FROM login WHERE login_user_name = ? AND login_password = sha2(concat(login_user_name, ?), 224) "; // TODO: better salt+pw hash!
			const rows = await conn.query(sql, [username, password]);
			conn.end();
			console.log("a");

			if (rows.length == 1 && rows[0].login_user_name === username) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			throw err;
		}
	},
	//! to encrypte first all mdp (problem of the setup)
	async encryptionmdp(id) {
		try {
			conn = await pool.getConnection();
			sql = "Select * FROM login WHERE login_id = ?";
			var mdp = await conn.query(sql, id);
			for (var q of mdp) {
				login_password = q.login_password;
			}
			console.log(login_password);


			sql = "UPDATE login SET login_password = sha2(concat(login_user_name,?),224) WHERE login_id = ?  "; // TODO: better salt+pw hash!
			const rows = await conn.query(sql, [login_password, id]);

			conn.end();

		} catch (err) {
			throw err;
		}
	}

};
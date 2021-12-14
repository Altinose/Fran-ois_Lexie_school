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

			console.log("ici" + id);

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
			const rows = await conn.query(sql, [user]);
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
	},

	async gettheuserinfo(login_id) {
		try {
			console.log(login_id);
			conn = await pool.getConnection();
			sql = "SELECT * FROM STUDENT WHERE student_login = ?"
			const rows = await conn.query(sql, login_id);
			for (var q of rows) {
				userinfo = [
					q.student_id,
					q.student_first_name,
					q.student_last_name,
					q.student_class,
					login_id,
				];
			}


			sql = "SELECT * FROM grade WHERE grade_student = ?";
			const line = await conn.query(sql, userinfo[0]);

			for (var q of line) {
				console.log("getuserinfo : grades" + q.grade_math, q.grade_french, q.grade_history);
				userinfo.push(q.grade_math, q.grade_french, q.grade_history);
			}


			console.log("aaa: " + userinfo);
			conn.end();
			return userinfo;
		} catch (err) {
			throw err;
		}
	},

	async getadmininfo(login_id, login_level) {
		try {
			console.log(login_id);
			conn = await pool.getConnection();
			sql = "SELECT * FROM worker WHERE worker_login = ?"
			const rows = await conn.query(sql, login_id);
			for (var q of rows) {
				userinfo = [q.worker_id,
				q.worker_firstname,
				q.worker_lastname];
			}
			sql = "SELECT * FROM class WHERE class_worker = ?"
			const line = await conn.query(sql, userinfo[0]);


			for (var q of line) {
				userinfo.push(q.class_id, q.class_level);
			}
			userinfo.push(login_level);

			console.log("aaa: " + userinfo);
			conn.end();
			return userinfo;
		} catch (err) {
			throw err;
		}

	},
	async deletestudent(studentid) {
		sql = "DELETE FROM grade WHERE grade_id = ?"
		const line = await conn.query(sql, studentid);
		sql = "DELETE FROM student WHERE student_login = ?"
		const line2 = await conn.query(sql, studentid);
		sql = "DELETE FROM login WHERE login_id = ?"
		const line3 = await conn.query(sql, studentid);
	},

	async Selectonegrade(grade_student, subject) {
		sql = "SELECT * From grade WHERE grade_student = ?";
		const line = await conn.query(sql, { grade_student });
		for (var q of line) {
			userinfo = [q.grade_history, q.grade_math, q.grade_frech];
		}

		if (subject == "grade_history") {
			return userinfo[0];
		}
		else if (subjec == "grade_math") {
			return userinfo[1];
		}
		else if (subject == "grade_french") {
			return userinfo[2];
		}

		return null;

	},

	async moddifgrade(grade_student, subject, grade) {
		if (subject == "7") {
			sql = "UPDATE grade SET grade_history = ? WHERE grade_student = ?";
		}
		else if (subject == "5") {
			sql = "UPDATE grade SET grade_math = ? WHERE grade_student = ?";
		}
		else if (subject == "6") {
			sql = "UPDATE grade SET grade_french = ? WHERE grade_student = ?";
		}
		const line = await conn.query(sql, [grade, grade_student]);
	}

};
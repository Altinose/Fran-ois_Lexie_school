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
	}
};
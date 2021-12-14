const express = require('express');
const { route } = require('express/lib/router');
const { appendFile } = require('fs');
const passport = require('passport');
const { getuserinfo, grade, moddifgrade } = require('../utils/user.repository');
const router = express.Router();

const gradeRepo = require('../utils/user.repository');
const userauth = require('../utils/users.auth');



//############ display ######################
router.get("/connexion", connectiondisplay);
router.get("/email", emaildisplay);
router.get("/event", eventdisplay);
router.get("/menu", menudisplay);
router.get("/addstudent", addstudentdisplay);
router.get("/timetable", timetabledisplay);
//###########################################
router.post("/editgrade/value", calculing);

router.get("/logout", logoutAction);

router.get("/welcome", showwelcome);

router.get("/", redir);

router.get("/grades/:student_id/:filter", grades);
router.get("/grades/:student_id", moovetograde);
router.get("/supp/:student_id", suppstudent)

router.get("/encryption", encryption);


router.post("/connexion/check", checkconnexion);

router.get("/connexion/admin", userauth.checkAuthentication("admin"), redirtomenu);
router.get("/connexion/user", userauth.checkAuthentication("user"), redirtomenu);


router.get("/menu_admin", menudisplay);

router.post("/addstudent/adding", addthestudent);
router.get("/editgrade", addagrade);

//#####################display#################""
async function timetabledisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gradeRepo.gettheuserinfo(request.user.login_id);
        console.log(data);
        response.render("timetable", { "User": data });

    }
}

async function menudisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        if (request.user.login_level == "admin") {
            data = await gradeRepo.getadmininfo(request.user.login_id, request.user.login_level);
            response.render("menu_admin", { "User": data });
        } else {
            data = await gradeRepo.gettheuserinfo(request.user.login_id);
            response.render("menu", { "User": data });
        }
    }
}



async function eventdisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gradeRepo.gettheuserinfo(request.user.login_id);
        console.log(data);
        response.render("event", { "User": data });

    }
}
function connectiondisplay(request, response) {
    if (request.user == undefined) {
        response.render("connexion");
    } else {
        response.redirect("/menu");
    }

}

async function emaildisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gradeRepo.gettheuserinfo(request.user.login_id);
        console.log(data);
        response.render("email", { "User": data });

    }
}



async function addstudentdisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gradeRepo.gettheuserinfo(request.user.login_id);
        response.render("addstudent", { "User": data });

    }
}
//########################################


function redirtomenu(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        if (request.user.login_level == "admin") {
            response.redirect("/menu_admin");
        }
        else {
            response.redirect("/menu");
        }
    }
}
async function moovetograde(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        var student_id = request.params.student_id;
        response.redirect("/grades/" + student_id + "/name");
    }


}


function suppstudent(request, response) {
    student_id = request.params.student_id;
    if (request.user.login_level == "admin") {
        gradeRepo.deletestudent(student_id);
        var student_id = request.params.student_id;
        response.redirect("/grades/" + student_id + "/name");

    }
    response.redirect("/");
}



async function grades(request, response) {

    if (request.user == undefined) {
        response.redirect("/");
    } else {
        var student_id = request.params.student_id;
        var filter = request.params.filter;
        if (request.user.login_level == "admin") {
            data = await gradeRepo.getadmininfo(request.user.login_id, request.user.login_level);
            var grades = await gradeRepo.grade(filter, data[3]);
        } else {
            idclass = await gradeRepo.getStudentclass(student_id);
            for (var q of idclass) {
                var student_class = q.student_class;
            }
            var grades = await gradeRepo.grade(filter, student_class);

            data = await gradeRepo.gettheuserinfo(request.user.login_id);

        }

        response.render("grade", { "User": data, "grades": grades });
    }

}


async function addagrade(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        if (request.user.login_level == "admin") {
            filter = "name"
            data = await gradeRepo.getadmininfo(request.user.login_id, request.user.login_level);
            var grades = await gradeRepo.grade(filter, data[3]);
            response.render("editgrade", { "User": data, "grades": grades });
        } else {
            response.redirect("/");
        }

    }
}
async function calculing(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        if (request.user.login_level == "admin") {
            thestudent_id = request.body.name;
            filter = request.body.subject;
            studentgrade = request.body.grade;

            student = await gradeRepo.gettheuserinfo(thestudent_id);
            console.log("student note" + student[filter]);
            console.log("new note" + studentgrade);

            finalgrade = (parseInt(student[filter]) + parseInt(studentgrade)) / 2;
            await gradeRepo.moddifgrade(thestudent_id, filter, finalgrade)
            response.redirect("/menu");
        } else {
            response.redirect("/");
        }

    }
}


function showwelcome(request, response) {
    console.log(request.user);
    response.render("welcome");
}
function redir(request, responce) {
    responce.redirect("welcome");
}

function encryption(request, response) {
    for (var i = 0; i <= 77; i++) {
        gradeRepo.encryptionmdp(i);

    }
    response.redirect("/");

}



async function checkconnexion(request, response) {

    console.log(request.body.username, request.body.passwd);
    areValid = await gradeRepo.areValidCredentials(request.body.username, request.body.passwd);
    console.log(areValid);
    if (areValid) {
        user = await gradeRepo.getOneUser(request.body.username);
        await request.login(user, function (err) {
            if (err) { return next(err); }
        });
        console.log(user);
        if (user.login_level === "admin") {
            return response.redirect("/connexion/admin");
        } else {
            return response.redirect("/connexion/user");
        }

    } else {
        response.send("Invalid credentials provided");
    }

}

// * /addstudent/adding *  for adding a student to the database//

async function addthestudent(request, response) {
    if (request.user != undefined) {
        if (request.user.login_level == "admin") {
            student_name = request.body.fname;
            student_lastname = request.body.lname;
            student_phone = request.body.phone;
            student_math_grade = request.body.grade_math;
            student_history_grade = request.body.grade_history;
            student_french_grade = request.body.grade_french;
            student_login = request.body.login_first_name;
            student_mdp = request.body.login_password;
            me = await gradeRepo.getadmininfo(request.user.login_id, request.user.login_level);


            await gradeRepo.newstudent(student_login, student_mdp,
                student_name,
                student_lastname,
                student_phone,
                me[0],
                student_math_grade,
                student_history_grade,
                student_french_grade
            );
        }
        response.redirect("/menu");
    } else {
        response.redirect("/");
    }
}

// * logout * //

function logoutAction(request, response) {
    request.logOut();
    response.redirect("/");
}

module.exports = router;
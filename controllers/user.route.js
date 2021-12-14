const express = require('express');
const { route } = require('express/lib/router');
const { appendFile } = require('fs');
const passport = require('passport');
const { getuserinfo, grade, moddifgrade } = require('../utils/user.repository');
const router = express.Router();

const gradeRepo = require('../utils/user.repository');
const userauth = require('../utils/users.auth');



router.get("/grades/:student_id/:filter", grades);
router.get("/grades/:student_id", moovetograde);
router.get("/supp/:student_id", suppstudent)

router.get("/encryption", encryption);
router.get("/connexion", connectiondisplay);

router.post("/connexion/check", checkconnexion);

router.get("/connexion/admin", userauth.checkAuthentication("admin"), redirtomenu);
router.get("/connexion/user", userauth.checkAuthentication("user"), redirtomenu);


router.get("/menu_admin", menudisplay);


//############ display ######################

router.get("/email", emaildisplay);

router.get("/event", eventdisplay);


router.get("/menu", menudisplay);
router.get("/addstudent", addstudentdisplay);

router.get("/timetable", timetabledisplay);

router.get("/editgrade", addagrade);
router.post("/editgrade/value", calculing);



router.get("/welcome", showwelcome);

router.get("/", redir);


async function timetabledisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gettheuserinfo(request.user.login_id);
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


async function editgradedisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await gradeRepo.gettheuserinfo(request.user.login_id);
        response.render("editgrade", { "User": data });

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

module.exports = router;
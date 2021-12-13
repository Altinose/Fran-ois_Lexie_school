const express = require('express');
const { appendFile } = require('fs');
const passport = require('passport');
const { getuserinfo } = require('../utils/user.repository');
const router = express.Router();

const gradeRepo = require('../utils/user.repository');
const userauth = require('../utils/users.auth');



router.get("/grades/:student_id/:filter", grades);
router.get("/grades/:student_id", moovetograde);

router.get("/encryption", encryption);
router.get("/connexion", connectiondisplay);

router.post("/connexion/check", checkconnexion);

router.post("/connexion/admin", userauth.checkAuthentication("admin"), redirtomenu);
router.get("/connexion/user", userauth.checkAuthentication("user"), redirtomenu);





//############ display ######################

router.get("/email", emaildisplay);

router.get("/event", eventdisplay);



router.get("/menu", menudisplay);

router.get("/timetable", timetabledisplay)


router.get("/welcome", showwelcome);

router.get("/", redir);

function timetabledisplay(request, response) {
    response.render("timetable");
}

async function menudisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await getuserinfo(request.user.login_id);
        console.log(data);
        response.render("menu", { "User": data });

    }
}



async function eventdisplay(request, response) {
    if (request.user == undefined) {
        response.redirect("/");
    } else {
        data = await getuserinfo(request.user.login_id);
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
        data = await getuserinfo(request.user.login_id);
        console.log(data);
        response.render("email", { "User": data });

    }
}
//########################################


function redirtomenu(request, response) {
    response.redirect("/menu");
}

function moovetograde(request, response) {
    var student_id = request.params.student_id;
    response.redirect("../" + student_id + "/name");

}
async function grades(request, response) {

    if (request.user == undefined) {
        response.redirect("/");
    } else {
        var student_id = request.params.student_id;
        var filter = request.params.filter;
        var idclass = await gradeRepo.getStudentclass(student_id);
        var grades = await gradeRepo.grade(filter, idclass);
        data = await getuserinfo(request.user.login_id);
        console.log(data);
        response.render("grade", { "User": data, "grades": grades });

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
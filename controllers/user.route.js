const express = require('express');
const router = express.Router();

const gradeRepo = require('../utils/user.repository');
const userauth = require('../utils/users.auth');



router.get("/grades/:student_id/:filter", grades);
router.get("/grades/:student_id", moovetograde);

//router.get("/encryption", encryption);
router.get("/connexion", connectiondisplay);

router.post("/connexion/check", checkconnexion);

router.get("/connexion/admin", userauth.checkAuthentication("admin"), redir);
router.get("/connexion/user", userauth.checkAuthentication("user"), redir);

router.get("/email", emaildisplay);

router.get("/event", eventdisplay);

router.get("/welcome", showwelcome);
router.get("/", redir);

function eventdisplay(request, response) {
    response.render("event");
}
function connectiondisplay(request, response) {
    response.render("connexion");
}

function emaildisplay(request, response) {
    response.render("email");
}

function moovetograde(request, response) {
    var student_id = request.params.student_id;
    response.redirect("../" + student_id + "/name");

}
async function grades(request, response) {
    var student_id = request.params.student_id;
    var filter = request.params.filter;
    var idclass = await gradeRepo.getStudentclass(student_id);
    var grades = await gradeRepo.grade(filter, idclass);
    response.render("grade", { "grades": grades });
}


function showwelcome(request, response) {
    response.render("welcome");
}
function redir(request, responce) {
    responce.redirect("welcome");
}
/*
function encryption(request, response) {
    for (var i=0;i<=77; i++){
    gradeRepo.encryptionmdp(i);
    
    }
    response.redirect("/");

}
*/


async function checkconnexion(request, response) {
    console.log(request.body.username, request.body.passwd);

    areValid = await gradeRepo.areValidCredentials(request.body.username, request.body.passwd);
    console.log(areValid);
    if (areValid) {
        user = await gradeRepo.getOneUser(request.body.username);
        console.log(user);
        if (user.login_level === "admin") {
            return response.redirect("/connexion/admin");
        } else {
            console.log("bb");
            return response.redirect("/connexion/user");
        }

    } else {
        response.send("Invalid credentials provided");
    }

}





module.exports = router;
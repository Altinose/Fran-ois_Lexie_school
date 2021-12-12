const { response } = require('express');
const express = require('express');
const router = express.Router();
const gradeRepo = require('../utils/user.repository');



router.get("/grades/:student_id/:filter", grades);
router.get("/grades/:student_id", moovetograde);


router.get("/connexion", connectiondisplay);


router.get("/email", emaildisplay);

router.get("/event", eventdisplay);



router.get("/menu", menudisplay);

router.get("/timetable", timetabledisplay)


router.get("/welcome", showwelcome);

router.get("/", redir);


function timetabledisplay(request, response) {
    response.render("timetable");
}

function menudisplay(request, response) {
    response.render("menu");
}


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







module.exports = router;
const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.listen(process.env.WEB_PORT,

    function () { console.log("Listenin on" + process.env.WEB_PORT); }
);
/*
app.get('/welcome', (req, res) => {
    res.render("welcome")
});

app.get('/welcome/menu', (req, res) => {
    res.render("menu")
});
*/

app.set("view engine", "ejs");
app.set("views", "views");



// * app.use(callback1, callback2);
// * app.use(routeBase, callback);


const bodyParser = require("body-parser");
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
// * app.use("/cars", require("./controllers/cars.route"));
app.use("/static", express.static(__dirname + '/static'));
app.use("/", require("./controllers/grades.route"));

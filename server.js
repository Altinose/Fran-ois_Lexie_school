const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.listen(process.env.WEB_PORT,

    function () { console.log("Listening at " + process.env.WEB_PORT); }
);

const session = require("express-session");
app.use(session({
    secret: "SecretRandomKey123QWE",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

// add after SESSION
const auth = require("./utils/users.auth");
auth.initialization(app);

// add first


app.set("view engine", "ejs");
app.set("views", "views");





const bodyParser = require("body-parser");
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + '/static'));
app.use("/", require("./controllers/user.route"));

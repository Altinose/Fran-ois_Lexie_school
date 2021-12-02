const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.listen(process.env.WEB_PORT,

    function () { console.log("Listenin on" + process.env.WEB_PORT); }
);
app.get('/', (req, res) => {
    res.send('Hello, node js  website...');
});


app.set("view engine", "ejs");
app.set("views", "views");

// ! MIDDLEWARE REGISTERTION!
// * app.use(callback1, callback2);
// * app.use(routeBase, callback);

// * app.use("/hello", require("./controllers/hello.route"));

const bodyParser = require("body-parser");
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
// * app.use("/cars", require("./controllers/cars.route"));
app.use("/static", express.static(__dirname + '/static'));

//Module imports
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


/**

var MyMethods = require('./myModule.js');
var method = MyMethods.method;
var otherMethod = MyMethods.otherMethod;          HOW TO USE MULTIPLE EXPORTS IN EXPRESS PROGRAMMING.

**/
//App imports
const app = express();
const port = 7770;

var db = "engineermanagement";
mongoose.connect("mongodb://127.0.0.1/" + db); //must use 127.0.0.1 vs localhost to connect without an internet connection.
mongoose.set("debug", true);

//File imports
const userAuth = require("./routes/userAuth");
const jobRoutes = require("./routes/jobRoutes");
const locationRoutes = require("./routes/locationRoutes");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Content-Length, Authorization");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Cache-Control', 'no-cache');
  next();
});
app.disable('view cache');

//Setup rest api
app.use("/user", userAuth);
app.use("/job", jobRoutes);
app.use("/location", locationRoutes);

// 404 Error Handler
const endpointError = {error: "No Endpoint Found"}
app.use((req, res) => {
    res.status(404).end(JSON.stringify(endpointError, null, 2))
});


var server = http.createServer(app);
server.listen(port);
module.exports = app;
"use strict";

if (process.env.NODE_ENV === "production")
    require("newrelic");

const PORT = process.env.PORT || 3333;

const os = require("os");
const http = require("http");
const express = require("express");
const RoutesConfig = require("./config/routes.conf");
const DBConfig = require("./config/db.conf");
const Routes = require("./routes/index");
var bodyParser = require("body-parser")
var mongodb = require("mongodb");

var COMPETITION_COLLECTION = "competitions";

const app = express();
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("database connection ready");
});

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

http.createServer(app)
    .listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });

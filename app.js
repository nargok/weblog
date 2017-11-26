var express = require("express");
var accesslogger = require("./lib/logger/accesslogger.js");
var systemlogger = require("./lib/logger/systemlogger.js");
var bodyparser = require("body-parser");
var app = express();

app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));

app.use(accesslogger());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use("/", require("./routes/index.js"));
app.use("/post", require("./routes/post.js"));
app.use("/search", require("./routes/search.js"));
app.use("/account", require("./routes/account.js"));

app.use(systemlogger());

app.listen(3000);
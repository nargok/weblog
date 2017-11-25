var express = require("express");
var accesslogger = require("./lib/logger/accesslogger.js");
var systemlogger = require("./lib/logger/systemlogger.js");
var app = express();

app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));

app.use(accesslogger());

app.use("/", require("./routes/index.js"));
app.use("/post", require("./routes/post.js"));
app.use("/search", require("./routes/search.js"));

app.use(systemlogger());

app.listen(3000);
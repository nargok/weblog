const SESSION_SECRET = require("./config/app.config.js").security.SESSION_SECRET;
var express = require("express");
var accesslogger = require("./lib/logger/accesslogger.js");
var systemlogger = require("./lib/logger/systemlogger.js");
var accountcontrol = require("./lib/security/accountcontrol.js");
var cookieparser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var bodyparser = require("body-parser");
var app = express();

app.disable("x-powerd-by"); // header情報のx-pawored-byを秘匿する
app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));

app.use(accesslogger());
app.use(cookieparser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(flash());
app.use(session({
  secret: SESSION_SECRET, resave: false, saveUninitialized: true, name: "sid"
}));
app.use(...accountcontrol.initialize()); // middlewareを3つ使う、という意味

app.use("/", require("./routes/index.js"));
app.use("/post", require("./routes/post.js"));
app.use("/search", require("./routes/search.js"));
app.use("/account", require("./routes/account.js"));
app.use("/api/post", require("./api/post.js"));

app.use(systemlogger());

app.listen(3000);
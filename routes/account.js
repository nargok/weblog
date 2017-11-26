var router = require("express").Router();
var CONNECTION_URL = require("../config/mongodb.config.js").CONNECTION_URL;
var { authenticate, authorize } = require("../lib/security/accountcontrol.js");
var MongoClient = require("mongodb").MongoClient;

var validate = function (body) {
  var valid = true, errors = {}

  if (!body.url) {
    errors.url = "URLが未入力です。";
    valid = false;
  }

  if (!body.title) {
    errors.title = "タイトルが未入力です。";
    valid = false;
  }

  return valid ? undefined : errors;
};

var createRegistData = function (body) {
  var datetime, data;

  datetime = new Date();
  data = {
    url: body.url,
    published: datetime,
    updated: datetime,
    title: body.title,
    content: body.content,
    keywords: body.keywords ? (body.keywords || "").split(",") : "",
    authors: body.authors ? (body.authors || "").split(",") : ""
  };

  return data;
};

router.get("/", authorize("owner"), (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", authenticate());

router.post("/logout", authorize("owner"), (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

router.get("/post/regist", authorize("owner"), (req, res) => {
  res.render("./account/post/regist-form.ejs");
});

router.get("/post/regist", authorize("owner"), (req, res) => {
  res.render("./account/post/regist-form.ejs");
});

router.post("/post/regist", authorize("owner"), (req, res) => {
  var body = req.body;
  var errors = validate(body);
  var original = createRegistData(body);

  if (errors) {
    res.render("./account/post/regist-form.ejs", { errors, original });
    return;
  }

  MongoClient.connect(CONNECTION_URL).then((db) => {
    return db.collection("posts").insertOne(original);
  }).then((result) => {
    res.render("./account/post/regist-complete.ejs");
  }).catch((err) => {
    errors = {
      db: err.message
    };
    res.render("./account/post/regist-form.ejs", { errors, original });
  });
});

module.exports = router;
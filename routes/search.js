const MAX_ITEMS_PER_PAGE = require("../config/app.config.js").search.MAX_ITEMS_PER_PAGE;
const CONNECTION_URL = require("../config/mongodb.config.js").CONNECTION_URL;
var router = require("express").Router();
var MongoClient = require("mongodb").MongoClient;

router.get("/", (req, res) => {
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var keyword = req.query.keyword || "";

  MongoClient.connect(CONNECTION_URL).then((db) => {
    var regexp = new RegExp(`.*${keyword}.*`);
    var query = {
      $or: [{ title: regexp }, { content: regexp }] // タイトルか本文を検索する
    };
    return Promise.all([ // count → 検索の順番で処理をするためPromiseを使う
      db.collection("posts")
      .find(query)
      .count(),
      db.collection("posts")
      .find(query)
      .skip((page - 1) * MAX_ITEMS_PER_PAGE)
      .limit(MAX_ITEMS_PER_PAGE)
      .toArray()
    ]);
  }).then((results) => {
    var data = {
      keyword: keyword,
      count: results[0],
      list: results[1],
      pagination: {
        max: Math.ceil(results[0] / MAX_ITEMS_PER_PAGE),
        current: page
      }
    };
    res.render("./search/list.ejs", data);
  }).catch((err) => {
    return;
  });
});

module.exports = router;
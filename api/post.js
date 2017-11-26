const CONNECTION_URL = require("../config/mongodb.config.js").CONNECTION_URL;
var router = require("express").Router();
var MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  var database;
  MongoClient.connect(CONNECTION_URL).then((db) => {
    database = db;
    return db.collection("posts")
      .findOne({ url: { $eq: req.url } });
  }).then((post) => {
    if (post) {
      res.json(post);
    } else {
      res.status(404).json();
    }
    database.close();
  }).catch((err) => {
    res.json(err);
    database.close();
  });
});

module.exports = router;
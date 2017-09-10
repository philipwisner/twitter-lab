const express          = require("express");
const tweetsController = express.Router();

tweetsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

tweetsController.get("/", (req, res, next) => {
  res.render(
    "tweets/index",
    { username: req.session.currentUser.username}
  );
});

module.exports = tweetsController;

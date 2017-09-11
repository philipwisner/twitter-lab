const express          = require("express");
const tweetsController = express.Router();

//Require the user & tweet models
const User  = require("../models/user");
const Tweet = require("../models/tweet");




const moment = require("moment");
// other code
tweetsController.get("/", (req, res, next) => {
  User
    .findOne({ username: req.session.currentUser.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return; }

      Tweet.find({ "user_name": user.username }, "tweet created_at")
        .sort({ created_at: -1 })
        .exec((err, tweets) => {
          console.log("tweets");
          res.render("tweets/index",
            {
              username: user.username,
              tweets,
              moment });
        });
  });
});








//Route to check if logged in
tweetsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

//Route to show tweet overview
tweetsController.get("/", (req, res, next) => {
  res.render(
    "tweets/index",
    { username: req.session.currentUser.username}
  );
});

//Route that renders the new tweet view
tweetsController.get("/new", (req, res, next) => {
  res.render("tweets/new",
    { username: req.session.currentUser.username });
});


//Route to post new tweet data to db
tweetsController.post("/", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }

    const newTweet = Tweet({
      user_id:   user._id,
      user_name: user.username,
      tweet:     req.body.tweetText
    });

    newTweet.save((err) => {
      if (err) {
        res.render("tweets/new",
          {
            username: user.username,
            errorMessage: err.errors.tweet.message
          });
      } else {
        res.redirect("/tweets");
      }
    });
  });
});

module.exports = tweetsController;

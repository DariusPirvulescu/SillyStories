require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const story = require("./modules/create_story.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//// Local DB
// mongoose.connect("mongodb://localhost:27017/Silly", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//// Remote DB
mongoose.connect(
  "mongodb+srv://dario-admin:" +
    process.env.DB_PASS +
    "@cluster0-bhjc9.mongodb.net/sillyStories",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//// DB conection test
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("db connected");
// });

const messageSchema = new mongoose.Schema({
  id: Number,
  text: "String",
  name: "String",
  email: "String",
});

const Sentence = mongoose.model("Sentence", messageSchema);

const fullStoriesSchema = new mongoose.Schema({
  id: Number,
  name: "String",
  parts: {
    type: [messageSchema],
    required: true,
  },
});

const Story = mongoose.model("Story", fullStoriesSchema);

app.get("/", function (req, res) {
  const newest = Sentence.findOne().sort({ _id: -1 });

  Sentence.find({}, function (err, results) {
    if (!err) {
      if (results.length === 0) {
        res.render("fullstory");
      } else if (results.length === 20) {
        Story.find({}, function (err, record) {
          err
            ? console.log(err)
            : story.createNewStory(record, results, Story, Sentence, res);
        });
      } else {
        newest.exec((err, data) => {
          const newestDoc = data.text;
          sLeft = 20 - data.id;
          res.render("index", { toRender: newestDoc, sencentesLeft: sLeft });
        });
      }
    }
  });
});

app.get("/stories", function (req, res) {
  Story.find().exec(function (err, recordedStories) {
    err
      ? console.log(err)
      : res.render("stories", { stories: recordedStories });
  });
});

app.post("/", function (req, res) {
  const message = req.body.message;
  const eMail = req.body.email;
  const fName = req.body.fName;
  console.log(eMail);

  Sentence.find({}, function (err, results) {
    if (!err) {
      const newMessage = new Sentence({
        id: results.length + 1,
        text: message,
        name: fName,
        email: eMail,
      });

      newMessage.save(function (err) {});
    }
    res.redirect("/");
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server has started, port 3000");
});

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/Silly", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://dario-admin:" +
    process.env.DB_PASS +
    "@cluster0-bhjc9.mongodb.net/sillyStories",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//conection test
//   var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("db connected");
// });

const messageSchema = new mongoose.Schema({
  id: Number,
  text: "String",
  name: "String",
  email: "String",
});

const Sentence = mongoose.model("Sentence", messageSchema);

// const sentence1 = new Sentence({
//   id: 1,
//   text: "fjntibkkhkhkhkhkhkkhkh",
// });


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
  const newest = Sentence.findOne().sort({ _id: -1 }).limit(1);

  Sentence.find({}, function (err, results) {
    if (!err) {
      if (results.length === 0) {
        res.render("fullstory");
      } else if (results.length === 20) {
          /////////////////////////////////////////////
          Story.find({}, function (err, record) {
            if (err) {
              console.log(err);
            } else {
              const story = new Story({
                id: record.length + 1,
                name: `Story#${record.length + 1}`,
                parts: results,
              });
              // Story.deleteMany(function(err){
              //   err? console.log(err): null
              // })
    
              story.save(function (err, saved) {
                if (err) {
                  console.log(err);
                } else {
                  Sentence.deleteMany(function (err) {
                    err ? console.log(err) : null;
                  });
                  console.log("saved new Story, deleted the sentences");
                  // res.redirect("/")
                  res.render("fullstory");
                }
              });
            }
            
          });
          //////////////////////////////////////////////////////
      } else {
        // console.log("RESULTS LENGTH IN ROOT ROUTE : " + results.length);
        newest.exec((err, data) => {
          const newestDoc = data.text;
          sLeft = 20 - data.id;
          // console.log(sLeft.length);
          res.render("index", { toRender: newestDoc, sencentesLeft: sLeft });
        });
      }
    }
  });
});

// app.get("/fullstory");


app.get("/stories", function (req, res) {
  Sentence.find()
    .select("text id -_id")
    .limit(30)
    .exec(function (err, results) {
      Story.find().exec(function (err, recordedStories) {
        err
          ? console.log(err)
          : res.render("stories", { stories: recordedStories });
      });
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

      newMessage.save(function (err) {
        if (!err) {
        }
      });
    }
    // console.log("RESULTS IN POST ROUTE: " + results.length);
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

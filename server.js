require('dotenv').config()
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
//   useUnifiedTopology: true
// })


mongoose.connect(
  "mongodb+srv://dario-admin:" + process.env.DB_PASS + "@cluster0-bhjc9.mongodb.net/sillyStories",
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
const sentence1 = new Sentence({
  id: 1,
  text: "There were times of despair, there were times of contentment.",
});

app.get("/", function (req, res) {
  const newest = Sentence.findOne().sort({ _id: -1 }).limit(1);
  Sentence.find({}, function (err, results) {
    if (!err) {
      if (results.length === 0) {
        Sentence.insertMany(sentence1, function (err) {});
        res.redirect("/");
      } else if (results.length === 1) {
        res.render("index", { toRender: sentence1.text, sencentesLeft: sLeft });
      } else {
        newest.exec((err, data) => {
          const newestDoc = data.text;
          //console.log("Data iD: " + data.id);
          sLeft = 50 - data.id;
          res.render("index", { toRender: newestDoc, sencentesLeft: sLeft });
        });
      }
    }
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
          console.log("saved new Message " + newMessage);
        }
      });
      
    }
  });
  res.redirect("/");
  console.log(message);
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server has started");
});

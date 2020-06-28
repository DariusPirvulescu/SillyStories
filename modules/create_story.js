const mongoose = require("mongoose");

function createNewStory(record, results, storyModel, sentenceModel, respond) {
  const story = new storyModel({
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
      sentenceModel.deleteMany(function (err) {
        err ? console.log(err) : null;
      });
      respond.render("fullstory");
    }
  });
}

exports.createNewStory = createNewStory;

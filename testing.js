
  $( "#checkbox" ).change(function() {
    $( "#email" ).toggle( "slow", function(){
        console.log("toggle");
  });
});

// Sentence.find()
//   .select("text id")
//   // .skip(perPage * page)
//   // .limit(5)

//   .exec(function (err, events) {
//     // console.log(events)
//     events.forEach((one) => {
//       if (one.id % 2 === 0) {
//         console.log("even");
//       } else {
//         console.log("odd");
//       }
//     });
//   });
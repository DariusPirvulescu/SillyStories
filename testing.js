
  $( "#checkbox" ).change(function() {
    $( "#email" ).toggle( "slow", function(){
        console.log("toggle");
  });
});
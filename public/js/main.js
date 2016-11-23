function addHotel(){
  console.log("Hotel button is clicked");
  
  var day, selectedVal = $('#hotel-list').val()  


  // $.when & done is used for Async function with jQuery
  // This function looks similar to thenable function.
  // There are ways to use defer instead of this
  // which I don't fully understand so... pass

  $.when(

    // here we are running through each DOM node with class '.day-tab'. Look at line 76 on /views/trip.html

    $('.day-tab').each(function(index, element){
      if($(this).children().hasClass('active')){
        day = $(this).children().data('value'); 
      }
    })    
  ).done(function() {
    var listItem = $('#day'+day).children('#hotel-plan').children('.list-item');

    if(!listItem || listItem.length === 0 ){

      // following lines are sending POST request to the server.
      // which means you can recieve this POST request from express router. 
      // kind of similar to Sequalize querying right?
      // window.location.href is used to get current url from broweser

      $.post(window.location.href+'/hotel', {
        hotelId: selectedVal, 
        day: day
      }, function(result){
        // result of Async POST call is now a Sequelize instance pass by express response.json();
          console.log(result);
      });
    } else {
      alert('Hotel already exist');
    }  
  });
}


$(document).ready(function() {
  $('#hotel-btn').on('click', addHotel);
});
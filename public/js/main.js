function addHotel() {
    console.log("Hotel button is clicked");

    var day, selectedVal = $('#hotel-list').val();

    // $.when & done is used for Async function with jQuery
    // This function looks similar to thenable function.
    // There are ways to use defer instead of this
    // which I don't fully understand so... pass

    $.when(
        // here we are running through each DOM node with class '.day-tab'. Look at line 76 on /views/trip.html
        $('.tab-link').each(function() {
            if ($(this).hasClass('active')) {
                day = $(this).data('value');
            }
        })

    ).done(function() {
      console.log(day);
        var listItem = $('#day' + day+'>#hotel-plan').find('.list-item');

        if (!listItem || listItem.length === 0) {

            // following lines are sending POST request to the server.
            // which means you can recieve this POST request from express router. 
            // kind of similar to Sequalize querying right?
            // window.location.href is used to get current url from broweser

            $.post(window.location.href + '/hotel', {
                hotelId: selectedVal,
                day: day
            }, function(hotel) {
                // result of Async POST call is now a Sequelize instance pass by express response.json();
                console.log(hotel);    

                let $template = $(''+
                  '<div class="list-item row">' +
                    '<div class="col s10">'+hotel.name+'</div>'+
                    '<div class="col s2">'+
                      '<a class="clear-hotel" data-value="'+hotel.id+'">'+
                        '<i class="material-icons">clear</i>'+
                      '</a>'+
                    '</div>'+
                  '</div>');
                $('#hotel-plan>.plan-list').append($template);
            });
        } else {
            alert('Hotel already exist');
        }
    });
}

function addRestaurant() {
    console.log("Restaurant button is clicked");

    var day, selectedVal = $('#hotel-list').val()


}

function addActivity() {

}

$(document).ready(function() {
    $('#hotel-btn').on('click', addHotel);
    $('#restaurant-btn').on('click', addRestaurant);
    $('#activity-btn').on('click', addActivity);
});

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var chicago = {lat: 41.85, lng: -87.65};

function radarSearchControl(controlDiv, map) {

  var selectDiv = document.getElementById('pac-select');
  var select = document.getElementById('radar-search');
  //controlDiv.appendChild(select);

  let previous;


  $('#radar-search').on('focus', function(){
    previous = this.value;
  }).change(function(){
    if(this.value !== previous) {
      console.log(this.value); 
    }
    previous = this.value;
  });

  //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(selectDiv);
}

    function initAutocomplete() {
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        mapTypeId: 'roadmap'
      });

      // Create the search box and link it to the UI element.
      //var input = $('')
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      
      // Custom Control
      var topRightControlDiv = document.createElement('div');
      var topRightControl = new radarSearchControl(topRightControlDiv, map);

      topRightControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(topRightControlDiv);      
      

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {

        console.log('Place is changed');
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }

$(document).on("click","#search-button", function(event) {
    event.preventDefault();
    var searchTerm = "search?q=" + $("#search-field").val().trim();
    console.log(" HEY THIS IS WHAT IS INSIDE THE INPUT BOX " + searchTerm);
    console.log($("#search-field").val().trim());
    if ($("#search-field").val().trim() != ""){
        var queryURL = "https://sandbox-api.brewerydb.com/v2/" + searchTerm + "/&key=7380497d0148ba2e8a2b2d6ba7362a03";
        $("#brews-container").empty();
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
            })
        .then(function(response) {
            console.log(response);
            if (response.totalResults >10){
                var beerArray = [];
                for (let i=0; i<19; i++){
                    beerArray[i] = response.data[i].id;
                    if ("labels" in response.data[i]){
                        console.log("has label");
                        var beerCol = $("<div>").append(
                        $("<img>").attr({
                            "src" : response.data[i].labels.medium,
                            "class" : "img-fluid",
                            "alt" : "Responsive image"}),
                        $("<h4>").attr({
                            "class" : "text-center",
                            "style" : "font-family: 'Fjalla One', sans-serif; padding-top: 5px; color:lemonchiffon"}).text(response.data[i].name),
                        $("<h5>").attr({
                            "class" : "text-center",
                            "style" : "font-family: 'Fjalla One', sans-serif; padding-top: 5px; color:lemonchiffon"}).text(response.data[i].style.abvMax),
                        $("<div>").attr("class","show text-center").text(response.data[i].style.name)
                        // $("<span>").attr("class","showtext").text(response.data[1].style.description)
                        );
                        $("#brews-container").append(beerCol);
                    }
                }
            }
        });
    }
});

$(document).on("click", "#find-button", function(event) {
    event.preventDefault();
    var searchTerm2 = "search?q=" + $("#search-field").val().trim();
    var queryURL2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+85226&sensor=false&key=AIzaSyBu36ZRbWoTi-gl0GbmDWXp6oJ4H30R7x4";
    // $("#brews-container").empty();
    console.log(queryURL2);
    $.ajax({
        url: queryURL2,
        method: "GET"
        })
    .then(function(response) {
        console.log(response);
    });
});

$('#find-button').click(function() {
    window.location='localbreweries.html';
  });

var map;

function initMap() {
  // Create the map.
  var tempe = {lat: 33.423409, lng: -111.940412};
  map = new google.maps.Map(document.getElementById('map'), {
    center: tempe,
    zoom: 17
  });

  // Create the places service.
  var service = new google.maps.places.PlacesService(map);
  var getNextPage = null;
  var moreButton = document.getElementById('more');
  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) getNextPage();
  };

  // Perform a nearby search.
  service.nearbySearch(
      {location: tempe, radius: 500, type: ['restaurant']},
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };
      });
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');

  for (var i = 0, place; place = places[i]; i++) {
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    var li = document.createElement('li');
    li.textContent = place.name;
    placesList.appendChild(li);

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}
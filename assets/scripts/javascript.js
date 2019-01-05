// Search for beers 
$(document).on("click", "#search-button", function (event) {
    event.preventDefault();
    var searchTerm = "search?q=" + $("#search-field").val().trim();
    if ($("#search-field").val().trim() != "") {
        var queryURL = "https://sandbox-api.brewerydb.com/v2/" + searchTerm + "/&key=7380497d0148ba2e8a2b2d6ba7362a03";
        $("#brews-carousel").empty();
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                if (response.data.length > 0) {
                    var carouselItem = "";
                    var firstBeer = true;
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].labels) {
                            if (firstBeer) {
                                carouselItem = "carousel-item active";
                                firstBeer = false;
                            } else {
                                carouselItem = "carousel-item";
                            }
                            var beerItem = $("<div>").addClass(carouselItem).append(
                                $("<img>").attr({
                                    "class": "d-block col-3 img-fluid",
                                    "src": response.data[i].labels.medium,
                                    "data": response.data[i].id
                                })
                            );
                            $("#brews-carousel").append(beerItem);
                        };
                    };
                    drawCarousel();
                };
            });
    }
});

//Gets 4 random beers

var beerArray = [];

function getRandomBeer() {
    var getRandomBeerURL = "https://sandbox-api.brewerydb.com/v2/beer/random/?key=7380497d0148ba2e8a2b2d6ba7362a03";
    var carouselItem = "";
    var firstBeer = true;
    var fourRandosFound = 0;
    $("#brews-carousel").empty();
    for(let i = 1; i < 11; i++) {
        console.log(fourRandosFound);
        $.ajax({
            url: getRandomBeerURL,
            method: "GET"
        })
            .then(function (response) {
                var uniqueBeer = "https://sandbox-api.brewerydb.com/v2/beer/" + response.data.id + "/?key=7380497d0148ba2e8a2b2d6ba7362a03";
                $.ajax({
                    url: uniqueBeer,
                    method: "GET"
                })
                    .then(function(response2) {
                        if(response2.data.labels && (fourRandosFound<4)){
                            if (firstBeer) {
                                carouselItem = "carousel-item active";
                                firstBeer = false;
                            } else {
                                carouselItem = "carousel-item";
                            }
                            var beerItem = $("<div>").addClass(carouselItem).append(
                                $("<img>").attr({
                                    "class": "d-block col-3 img-fluid",
                                    "src": response2.data.labels.medium,
                                    "data": response2.data.id
                                })
                            );
                            $("#brews-carousel").append(beerItem);
                            fourRandosFound++;
                            console.log("Random Beer with label found! Count is " + fourRandosFound);
                            if (fourRandosFound==4) {
                                drawCarousel();
                            }
                        }
                    });
            }); 
        }
}

$(document).on("click", "#find-button", function (event) {
    event.preventDefault();
    var searchTerm2 = "search?q=" + $("#search-field").val().trim();
    // Add geolocate and/or zip code box for search.  
    var queryURL2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+85226&sensor=false&key=AIzaSyBu36ZRbWoTi-gl0GbmDWXp6oJ4H30R7x4";
    console.log(queryURL2);
    $.ajax({
        url: queryURL2,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
        });
});

//Opens new html page for google places.

$('#find-button').click(function () {
    window.location = 'localbreweries.html';
});

$(document).ready(function(){
    getRandomBeer();
});
// Google places code to create map and markers.
var latLongString;

function getLatLngByZipcode(zipcode) {
    var latLongQuery ="https://maps.googleapis.com/maps/api/geocode/json?address="+ zipcode +"&key=AIzaSyAxR6ZRJI9Wrw_dljpvfsR2Ic35iF-3OPo"
    $.ajax({
        url: latLongQuery,
        method: "GET",
        success: function (response) {
            latitude = response.results[0].geometry.location.lat;
            longitude = response.results[0].geometry.location.lng;
            answer = "lat: " + latitude +", lng: " + longitude;
            handleResponse(answer);
        }
    })
}

function handleResponse (answer) {
    latLongString = answer;
    console.log(latLongString);
}

getLatLngByZipcode(85226);
console.log(latLongString);

var map;

function initMap() {
    // Create the map.
    var customLocation = { lat: 33.423409, lng: -111.940412 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: customLocation,
        zoom: 17
    });

    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
    var getNextPage = null;
    var moreButton = document.getElementById('more');
    moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
    };

    // Perform a nearby search.
    service.nearbySearch(
        { location: customLocation, radius: 500, type: ['bar'] },
        function (results, status, pagination) {
            if (status !== 'OK') return;

            createMarkers(results);
            moreButton.disabled = !pagination.hasNextPage;
            getNextPage = pagination.hasNextPage && function () {
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

// Bootstrap carousel with multiple slides and interval based update.

function drawCarousel() {
    // console.log("draw carousel first")
    $('#recipeCarousel').carousel({
        interval: 50000
    })

    $('.carousel .carousel-item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        // console.log("draw carousel")
        next.children(':first-child').clone().appendTo($(this));

        for (var i = 0; i < 2; i++) {
            next = next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }

            next.children(':first-child').clone().appendTo($(this));
        }
    });
}

drawCarousel();

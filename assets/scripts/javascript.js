
$(document).on("click","#search-button", function(event) {
    event.preventDefault();
    var searchTerm = "search?q=" + $("#search-field").val().trim();
    var queryURL = "https://sandbox-api.brewerydb.com/v2/" +
    searchTerm + "/&key=7380497d0148ba2e8a2b2d6ba7362a03";
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
            for (let i=0; i<9; i++){
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
});

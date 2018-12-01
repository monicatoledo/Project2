// Creating map object
var myMap = L.map("map", {
    center: [39, -28],
    zoom: 2
});

var list_old_markers = []; 

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

function markerSize(number) {
    return number * 100000;
  }

function movieCircle(country, location, popularity) {
    var city = {
      country: country,
      location: location,
      popularity: popularity,
      color: ""
    };
  
    if (city.country === "United States of America") {
      city.color = "red";
    }
    else if (city.country === "India") {
      city.color = "green";
    }
    else if (city.country === "France") {
      city.color = "blue";
    }
    else if (city.country === "United Kingdom") {
      city.color = "purple";
    }
    else if (city.country === "China") {
      city.color = "yellow";
    }
  
    // A Circle to represent the movie number
    var new_circle = L.circle(city.location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: city.color,
      radius: markerSize(city.popularity)
      });
    
    new_circle
      .bindPopup("<h1>" + city.country + "</h1> <hr> <h3>Popularity: " + city.popularity + "</h3>")
      .addTo(myMap);
    
    // Record the exising circle
    list_old_markers.push(new_circle);
}



function getMovies(year_selected){
    var year = year_selected;
    var region = ["United States of America", "India", "France", "United Kingdom", "China"];

    for (var i=0; i < list_old_markers.length; i++){
        myMap.removeLayer(list_old_markers[i]);
    }


    d3.csv("/data/movies.csv", function(data){
        console.log("YEAR_SELECTED:", year);
        console.log(data);
        var popularity_1 = 1;
        var popularity_2 = 1;
        var popularity_3 = 1;
        var popularity_4 = 1;
        var popularity_5 = 1;
        var count_1 = 1;
        var count_2 = 1;
        var count_3 = 1;
        var count_4 = 1;
        var count_5 = 1;
        data.forEach(function(d){
            var region = d.country;
            //console.log("d.year=", d.year);
                if (region === "United States of America" && d.year === year) {
                    popularity_1 += parseInt(d.popularity);
                    count_1 += 1;
                    // Call the function to draw a circle
                    //console.log("Popularity", popularity);
                    //console.log(location);
                
                }
            
                else if (region === "India" && d.year === year) {
                    //console.log("India:", parseInt(d.popularity));
                    popularity_2 += parseInt(d.popularity);
                    count_2 += 1;
                    // Call the function to draw a circle
                    //console.log(location);
                    //console.log("Popularity", popularity);
                }
            
                else if (region === "France" && d.year === year) {
                    popularity_3 += parseInt(d.popularity);
                    count_3 += 1;
                    // Call the function to draw a circle
                    //console.log("Popularity", popularity);
                    //console.log(location);
                }
            
                else if (region === "United Kingdom" && d.year === year) {
                    popularity_4 += parseInt(d.popularity);
                    count_4 += 1;
                    // Call the function to draw a circle
                    //console.log("Popularity", popularity);
                    //console.log(location);
                }
            
                else if (region === "China" && d.year === year) {
                    //console.log("China:", parseInt(d.popularity));
                    popularity_5 += parseInt(d.popularity);
                    count_5 += 1;
                    // Call the function to draw a circle
                    //console.log("Popularity", popularity);
                    //console.log(location);
                }
            
            });
        console.log("P1:", popularity_1);
        console.log("P2:", popularity_2);
        console.log("P3:", popularity_3);
        console.log("P4:", popularity_4);
        console.log("P5:", popularity_5);

        // var location = [34.0522, -118.2437];  //Los Angeles
        // var location = [19.0760, 72.8777];  //Mumbai
        // var location = [48.8566, 2.3522];  //Paris
        // var location = [51.5074, -0.1278];  //London
        // var location = [39.9042, 116.4074];  //Beijing

        movieCircle("United States of America", [34.0522, -118.2437], popularity_1/count_1);
        movieCircle("India", [19.0760, 72.8777], popularity_2/count_2);
        movieCircle("France", [48.8566, 2.3522], popularity_3/count_3);
        movieCircle("United Kingdom", [51.5074, -0.1278], popularity_4/count_4);
        movieCircle("China", [39.9042, 116.4074], popularity_5/count_5);
});
    
    
}


function moviePop(data) {
    data[0].popularity
} 

function init(){
    var years   = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"];
  
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of years to populate the select options
    years.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    });
}
  
function optionChanged(year_selected) {
    getMovies(year_selected);
}


 
// Initialize
 
init();

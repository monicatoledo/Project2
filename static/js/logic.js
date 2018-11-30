// Use the location of Rome (41.9028° N, 12.4964° E) as the center of world map
// Creating map object
var myMap = L.map("map", {
  center: [40, -20],
  zoom: 2
});

// Record all exising circles
var list_old_markers = []; 

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: MAP_API_KEY
}).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(number) {
  return number * 800;
}


// Define a movieCircle function to draw a circle
function movieCircle(country ,location, movies) {
  var city = {
    country: country,
    location: location,
    movies: movies,
    color: ""
  };

  if (city.country === "US") {
    city.color = "red";
  }
  else if (city.country === "IN") {
    city.color = "green";
  }
  else if (city.country === "FR") {
    city.color = "blue";
  }
  else if (city.country === "GB") {
    city.color = "purple";
  }
  else if (city.country === "CN") {
    city.color = "yellow";
  }

  // A Circle to represent the movie number
  var new_circle = L.circle(city.location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: city.color,
    radius: markerSize(city.movies)
    });
  
  new_circle
    .bindPopup("<h1>" + city.country + "</h1> <hr> <h3>Movies: " + city.movies + "</h3>")
    .addTo(myMap);
  
  // Record the exising circle
  list_old_markers.push(new_circle);
}

// Define a getMovies function to draw circles for each country/city by movie numbers
function getMovies(year_selected) {
  // Range of data query
  var year = year_selected;
  var regions = ["US", "IN", "GB", "FR", "CN"];

  // Basic query URL
  var baseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&sort_by=popularity.desc&include_adult=false`

  // Clear all exising circles
  for(var i = 0; i < list_old_markers.length; i++) {
    myMap.removeLayer(list_old_markers[i]);
  }

  // Each Country
  for (var j=0; j<regions.length; j++) {
    var region = regions[j];

    // Assemble API query URL
    var url = baseURL + `&year=${year}&region=${region}`;
    // console.log(url);

    if (region === "US") {
      // Grab the data with d3
      d3.json(url, function(response) {
        var location = [34.0522, -118.2437];  //Los Angeles
        var movies = response.total_results;
        // Call the function to draw a circle
        console.log("Movies", movies);
        console.log(location);
        movieCircle("US", location, movies);
      });
    }

    else if (region === "IN") {
      // Grab the data with d3
      d3.json(url, function(response) {
        var location = [19.0760, 72.8777];  //Mumbai
        var movies = response.total_results;
        // Call the function to draw a circle
        console.log("Movies", movies);
        console.log(location);
        movieCircle("IN", location, movies);
      });
    }

    else if (region === "FR") {
      // Grab the data with d3
      d3.json(url, function(response) {
        var location = [48.8566, 2.3522];  //Paris
        var movies = response.total_results;
        // Call the function to draw a circle
        console.log("Movies", movies);
        console.log(location);
        movieCircle("FR", location, movies);
      });
    }

    else if (region === "GB") {
      // Grab the data with d3
      d3.json(url, function(response) {
        var location = [51.5074, -0.1278];  //London
        var movies = response.total_results;
        // Call the function to draw a circle
        console.log("Movies", movies);
        console.log(location);
        movieCircle("GB", location, movies);
      });
    }

    else if (region === "CN") {
      // Grab the data with d3
      d3.json(url, function(response) {
        var location = [39.9042, 116.4074];  //Beijing
        var movies = response.total_results;
        // Call the function to draw a circle
        console.log("Movies", movies);
        console.log(location);
        movieCircle("CN", location, movies);
      });
    }

  }
}




function init() {
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


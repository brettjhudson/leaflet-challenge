// Store our API endpoint as queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Perform a GET request to the query URL
//d3.json(queryUrl, function(data) {

d3.json(queryUrl).then(function(data) {

  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map

  function onEachFeature(feature, layer) {
    layer.bindPopup(`${feature.properties.place}<hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`);
  }

  function getColor(depth) {

    //Use if/else if etc on mag to change colors
    
    if (depth>90)
      return "#FF0000";
    else if (depth>80)
      return "#FF3300"
      else if (depth>70)
      return "#ff9900"
      else if (depth>60)
      return "#FFCC00"
      else if (depth>50)
      return "#FFFF00"
      else if (depth>40)
      return "#ccff00"
      else if (depth>30)
      return "#99ff00"
      else if (depth>20)
      return "#66ff00"
      else if (depth>10)
      return "#33ff00"
      else if (depth>0)
      return "#00FF00"
      else
    return "white";
  }

  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        "color": "white",
        "fillOpacity": 1,
        "fillColor": getColor(feature.geometry.coordinates[2]),
        "weight": 5,
        "radius": feature.properties.mag * 5,
        "opacity": 0.65    
      }
    }  
  })

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    "Earthquakes": earthquakes
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      39.09, -98.48
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// LEGEND //

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {


    var div = L.DomUtil.create('div', 'info legend');
        grades = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
        labels = ["#FF0000", "#FF3300",  "#ff9900", "#FFCC00", "#FFFF00", "#ccff00", "99ff00", "#66ff00", "#33ff00", "#00FF00"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

  
});


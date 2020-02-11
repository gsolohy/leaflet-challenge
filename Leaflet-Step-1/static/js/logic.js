quake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



d3.json(quake_link).then(x => {
    createFeatures(x.features);
})

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        // layer.bindPopup("<h3>" + feature.properties.place +
        // "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        var location = feature.geometry.coordinates;
        
        L.circle(location, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: "purple",
            radius: feature.properties.mag
          })

        layer.bindPopup(`<h3> ${feature.properties.place}</h3><hr>
                         <p>Magnitude: ${feature.properties.mag}</p>
                         <p> ${new Date(feature.properties.time)} </p>`);
    };

    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
};

function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
                                      <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                                      Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: api_key
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
                                      <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                                      Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: api_key
    });

    var baseMaps = {
        Street: streetmap,
        Dark: darkmap
    };
    
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [34.052235, -118.243683],
        zoom: 6,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};


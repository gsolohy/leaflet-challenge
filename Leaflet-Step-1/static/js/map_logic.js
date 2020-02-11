quake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [34.052235, -118.243683],
    zoom: 8
});

L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
                                  <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                                  Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: api_key
}).addTo(myMap);

function getColor(mag) {
    return mag > 4 ? 'red' :
           mag > 3 ? 'firebrick' :
           mag > 2 ? 'darkorange' :
           mag > 1 ? 'gold' :
                     'greenyellow';
};

d3.json(quake_link).then(quake_data => {
    L.geoJson(quake_data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 10,
                fillColor: getColor(feature.properties.mag),
                fillOpacity: 0.8,

                color: "#000",
                weight: 0.5,
                opacity: 0.8                
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3> ${feature.properties.place}</h3><hr>
                             <h4>Magnitude: ${feature.properties.mag}</h4>
                             <h4>${new Date(feature.properties.time)}</h4>`);
        }
    }).addTo(myMap)
});

var legend = L.control({position: "bottomright"});
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    var labels = ["0-1","1-2","2-3","3-4","4+"];
    var colors = ["greenyellow","gold","darkorange","firebrick","red"];
    div.innerHTML = "<p class='m-top'>Legend</p>";
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML += `<i style=background:${colors[i]}></i>${labels[i]}<br>`;
    }
    return div;
};
legend.addTo(myMap);
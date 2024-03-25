//topographical tile layer
let base = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",{
        attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });
//initialize map
let mymap= L.map("map",{
    center: [
        40.7, -94.5
      ],
      zoom: 3
});
base.addTo(mymap);

//pull in geojson data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function (data){
    
    function styleInfo(feature){
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    //color markers by magnitude
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#7a4659";
            case depth > 70:
                return "#9e4354";
            case depth > 50:
                return "#ca5771";
            case depth > 30:
                return "#d695a8";
            case depth > 10:
                return "#b8aeb4";
            default:
                return "#d5d4d1"
        }
    }
    //marker radius by magnitude
    function getRadius(magnitude) {
        if (magnitude===0) {
            return 1;
        }
        return magnitude *4;
    }
    //process geojson data
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        //pull style from above
        style: styleInfo,
        //popups for each marker
        oneEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
              );
        }
    }).addTo(mymap)

    //legend
    let legend = L.control({
        position: "topright"
    });
    //details for legend
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legened");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#d5d4d1", "#b8aeb4", "#d695a8", "#ca5771", "#9e4354", "#7a4659"];

    //create label for each interval
    for (let i=0; i<grades.length; i++) {
        div.innerHTML +="<i style='background: " +colors[i] + "'></i>"
            +grades[i] +(grades[i+1] ? "&ndash;" + grades [i+1] + "<br>":"+");
    }
    return div;
    };
    //add legend to map
    legend.addTo(mymap);
});










//createFeatures(data.features);
//gradient: https://huemint.com/gradient-6/#palette=d5d4d1-b8aeb4-d695a8-ca5771-9e4354-7a4659
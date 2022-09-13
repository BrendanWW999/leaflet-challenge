var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

    // Map attributes

function createMap(response) {

    var centerCoordinates = [40, 0];
    var mapZoom = 2;
    var myMap = L.map("map", {
        center: centerCoordinates,
        zoom: mapZoom
    });

    // Tile layer attributes

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY 
    }).addTo(myMap);

      L.geoJSON(response, {pointToLayer: function(feature, coord) {
            return L.circleMarker(coord, {
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },

       onEachFeature: onEachFeature
    }).addTo(myMap)

    function onEachFeature(feature, layer) {
        var format = d3.timeFormat("%d-%b-%Y at %H:%M");
        layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Time: </strong>${format(new Date(feature.properties.time))}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
    };

    // Legend & Labels attributes

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var labels = [];
        var legendInfo = "<h5>Magnitude</h5>";

        div.innerHTML = legendInfo;

        for (var i = 0; i < magnitudes.length; i++) {
            labels.push('<li style="background-color:' + magColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
        }
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);

}; 

// Markers reflecting size of magnitude

function markerSize(magnitude) {
    return magnitude * 3;
}

// Colours reflecting size of magnitude

function magColor(magnitude) {
    if (magnitude <= 1) {
		return 'lime'
	} else if (magnitude <=2) {
		return 'green'
	} else if (magnitude <=3) {
		return 'yellow'
	} else if (magnitude <=4) {
		return 'orange'
    } else if (magnitude <=5) {
		return 'red'
	} else { return 'purple'
	}
};

d3.json(url, function(response) {
createMap(response.features);
});
function createMap(circle_list) {
 

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Bike Stations": circle_list
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [37.8, -96],
      zoom: 2,
      layers: [streetmap, circle_list]
    });
  

    // let map = L.map("map", {
    //     center: [40.73, -74.0059],
    //     zoom: 12,
    //     layers: [streetmap, circle_list]
    // });


    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  

    function getColor(d) {
        return d > 90  ? '#d73027' :
            d > 70  ? '#fc8d59' :
            d > 50   ? '#fee08b' :
            d > 30   ? '#d9ef8b' :
            d > 10   ? '#91cf60' :
                        '#1a9850';
    }   

  function createMarkers(response) {

    // Pull the "stations" property from response.data.
    //  let stations = response.data.stations;
    // let stations = response.features[1].geometry;
    let earthquake_list = response.features
    // Initialize an array to hold bike markers.
    let earthquake_markers = [];
    earthquake_list.forEach(earthquake => {
        
        let magnitude = earthquake.properties.mag
        let depth = earthquake.geometry.coordinates[2]
        // let earthquake_marker = ([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
        // .bindPopup("<h3>" + "" + "<h3><h3>Capacity: " + "" + "</h3>");

        // var earthquake_circle = L.circle([earthquake_marker], {
        var earthquake_circle = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            color: 'black',
            // fillColor: '#f03',
            fillColor: getColor(depth),
            fillOpacity: 0.8,
            radius: magnitude * 10000
        })

  
        // Add the marker to the bikeMarkers array.
        // earthquake_markers.push(earthquake_marker);
        earthquake_markers.push(earthquake_circle);
    });
    
  
    // // Loop through the stations array.
    // for (let index = 0; index < stations.length; index++) {
    //   let station = stations[index];
  
    //   // For each station, create a marker, and bind a popup with the station's name.
    //   let bikeMarker = L.marker([station.lat, station.lon])
    //     .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
  
    //   // Add the marker to the bikeMarkers array.
    //   bikeMarkers.push(bikeMarker);
    // }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquake_markers));
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  
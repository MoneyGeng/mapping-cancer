let cancerType, province, bothSexesData = [];
var sample = new Array();
var allData = new Array();

d3.json("Resources/provincial_data.json").then(function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        allData.push(data[i])
        sample.push(data[i].Cancer_type)
    }

    // Mapping out data into arrays
    uniqueCancerTypes = sample.filter((value, index, array) => array.indexOf(value) === index);
    console.log(uniqueCancerTypes)
    //console.log(allData)

    const selectElement = document.getElementById("selDataset");
    for (let i = 0; i < uniqueCancerTypes.length; i++) {
      const optionElement = document.createElement("option");
      const optionText = document.createTextNode(uniqueCancerTypes[i]);
      optionElement.appendChild(optionText);
      selectElement.appendChild(optionElement);  
    };
})
  
d3.selectAll("onchange").on("change", optionChanged);

// Defining the optionChanged() function
function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");
    // Initialize an empty array for the country's data
    let selection = allData.filter(prov => prov.Cancer_type== dataset);
            console.log(selection)

    // for (let i = 0; i < uniqueCancerTypes.length; i++) {
    //     for (let j = 0; j < allData.length; j++) {
    //     if (dataset == sample[i]) {
    //         //console.log(allData[j].Province)
    //         if (allData[j].Province == "AB") 
    //         console.log(allData[i].Cancer_type)
            
            
            //console.log(allData[j].filter(prov => prov.Province=="AB"))
        // }}}
    }
//}

  // Load the GeoJSON data.
let geoData = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=georef-canada-province%40public&q=&rows=13&facet=prov_name_en&facet=prov_area_code&facet=prov_type"

d3.json(geoData).then(function(gData) {
    console.log(gData.records[0]);
});


// Creating the map object
var myMap = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 7
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


// // Create the createMarkers function.
// function createMarkers(response) {
//   // Pull the "stations" property from response.data.
//   let provs = response.data.stations;
//   // Initialize an array to hold the bike markers.
//   var bikeMarkers = [];
//   // Loop through the stations array.
//     // For each station, create a marker, and bind a popup with the station's name.
//     for (var i = 0; i < stations.length; i++) {
//       var station = stations[i];
    
//     // Add the marker to the bikeMarkers array.
//     var bikeMarker = L.marker([station.lat, station.lon]).bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
//   // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
//     bikeMarkers.push(bikeMarker);
//     }

// // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
// const mapLayer = L.layerGroup(bikeMarkers)
// createMap(mapLayer);
// }
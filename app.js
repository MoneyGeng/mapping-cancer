const geoData = "Resources/provincial_data.json";

var allData = new Array();

// load json file
// populate allData
d3.json(geoData).then(function (data) {
  console.log(data)
  var sample = new Array();
  for (let i = 0; i < data.length; i++) {
    allData.push(data[i])
    sample.push(data[i].Cancer_type)
  }

  // cancer type drop down
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

d3.select("#selDataset").on("change", optionChanged);

// Defining the optionChanged() function
var selectedCancerTypeCountBothSexes = [];
function optionChanged() {
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let dataset = dropdownMenu.property("value");
  // Initialize an empty array for the country's data
  const selection = allData.filter(prov => prov.Cancer_type == dataset);
  selectedCancerTypeCountBothSexes = selection.map(obj => obj.Both_sexes);
  console.log(selectedCancerTypeCountBothSexes)
}

// Load the GeoJSON data.
var breaks = [-Infinity, 399, 642, 933.2, 2089.8, Infinity];
var colors = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"];

function getColor(d) {
  for (var i = 0; i < breaks.length; i++) {
    if (d > breaks[i] && d <= breaks[i + 1]) {
      return colors[i];
    }
  }
}

function style(feature) {
  return {
    fillColor: getColor(selectedCancerTypeCountBothSexes),
    weight: 0.5,
    opacity: 1,
    color: "black",
    fillOpacity: 0.7
  };
}

// Creating the map object
var myMap = L.map("map", {
  center: [62.2270, -105.3809],
  zoom: 3
});

d3.json(geoData).then(function (gData) {
  var geojson = L.geoJSON(gData, {
    style: style
  }).addTo(myMap);
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
//////////////////////////////////////////////////////////////////////////////
// numCancerTypes is used to define how many values are presented in the bar chart
const numCancerTypes = 10;
// store unfiltered provincial_data.json into an empty array
// populated by d3.json
var allBarChartData = [];

// load the data
d3.json(geoData).then(function (data) {
  // province drop down
  // (...) : spread operator, spreading the data into an array
  const uniqueProvinces = [...new Set(data.map(prov => prov.Province))];
  // get selProvince dropdown menu select tag
  const selectElement = document.getElementById("selProvince");
  // populating dropdown menu with options
  for (let i = 0; i < uniqueProvinces.length; i++) {
    const optionElement = document.createElement("option");
    const optionText = document.createTextNode(uniqueProvinces[i]);
    optionElement.appendChild(optionText);
    selectElement.appendChild(optionElement);
  };
  // setting all unfiltered bar chart data 
  allBarChartData = data;
  console.log(allBarChartData);
  // build the chart with a default province by getting the first unique province
  buildChart(uniqueProvinces[0]);
});

// when the selection changes, change the selected province
d3.select("#selProvince").on("change", provinceChanged);

function provinceChanged() {
  // get selected province
  const selectedProvince = d3.select("#selProvince").property("value");
  console.log(selectedProvince);
  // call selectedProvince to the buildChart function
  buildChart(selectedProvince);
}

/**
 * buildChart making a chart
 * buildChart creates a bar chart representing the top 10 Cancer_type of selectedProvince
 * @param {string} selectedProvince - filter through each unique province
 */
function buildChart(selectedProvince) {
  let barChartData = allBarChartData;
  // filter down the data to get the top numCancerTypes for both sexs in the province 
  // a is greater than b if a.Both_sexes > b.Both_sexes
  barChartData = barChartData.filter((obj) => obj.Province == selectedProvince);
  barChartData = barChartData.filter((obj) => obj.Cancer_type !== "All cancers");
  barChartData.sort((a, b) => b.Both_sexes - a.Both_sexes);
  barChartData = barChartData.slice(0, numCancerTypes);

  const xValues = barChartData.map((obj, index) => index);
  const yValues = barChartData.map(obj => obj.Both_sexes);
  const cancerLabels = barChartData.map(obj => obj.Cancer_type);
  console.log(xValues, yValues, cancerLabels)

  const barData = [{
    x: cancerLabels,
    y: yValues,
    text: cancerLabels,
    type: "bar",
    orientation: "v"
  }];

  // Create layout for bar chart
  const barLayout = {
    title: `Top ${numCancerTypes} Cancers Found by Province`
  };
  // plot the barchart 
  Plotly.newPlot("barchart", barData, barLayout);
}
// set the initial selected province to the first option
// let selectedProvince = provinceOptions[0];

// // create a filtered dataset based on the selected province
// function filterData() {
//   return data.filter((prov) => prov.Province === selectedProvince);
// }

// // set up the chart dimensions
// const margin = { top: 20, right: 20, bottom: 50, left: 60 };
// const width = 600 - margin.left - margin.right;
// const height = 400 - margin.top - margin.bottom;

// // create the svg element and set its dimensions
// const svg = d3
//   .select("#chart")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // set up the x and y scales
// const x = d3
//   .scaleBand()
//   .range([0, width])
//   .padding(0.2)
//   .domain(filterData().map(prov => prov.Cancer_type));

// const y = d3
//   .scaleLinear()
//   .range([height, 0])
//   .domain([0, d3.max(filterData(), (prov) => +prov.Both_sexes)]);

// // add the x-axis to the chart
// svg
//   .append("g")
//   .attr("transform", `translate(0, ${height})`)
//   .call(d3.axisBottom(x));

// // add the y-axis to the chart
// svg.append("g").call(d3.axisLeft(y));

// // add the bars to the chart
// svg
//   .selectAll("rect")

////////////////////////////////////////////////////////
// Create a horizontal bar chart with a dropdown menu to display the top 10 cancers in the selected province ///
// function buildCharts() {


//   // Create a variable that filters the cancer types 
//   let filtered = allData.filter(prov => prov.Cancer_type == dataset);
//   console.log(filtered)

//   // Create a variable that filters the both sexes total 
//   //   let metadata = data.metadata;
//   let filtered2 = allData.filter(prov => prov.Both_sexes == dataset);

//   // Create a variable that holds the first sample in the both sexes array.
//   let result = filtered2[0];

//   // Create a variable that holds the first sample in the array.
//   let firstSample = filtered[0]
//   console.log(firstSample)


//   let Cancer_type = firstSample.Cancer_type
//   let cancer_labels = firstSample.Cancer_type
//   let cancer_values = firstSample.Both_sexes
//   console.log(Cancer_type)
//   console.log(cancer_labels)
//   console.log(cancer_values)



//   let yValues = Cancer_type.slice(0, 5).map(Cancer_type => `${Cancer_type}`).reverse();
//   console.log(yValues);

//   let barData = [{
//     x: cancer_labels.slice(0, 5).reverse(),
//     y: yValues,
//     text: cancer_labels.slice(0, 5).reverse(),
//     type: "bar",
//     orientation: "h"
//   }];

//   // Create layout for bar chart
//   let barLayout = {
//     title: "Top 5 Cancers Found"
//   };

//   Plotly.newPlot("bar", barData, barLayout);
// });
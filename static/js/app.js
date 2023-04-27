// Defining new arrays to populate the data into
var sample = new Array();
var allData = new Array();

// Loading the GeoJSON data
// "geoDatUrl" is defined in the global scope from base.html 
d3.json(geoDataUrl).then(function (data) {
  console.log(data)
  for (let i = 0; i < data.length; i++) {
    // Pushing the data retrieved into the arrays defined before - pushing all data in the allData array and the cancer types in the samples array
    allData.push(data[i])
    sample.push(data[i].Cancer_type)
  }
  // Extracting out only the unique cancer types from the sample array
  uniqueCancerTypes = sample.filter((value, index, array) => array.indexOf(value) === index);

  // Adding the options from uniqueCancerTypes onto the select drop-down menu to add the interactive feature
  const selectElement = document.getElementById("selDataset");
  for (let i = 0; i < uniqueCancerTypes.length; i++) {
    const optionElement = document.createElement("option");
    const optionText = document.createTextNode(uniqueCancerTypes[i]);
    optionElement.appendChild(optionText);
    selectElement.appendChild(optionElement);
  };
})

// Defining 2 layer variables that will be removed and added as the data is updated
var oldLayer;
var newLayer;

// Defining a function that will display the default/initial data on the map
function init() {
  let allCancer = [];

  // Defining the style function which will add style features to the map based on the data inputted
  function style(feature1) {

    // Populating the allCancer array which will filter data from the allData array to contain only the data 
  //where cancer type is All cancers as this is what needs to be shown on the default map on the landing page (when no selection is made)
    allCancer = allData.filter(prov => prov.Cancer_type == "All cancers");
    const provinceData = allCancer.find(d => d.Province_full === feature1.properties.prov_name_en[0]);
    if (!isNaN(provinceData)) {
      console.log(provinceData)
    }

    // This part of the code is very crucial as it defines the colours of the different provinces in the map based on the prevalence value
    let color = '#cccccc';
    if (provinceData) {
      const value = parseFloat(provinceData.Both_sexes);
      if (!isNaN(value)) {
        color = value > 10000 ? '#800000' :
          value > 5000 ? '#b30000' :
            value > 2500 ? '#e34a33' :
              value > 1000 ? '#fc8d59' :
                value > 500 ? '#fdcc8a' :
                  '#ffffcc';
      }
    }

    // The colours defined previously are inputted in the fillColor
    return {
      fillColor: color,
      weight: 0.5,
      opacity: 1,
      color: "black",
      fillOpacity: 0.7
    };
  }

  // Defining a function which will show the province name and the corresponding prevalence value whenever a province is clicked on
  function applyOnEachFeature(feature, layer) {
    for (let i = 0; i < allCancer.length; i++) {
      if (feature.properties.prov_name_en[0] == allCancer[i].Province_full) {
        layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${allCancer[i].Both_sexes}`);
      }
    }
  }

  // "geoRefUrl" is defined in base.html
  // Replacing the layer with new data when the selection is made to update the map
  d3.json(geoRefUrl).then(function (gData) {
    oldLayer = L.geoJSON(gData, {
      style: style,
      onEachFeature: applyOnEachFeature
    }).addTo(myMap);
  }
  )
}

// This code will execute the optionChanged function when the option is changed in the 
d3.selectAll("onchange").on("change", optionChanged);

// Defining the optionChanged() function
function optionChanged() {

  // Obtaining the drop-down menu option 
  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  let selection = allData.filter(prov => prov.Cancer_type == dataset);

  // Defining the style function for map for the selected option
  function style(feature2) {
    for (let i = 0; i < selection.length; i++) {
      if (dataset == selection[i].Cancer_type) {
        const provinceData2 = selection.find(d => d.Province_full === feature2.properties.prov_name_en[0]);

        let color = '#cccccc';
        if (provinceData2) {
          const value = parseInt(provinceData2.Both_sexes);

          if (!isNaN(value)) {
            color = value > 10000 ? '#800000' :
              value > 5000 ? '#b30000' :
                value > 2500 ? '#e34a33' :
                  value > 1000 ? '#fc8d59' :
                    value > 500 ? '#fdcc8a' :
                      '#ffffcc';
          }
        }
        return {
          fillColor: color,
          weight: 0.5,
          opacity: 1,
          color: "black",
          fillOpacity: 0.7
        };
      }
    }
  }

  // Defining a function which will show the province name and the corresponding prevalence value whenever a province is clicked on
  function applyOnEachFeature(feature, layer) {
    for (let i = 0; i < selection.length; i++) {
      if (feature.properties.prov_name_en[0] == selection[i].Province_full) {
        layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${selection[i].Both_sexes}`);
      }
    }
  }

// Replacing the layer with new data when the selection is made to update the map
  myMap.removeLayer(oldLayer)
  d3.json(geoRefUrl).then(function (gData) {
    oldLayer = L.geoJSON(gData, {
      style: style,
      onEachFeature: applyOnEachFeature
    }).addTo(myMap)
  }
  )
}

// Creating map object
var myMap = L.map("map", {
  center: [62.2270, -90.3809],
  zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Creating legend object and defining its position
var legend = L.control({ position: 'bottomright' });

// Creating a new div to add the legend
legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend');
  let ranges = [0, 500, 1000, 2500, 5000, 10000];

// Adding the different boxes 
  for (var i = 0; i < ranges.length; i++) {
    div.innerHTML =
      '<b>Legend</b><br>Prevalence of cancer<br>' +
      '<i style="background-color: #ffffcc"></i>0 - 500<br>' +
      '<i style="background-color: #fdcc8a"></i>501 - 1000<br>' +
      '<i style="background-color: #fc8d59"></i>1001 - 2500<br>' +
      '<i style="background-color: #e34a33"></i>2501 - 5000<br>' +
      '<i style="background-color: #b30000"></i>5001 - 10000<br>' +
      '<i style="background-color: #800000"></i>10001+<br>';
  }
  return div;
};

// Adding legend to the map
legend.addTo(myMap);

// Running the initial function of the default map to be displayed
init()


//////////////////////////////////////////////////////////////////////////////
// numCancerTypes is used to define how many values are presented in the bar chart
const numCancerTypes = 10;
// store unfiltered provincial_data.json into an empty array
// populated by d3.json
var allBarChartData = [];

// load the data
d3.json(geoDataUrl).then(function (data) {
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
  buildComparisonChart(uniqueProvinces[0])
});

// when the selection changes, change the selected province
d3.select("#selProvince").on("change", provinceChanged);

function provinceChanged() {
  // get selected province
  const selectedProvince = d3.select("#selProvince").property("value");
  console.log(selectedProvince);
  // call selectedProvince to the buildChart function
  buildChart(selectedProvince);
  buildComparisonChart(selectedProvince);
}

/**
 * buildChart making a chart
 * buildChart creates a bar chart representing the top 10 Cancer_type of selectedProvince
 * @param {string} selectedProvince - filter through each unique province
 */
function buildChart(selectedProvince) {
  let barChartData = allBarChartData;
  // filter down the data to get the top numCancerTypes for both sexes in the province 
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
    title: `Top ${numCancerTypes} Cancers Found by Province`,
    xaxis: {
      title: {
        text: 'Cancer types'}
      },
      yaxis: {
        title: {
          text: 'Number of people'}
        }
  };
  // plot the barchart 
  Plotly.newPlot("barchart", barData, barLayout);
}

// Creating male vs female comparison chart using chart js
let barChart;
function buildComparisonChart(selectedProvince) {
  let barChartData2 = allBarChartData;

  // filter down the data to get the top numCancerTypes for males and females in the province 
  barChartData2 = barChartData2.filter((obj) => obj.Province == selectedProvince);
  barChartData2 = barChartData2.filter((obj) => obj.Cancer_type !== "All cancers");
  barChartData2 = barChartData2.slice(0, numCancerTypes);

  const xValues = barChartData2.map((obj, index) => index);
  const maleValues = barChartData2.map(obj => obj.Male_2_years);
  const femaleValues = barChartData2.map(obj => obj.Females_2_years);
  const cancerLabels = barChartData2.map(obj => obj.Cancer_type);

  let mychart = document.getElementById("comparisonbarchart").getContext('2d');

  // Assigning the data that will go into the bar chart to datasets using chart js
  data = {
          labels: cancerLabels,
          datasets: [
            {
              label: 'Males',
              data: maleValues,
        },
        {
          label: 'Females',
            data: femaleValues, 
        }
      ]
        }
    
    // Defining the configuration of the plot using chart js
    configuration = {
      type: 'bar',
      data,
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Number of people'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Cancer types'
            }
          },
        },     
        plugins: {
          title: {
              display: true,
              text: 'Comparison of cancer prevalence between males and females'
          }
      }
      }
    }

    // destroying the existing chart before making the new chart
    if (barChart) {
      barChart.destroy();
      barChart = new Chart(mychart, configuration);
    } else {
      barChart = new Chart(mychart, configuration);
    }
}

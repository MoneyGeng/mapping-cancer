let cancerType, province, bothSexesData = [];
var sample = new Array();
var allData = new Array();

// Load the GeoJSON data.
// "geoDatUrl" is defined in the global scope from base.html 

d3.json(geoDataUrl).then(function (data) {
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

var oldLayer;
var newLayer;
function init() {
  function style(feature1) {
    const provinceData = allData.find(d => d.Province_full === feature1.properties.prov_name_en[0]);
    if (!isNaN(provinceData)) {
      console.log(provinceData)
    }
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
    return {
      fillColor: color,
      weight: 0.5,
      opacity: 1,
      color: "black",
      fillOpacity: 0.7
    };
  }

  function applyOnEachFeature(feature, layer) {
    for (let i = 0; i < allData.length; i++) {
      if (feature.properties.prov_name_en[0] == allData[i].Province_full) {
        layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${allData[i].Both_sexes}`);
      }
    }
  }
  // "geoRefUrl" is defined in base.html
  d3.json(geoRefUrl).then(function (gData) {
    oldLayer = L.geoJSON(gData, {
      style: style,
      onEachFeature: applyOnEachFeature
    }).addTo(myMap);
  }
  )
}


let forLegend = []
d3.selectAll("onchange").on("change", optionChanged);

// Defining the optionChanged() function
function optionChanged() {

  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  let selection = allData.filter(prov => prov.Cancer_type == dataset);


  const ontarioValue = selection.find(d => d.Province_full == "Ontario")
  forLegend.push(parseInt(ontarioValue.Both_sexes))
  console.log(forLegend)

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

  function applyOnEachFeature(feature, layer) {
    for (let i = 0; i < selection.length; i++) {
      if (feature.properties.prov_name_en[0] == selection[i].Province_full) {
        layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${selection[i].Both_sexes}`);
      }
    }
  }


  myMap.removeLayer(oldLayer)
  d3.json(geoRefUrl).then(function (gData) {
    oldLayer = L.geoJSON(gData, {
      style: style,
      onEachFeature: applyOnEachFeature
    }).addTo(myMap)
  }
  )
}

// Creating map
var myMap = L.map("map", {
  center: [62.2270, -90.3809],
  zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend');
  let ranges = [0, 500, 1000, 2500, 5000, 10000];


  for (var i = 0; i < ranges.length; i++) {
    div.innerHTML =
      '<b>Legend</b><br>Prevalence of cancer<br>' +
      '<i style="background-color: #ffffcc"></i>0 - 500<br>' +
      '<i style="background-color: #fdcc8a"></i>500 - 1000<br>' +
      '<i style="background-color: #fc8d59"></i>1000 - 2500<br>' +
      '<i style="background-color: #e34a33"></i>2500 - 5000<br>' +
      '<i style="background-color: #b30000"></i>5000 - 10000<br>' +
      '<i style="background-color: #800000"></i>10000+<br>';
  }
  return div;
};
legend.addTo(myMap);
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

let barChart;
function buildComparisonChart(selectedProvince) {
  let barChartData2 = allBarChartData;

  // filter down the data to get the top numCancerTypes for both sexs in the province 
  // a is greater than b if a.Both_sexes > b.Both_sexes
  barChartData2 = barChartData2.filter((obj) => obj.Province == selectedProvince);
  barChartData2 = barChartData2.filter((obj) => obj.Cancer_type !== "All cancers");
  barChartData2 = barChartData2.slice(0, numCancerTypes);

  const xValues = barChartData2.map((obj, index) => index);
  const maleValues = barChartData2.map(obj => obj.Male_2_years);
  const femaleValues = barChartData2.map(obj => obj.Females_2_years);
  const cancerLabels = barChartData2.map(obj => obj.Cancer_type);
console.log(maleValues)
  let mychart = document.getElementById("comparisonbarchart").getContext('2d');

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
    
    configuration = {
      type: 'bar',
      data,
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            ticks: {
              minRotation: 20,
              crossAlign: 'center'
            }
          }
        }
      }
    }

    if (barChart) {
      barChart.destroy();
      barChart = new Chart(mychart, configuration);
    } else {
      barChart = new Chart(mychart, configuration);
    }
}

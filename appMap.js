let cancerType, province, bothSexesData = [];
var sample = new Array();
var allData = new Array();

// Load the GeoJSON data.
let geoData = "Resources/georef-canada-province@public.geojson"

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

  d3.json(geoData).then(function (gData) {
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
  d3.json(geoData).then(function (gData) {
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
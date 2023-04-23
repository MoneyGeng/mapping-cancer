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

// For the initial/default map 
function init() {

      function style(feature1) {
        const provinceData2 = allData.find(d => d.Province_full === feature1.properties.prov_name_en[0]);
        let color = '#cccccc';
          if (provinceData2) {
            const value = parseFloat(provinceData2.Both_sexes);
            if (!isNaN(value)) {
              color = value > 10000 ? '#b30000' :
                      value > 5000 ? '#e34a33' :
                      value > 2500 ? 'fc8d59' :
                      value > 1000 ? '#fdcc8a' :
                      value > 500 ? '#fef0d9' :
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

    function applyOnEachFeature (feature, layer) {
        for (let i = 0; i < allData.length; i++) {
            if (feature.properties.prov_name_en[0] == allData[i].Province_full) {
                layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${allData[i].Both_sexes}`);   
            }
        }
        }

    d3.json(geoData).then(function(gData) {
        L.geoJSON(gData, {
            style: style,
            onEachFeature: applyOnEachFeature
          }).addTo(myMap);
        }
        )
}



d3.selectAll("onchange").on("change", optionChanged);

// Defining the optionChanged() function and updating the map
function optionChanged() {

  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  let selection = allData.filter(prov => prov.Cancer_type == dataset);

console.log(selection);

  function style(feature2) {
    for (let i = 0; i < selection.length; i++) {
        if (dataset == selection[i].Cancer_type) {
            const provinceData2 = selection.find(d => d.Province_full === feature2.properties.prov_name_en[0]);
        let color = '#cccccc';
          if (provinceData2) {
            const value = parseFloat(provinceData2.Both_sexes);
            console.log(value)
            if (!isNaN(value)) {
              color = value > 10000 ? '#b30000' :
                      value > 5000 ? '#e34a33' :
                      value > 2500 ? 'fc8d59' :
                      value > 1000 ? '#fdcc8a' :
                      value > 500 ? '#fef0d9' :
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

function applyOnEachFeature (feature, layer) {
    for (let i = 0; i < allData.length; i++) {
        if (feature.properties.prov_name_en[0] == allData[i].Province_full) {
            layer.bindPopup(`<b>Province: </b> ${feature.properties.prov_name_en[0]} <p> <b> Prevalence: </b> ${allData[i].Both_sexes}`);   
        }
    }
    }

d3.json(geoData).then(function(gData) {
    newLayer = L.geoJSON(gData, {
        style: style,
        onEachFeature: applyOnEachFeature
      }).addTo(myMap)
      //myMap.remove(newLayer)
      //newLayer
    }
    
    )
    
}

// Creating the map object
var myMap = L.map("map", {
    center: [62.2270, -105.3809],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


init()
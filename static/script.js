async function getGeojson(scriptRoot, option) {
    let fetchURL = `${scriptRoot}/geojson/${option}`;
    let response = await fetch(fetchURL);
    let geojson = await response.json();
    return geojson  
}

function getMinMaxValues(geojson) {
    // This will only work for a "FeatureCollection" type geojson
    let valuesArray = [];
    geojson.features.forEach(
        feature => valuesArray.push(feature.properties.value)
    );

    let minVal = Math.min(...valuesArray);  // spread operator
    let maxVal = Math.max(...valuesArray);  // spread operator

    return [minVal, maxVal]
}

function getCmap(geojson) {
    let minMax = getMinMaxValues(geojson);
    let minVal = minMax[0];
    let maxVal = minMax[1];

    let colorArray = ["00FF00","#FFFF00", "#FF0000"];
    let cmap = new ColorMap(minVal, maxVal, colorArray, "hex");
    return cmap
}

function updateColorbar(cmap, title) {
    let nDivisions = 12;
    let colorbarDivID = "colorbar";
    makeColorbar(colorbarDivID, title, nDivisions, cmap);
}

function getCbarTitle(option) {
    // This function is not actually necessary.
    // It will just make it look nicer.
    let titleObj = {
        "density": "Population Density [people/km²]",
        "population": "Population [people]"
    };
    return titleObj[option]
}

function resetMapContainer() {
    let mapContainer = document.getElementById("map_container");
    mapContainer.innerHTML = "";  // clear the previous map
    
    let mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.style.height = "70vh";  // Make sure the map div has a defined height
    mapContainer.appendChild(mapDiv);
}

function createMap() {
    let southAmericaCentroid = [-15.44097926248682, -59.51249722615856];
    let zoomLevel = 3;
    let mapDivID = "map";
    let map = L.map(mapDivID).setView(southAmericaCentroid, zoomLevel);
    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);
    return map;
}


function styleFeature(cmap) {
    let style = function(feature) {
        return {
            fillColor: cmap.getHEX(feature.properties.value),
            weight: 2,
            opacity: 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    return style;
}

function updateMap(geojson, cmap) {
    resetMapContainer();
    let map = createMap();
    let style = styleFeature(cmap);
    L.geoJson(geojson, {"style": style}).addTo(map);
}
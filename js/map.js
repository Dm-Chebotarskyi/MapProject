// Create a map variable
var map;
// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.74135,
            lng: -73.99802
        },
        zoom: 12
    });

    markersVM.createMarkers();
    markersVM.createInfoWindows();
}

function googleError() {
    alert("Can not load Google Maps :(");
}

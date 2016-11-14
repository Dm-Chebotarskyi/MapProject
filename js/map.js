// Create a map variable
var map;
// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.75135,
            lng: -73.99802
        },
        zoom: 13
    });

    markersVM.createMarkers();
    markersVM.createInfoWindows();
}

    // var marker = new google.maps.Marker({
    //     position: singleLatLng,
    //     map: map,
    //     title: "SingleLatLng"
    // })
    //
    // var infoWindow = new google.maps.InfoWindow({
    //     content: "Some text!"
    // })
    //
    // marker.addListener('click', function() {
    //     infoWindow.open(map, marker);
    // })

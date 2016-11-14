/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
var infoWindowContainer = '<div id="iw%id%" class="info-window"><p class="info-header">%text%</p></div>'
var infoWindowContentHTML = '<hr><p><strong>Weather: </strong>%desc%</p><p><strong>Tempreture: </strong>%temp% K</p>';
var infoWindowContentNoWeatherHTML = '<hr><p>Can not recieve weather</p>';
var weatherApiURL = "http://api.openweathermap.org/data/2.5/weather?lat=%lat%&lon=%lng%&APPID=480ec4fe3d04ac1310846cfe61cc0e9c";

var places = [{
    title: "Some place1",
    center: {
        lat: 40.77135,
        lng: -73.99802
    },
}, {
    title: "Another place2",
    center: {
        lat: 40.75135,
        lng: -73.99802
    },
}, {
    title: "Some place3",
    center: {
        lat: 40.7435,
        lng: -73.99802
    },
}, {
    title: "Some place4",
    center: {
        lat: 40.77135,
        lng: -73.96802
    },
}, {
    title: "Another place5",
    center: {
        lat: 40.75135,
        lng: -73.96802
    },
}]

function markersViewModel() {
    var self = this;
    self.places = ko.observableArray(places);
    self.currentFilter = ko.observable(""); // property to store the filter

    self.visiblePlaces = ko.computed(function() {
        if (self.currentFilter() == "")
            return self.places();
        else {
            return ko.utils.arrayFilter(self.places(), function(place) {
                return place.title.indexOf(self.currentFilter()) !== -1;
            });
        }

    });

    self.onPlaceClick = function(item) {
        var index = places.indexOf(item);
        self.infoWindows[index].open(map, self.markers[index]);
        getWeather(item.center, index);
        self.markers.forEach(function(marker) {
            marker.setAnimation(null);
        })
        self.markers[index].setAnimation(google.maps.Animation.BOUNCE);
        var timerId = setTimeout(function() {
            self.markers[index].setAnimation(null);
        }, 3000);
    };
    self.onInputEvent = function(place, event) {
        self.currentFilter(event.target.value);
        self.filterMarkers();
    }
    self.clearFilter = function() {
        self.currentFilter("");
        self.filterMarkers();
    }

    //  ---- MARKERS ----
    self.markers = [];
    self.createMarkers = function() {
        places.forEach(function(place) {
            var marker = new google.maps.Marker({
                position: place.center,
                map: map,
                title: place.title
            });
            self.markers.push(marker);
        });
    };
    self.filterMarkers = function() {
        self.markers.forEach(function(marker) {
            if (marker.title.indexOf(self.currentFilter()) == -1) {
                marker.setMap(null);
            } else marker.setMap(map);
        })
    }

    //  ---- INFO WINDOWS ----
    self.infoWindows = [];
    self.createInfoWindows = function() {
        places.forEach(function(place) {
            var index = places.indexOf(place);
            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContainer.replace("%id%", index)
                                            .replace("%text%", place.title)
            });
            self.markers[index].addListener('click', function() {
                infoWindow.open(map, self.markers[index]);
                getWeather(place.center, index);
            });
            self.infoWindows.push(infoWindow);
        });
    };
}

var markersVM = new markersViewModel();


ko.applyBindings(markersVM);


//NAWIGATION BAR
var navOpened = false;

function moveNav() {
    if (navOpened) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        navOpened = false;
    } else {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        navOpened = true;
    }
}

function getWeather(center, index) {
    var url = weatherApiURL.replace("%lat%", Math.round(parseInt(center.lat))).replace("%lng%", Math.round(parseInt(center.lng)));
    var elem = $('#iw' + index);
    var weather = {
        temp : "no tempreture recieved",
        desc : "no descriprion recieved"
    }
    $.ajax({
        url: url
    }).done(function(data){
        console.log("temp = " + data.main.temp);
        console.log("edsc = " + data.weather[0].discription);
        console.log(infoWindowContentHTML.replace('%temp%', data.main.temp)
                                                    .replace('%desc%', data.weather[0].discription));
        if(elem.children().length < 2)
            elem.append(infoWindowContentHTML.replace('%temp%', data.main.temp)
                                                    .replace('%desc%', data.weather[0].discription))
    }).fail(function() {
        if(elem.children().length < 2)
            elem.append(infoWindowContentNoWeatherHTML);
    });

};

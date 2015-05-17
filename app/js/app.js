/**
* myApp Module
*
* Vincent Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope', function ($scope) {

	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(29.7604, -95.3698),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	/* Setup InputField*/
	var inputDiv = document.getElementById('searchDiv');
	var input = document.getElementById('pac-input');

	// Set InputField inside of Map
	$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputDiv);
	var searchBox = new google.maps.places.SearchBox(input);

	var infoWindow = new google.maps.InfoWindow();
	$scope.map.data.loadGeoJson('js/beats.geojson');

	google.maps.event.addListener(searchBox, 'places_changed', function() {

            // Get Coordinates
            var places = searchBox.getPlaces();

            if (places.length == 0) return;

            // Clear out markers Array
            markers = [];

            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {

                // Set image if important
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Set Marker
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    title: place.name || input.value,
                    position: place.geometry.location
                });

                // Add marker to markers Array
                markers.push(marker);

                // Change bounds of Map to marker
                bounds.extend(place.geometry.location);

                // Add Listener to marker
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow = InfoWindow(marker.title);
                    infoWindow.open($scope.map, marker);

                    // Close Marker after 3 seconds
                    setTimeout(function() {
                        infoWindow.close();
                    }, 3000);
                });
            }

            // Update map's bounds
            $scope.map.fitBounds(bounds);
        });

	///* Setup InfoWindow */
    var InfoWindow = function(content) {
        //Create InfoWindow
        var iWindow = new google.maps.InfoWindow({
            content: 'The title of this marker is ' + content+ 'a maxWidth of 100 and it closes in 3 seconds',
            maxWidth: 100
        });

        return iWindow;
    };
}]);



app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});








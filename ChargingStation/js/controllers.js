var cs = angular.module('app', ['leaflet-directive']);

cs.controller('csCtrl', function ($scope, $http, $log) {
    var markers = [];

    angular.extend($scope, {
        center: {
            lat: 59.8938549,
            lng: 10.7851166,
            zoom: 12
        },
        defaults: {
            scrollWheelZoom: false
        },

        markers: markers,

        events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        }
    });

    var hentLadestasjoner = function(coordinates){
        return $http.jsonp('http://nobil.no/api/server/search.php?callback=JSON_CALLBACK',
            { params: {
                apikey: '17a7a832c2e7bb2b593fbd8f0f68906b',
                apiversion: '3',
                action: "search",
                type: 'rectangle',
                northeast: '(59.943921193288915, 10.826683044433594)',
                southwest: '(59.883683240905256, 10.650901794433594)',
                existingids: '189,195,199,89,48'
            }});
    };

    $scope.$on('leafletDirectiveMap.viewreset', function(event){
        var ladestasjoner = hentLadestasjoner();

        ladestasjoner.success(function (data) {
            $scope.chargerstations = data.chargerstations;
            $.each($scope.chargerstations, function (i, station) {
                var pos = station.csmd.Position;
                pos = pos.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "");
                var latlng = pos.split(',');
                markers.push({
                    lat: parseFloat(latlng[0]),
                    lng: parseFloat(latlng[1]),
                    message: station.csmd.name,
                    focus: true,
                    draggable: false
                });
            });
        });

    });


});
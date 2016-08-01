/* global angular */

angular.module('SASEWebApp')
    .controller('ClientsCtrl', ['Settings', 'RestClient', '$scope', function (Settings, RestClient, $scope) {
        // Rest Clients
        $scope.RestClients = [];

        $scope.Update = function () {
            RestClient.query(function (data) {
                $scope.RestClients = data;
            });
        };
        
        $scope.Update();
    }]);
/* global angular */

angular.module('SASEWebApp')
    .controller('ClientsCtrl', ['Settings', 'RestClient', 'Persistance', '$scope', '$location', function (Settings, RestClient, Persistance, $scope, $location) {
        // Rest Clients
        $scope.RestClients = [];

        $scope.Update = function () {
            RestClient.query(function (data) {
                $scope.RestClients = data;
            });
        };
        
        $scope.onClientSelected = function(RestClient) {
            Settings.LocalMQTTBroker.Host = RestClient['app/host'];
            Settings.LocalMQTTBroker.Port = RestClient['app/broker/http/port'];
            Persistance.saveSettings();

            $location.path('/client/' + RestClient._id);
        };
        
        $scope.Update();
    }]);
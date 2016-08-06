/* global angular */

angular.module('SASEWebApp')
    .controller('LocalCtrl', ['Settings', 'MqttClientFactory', '$scope', function (Settings, MqttClientFactory, $scope) {
        $scope.Title = "Local";
        $scope.Subtitle = "WIFI";
        $scope.Settings = Settings.LocalMQTTBroker;
        $scope.MqttClient = MqttClientFactory.GetClient($scope.Settings);
        $scope.MqttClient.callback = function () {
            try {
                $scope.$apply();
            }
            catch(e) {}
        };
    }]);
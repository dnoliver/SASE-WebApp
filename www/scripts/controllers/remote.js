/* global angular */

angular.module('SASEWebApp')
    .controller('RemoteCtrl', ['Settings', 'MqttClientFactory', '$scope', function (Settings, MqttClientFactory, $scope) {
        $scope.Title = "Remote";
        $scope.Subtitle = "Internet";
        $scope.Settings = Settings.RemoteMQTTBroker;
        $scope.MqttClient = MqttClientFactory.GetClient($scope.Settings);
        $scope.MqttClient.callback = function () {
            try {
                $scope.$apply();
            }
            catch(e) {}
        };
    }]);
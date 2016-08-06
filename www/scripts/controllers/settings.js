/* global angular */

angular.module('SASEWebApp')
    .controller('SettingsCtrl', ['Settings', 'MqttClientFactory', 'Persistance', '$scope', function (Settings, MqttClientFactory, Persistance, $scope) {
        $scope.Settings = Settings;
        $scope.Persistance = Persistance;
        $scope.MqttClientFactory = MqttClientFactory;
    }]);
/* global angular */

angular.module('SASEWebApp')
    .controller('SettingsCtrl', ['Settings', 'Persistance', '$scope', function (Settings, Persistance, $scope) {
        $scope.Settings = Settings;
        $scope.Persistance = Persistance;
    }]);
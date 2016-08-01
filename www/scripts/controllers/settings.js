/* global angular */

angular.module('SASEWebApp')
    .controller('SettingsCtrl', ['Settings', '$scope', function (Settings, $scope) {
        $scope.Settings = Settings;
    }]);
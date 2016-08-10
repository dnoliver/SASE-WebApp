/* global angular */

angular.module('SASEWebApp')
    .controller('NavbarCtrl', ['Settings', '$scope', function (Settings, $scope) {
        $scope.Settings = Settings;
    }]);
/* global angular */

angular.module('SASEWebApp')
    .controller('MainCtrl', ['Persistance', 'Settings', '$scope', function (Persistance, Settings, $scope) {
      var storedSettings = Persistance.getSettings();
      // save current settings
      for(var key in storedSettings) {
        Settings[key] = storedSettings[key];
      }
        
      $scope.Settings = Settings;
    }]);
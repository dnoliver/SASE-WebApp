/* global angular */

angular.module('SASEWebApp')
    .controller('MainCtrl', ['Persistance', 'Settings', function (Persistance, Settings) {
      var storedSettings = Persistance.getSettings();
      // save current settings
      for(var key in storedSettings) {
        Settings[key] = storedSettings[key];
      }
    }]);
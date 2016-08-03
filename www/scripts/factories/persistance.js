/* global angular, MqttClient */

angular.module('SASEWebApp')
    .factory('Persistance', ['Settings', function (Settings) {
        return {
          saveSettings: function () {
            localStorage.setItem('Settings', JSON.stringify(Settings));
          },
          getSettings: function () {
            try {
              return JSON.parse(localStorage.getItem('Settings'));
            } catch (e) {
              return {}
            }
          }
        };
    }]);
angular.module('SASEWebApp')
    .factory('RestClient', ['Settings', '$resource', function (Settings, $resource) {
        var endpoint = Settings.ServiceAPIEndpoint.Host + Settings.ServiceAPIEndpoint.Api;
        
        return $resource(endpoint + '/clients/:id', {
            id: '@_id'
        }, {});
    }]);
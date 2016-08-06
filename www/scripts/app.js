/* global angular */
angular
    .module('SASEWebApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .value('Settings', {
        RemoteMQTTBroker: {
            Host: 'm12.cloudmqtt.com',
            Port: 30017,
            Username: 'cgmjjjtj',
            Password: 'yrI01tLHePFY',
            Ssl: true
        },
        LocalMQTTBroker: {
            Host: '127.0.0.1',
            Port: 8001,
            Username: null,
            Password: null
        },
        ServiceAPIEndpoint: {
            Host: 'https://simplenoderedserver.herokuapp.com',
            Port: null,
            Api: '/api'
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/clients', {
                templateUrl: 'views/clients.html',
                controller: 'ClientsCtrl',
                controllerAs: 'clients'
            })
            .when('/client/:id', {
                templateUrl: 'views/client.html',
                controller: 'ClientCtrl',
                controllerAs: 'client'
            })
            .when('/local', {
                templateUrl: 'views/mqtt.html',
                controller: 'LocalCtrl',
                controllerAs: 'local'
            })
            .when('/remote', {
                templateUrl: 'views/mqtt.html',
                controller: 'RemoteCtrl',
                controllerAs: 'remote'
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl',
                controllerAs: 'settings'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
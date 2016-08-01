/* global angular, MqttClient */

angular.module('SASEWebApp')
    .factory('MqttClientFactory', ['Settings', function (Settings) {
        return {
            MqttClientsPool: {},
            GetClient: function (options, scope) {
                var hasClient = this.MqttClientsPool[options.host];

                if (!hasClient) {
                    var client = new MqttClient({
                        host: options.Host,
                        port: options.Port,
                        username: options.Username || undefined,
                        password: options.Password || undefined,
                        ssl: options.Ssl || undefined
                    });

                    client
                        .on('connecting', function () {
                            console.log('MqttClient', 'connecting');
                            client.Status = 'connecting';
                        })
                        .on('connect', function () {
                            console.log('MqttClient', 'connect');
                            client.Status = 'connected';
                            scope && scope.$apply();
                        })
                        .on('disconnect', function () {
                            console.log('MqttClient', 'disconnect');
                            client.Status = 'disconnect';
                            scope && scope.$apply();
                        })
                        .on('offline', function () {
                            console.log('MqttClient', 'offline');
                            client.Status = 'offline';
                            scope && scope.$apply();
                        })
                        .on('message', function () {
                            console.log('MqttClient', 'message', arguments);
                        })
                        .connect();

                    this.MqttClientsPool[options.host] = client;
                }

                return this.MqttClientsPool[options.host];
            }
        };
    }]);
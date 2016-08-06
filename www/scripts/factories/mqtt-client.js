/* global angular, MqttClient */

angular.module('SASEWebApp')
    .factory('MqttClientWrapper', [function () {
        function MqttClientWrapper(options) {
            this.subscriptions = {};
            this.Status = 'disconnected';
            this.callback = function () {};

            this.client = new MqttClient({
                host: options.Host,
                port: options.Port,
                username: options.Username || undefined,
                password: options.Password || undefined,
                ssl: options.Ssl || undefined
            });

            this.messages = this.client.messages;

            this.client
                .on('connecting', function () {
                    console.log('MqttClient', 'connecting');
                    this.Status = 'connecting';
                }.bind(this))
                .on('connect', function () {
                    console.log('MqttClient', 'connect');
                    this.Status = 'connected';
                    this.callback();
                }.bind(this))
                .on('disconnect', function () {
                    console.log('MqttClient', 'disconnect');
                    this.Status = 'disconnect';
                    //this.callback();
                }.bind(this))
                .on('offline', function () {
                    console.log('MqttClient', 'offline');
                    this.Status = 'offline';
                    //this.callback();
                }.bind(this))
                .on('message', function (topic, payload) {
                    console.log('MqttClient', 'message', arguments);
                    if (this.subscriptions[topic] !== undefined) {
                        this.subscriptions[topic] = payload;
                    }
                    this.callback();
                }.bind(this));
        };

        MqttClientWrapper.prototype.connect = function () {
            this.client.connect();
        };

        MqttClientWrapper.prototype.disconnect = function () {
            this.client.disconnect();
        };

        MqttClientWrapper.prototype.subscribe = function (topic, qos) {
            var self = this;

            if (this.subscriptions[topic] !== undefined) {
                return;
            }

            this.client.subscribe(topic, qos, function (error, granted) {
                if (error) {
                    console.error('MqttClient', 'Error subscribing to', topic, error);
                } else {
                    console.info('MqttClient', 'subscribed to', topic, 'with QoS', qos);
                    self.subscriptions[topic] = null;
                    self.callback();
                }
            });
        };

        MqttClientWrapper.prototype.unsubscribe = function (topic) {
            delete this.subscriptions[topic];
            this.client.unsubscribe(topic);
        };

        MqttClientWrapper.prototype.publish = function (topic, payload, options, callback) {
            this.client.publish(topic, payload, options, callback);
        };
        
        return MqttClientWrapper;
    }])
    .factory('MqttClientFactory', ['Settings', 'MqttClientWrapper', function (Settings, MqttClientWrapper) {
        return {
            MqttClientsPool: {},
            GetClient: function (options) {
                var hasClient = this.MqttClientsPool[options.Host];

                if (!hasClient) {
                    this.MqttClientsPool[options.Host] = new MqttClientWrapper(options);
                }

                return this.MqttClientsPool[options.Host];
            },
            ClearClients: function () {
                for(var host in this.MqttClientsPool) {
                    delete this.MqttClientsPool[host];
                }
            }
        };
    }]);
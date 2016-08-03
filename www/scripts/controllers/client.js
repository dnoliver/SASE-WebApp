/* global angular */

angular.module('SASEWebApp')
    .controller('ClientCtrl', ['Settings', 'MqttClientFactory', 'RestClient', 'Persistance', '$scope', '$routeParams', function (Settings, MqttClientFactory, RestClient, Persistance, $scope, $routeParams) {
        $scope.RestClient = {};
        $scope.MqttClient = null;
        $scope.ConnectionType = 'Local';
        $scope.MqttSubscriptions = {};
        $scope.MqttInChannels = {};

        $scope.Update = function () {
            RestClient.get({
                id: $routeParams.id
            }, function (data) {
                $scope.RestClient = data;
            });
        };

        $scope.Connect = function () {
            var settings = {};

            if ($scope.ConnectionType === 'Local') {
                // update LocalMQTTBroker settings
                Settings.LocalMQTTBroker.Host = $scope.RestClient['app/host'];
                Settings.LocalMQTTBroker.Port = $scope.RestClient['app/broker/http/port'];
                Persistance.saveSettings();
                // use LocalMQTTBroker settings
                settings = Settings.LocalMQTTBroker;
            } else {
                // update RemoteMQTTBroker settings
                settings = Settings.RemoteMQTTBroker;
            }

            $scope.MqttClient = MqttClientFactory.GetClient(settings, $scope);
        };

        $scope.Subscribe = function () {
            var channels = $scope.RestClient['app/channels'] || [];

            channels.forEach(function (channel) {
                if ($scope.ConnectionType === 'Remote') {
                    channel.topic = $scope.RestClient['app/name'] + '/' + channel.topic;
                }

                var topic = channel.topic;
                var qos = channel.qos;
                var direction = channel.direction;

                if (direction === 'out') {
                    $scope.SubscribeToTopic(topic, qos);
                } else if (direction === 'in') {
                    $scope.MqttInChannels[topic] = channel;
                }
            });
        };

        $scope.Unsubscribe = function () {
            for (var topic in $scope.MqttSubscriptions) {
                $scope.MqttClient.unsubscribe(topic);
            }

            $scope.MqttSubscriptions = {};
            $scope.MqttInChannels = {};
        };

        $scope.SubscribeToTopic = function (topic, qos) {
            $scope.MqttClient.subscribe(topic, qos, function (error, granted) {
                if (error) {
                    console.error('MqttClient', 'Error subscribing to', topic, error);
                } else {
                    console.info('MqttClient', 'subscribed to', topic, 'with QoS', qos);
                    $scope.MqttSubscriptions[topic] = null;
                    $scope.$apply();

                    $scope.MqttClient.messages.on(topic, function (payload, details) {
                        $scope.MqttSubscriptions[topic] = payload;
                        $scope.$apply();
                    });
                }
            });
        };

        $scope.PublishToChannel = function (channel) {
            $scope.MqttClient.publish(channel.topic, channel.payload, {}, function () {});
        };

        // Start
        $scope.Update();
    }]);
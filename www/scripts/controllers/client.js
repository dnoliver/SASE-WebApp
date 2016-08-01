/* global angular */

angular.module('SASEWebApp')
    .controller('ClientCtrl', ['Settings', 'MqttClientFactory', 'RestClient', '$scope', '$routeParams', function (Settings, MqttClientFactory, RestClient, $scope, $routeParams) {
        $scope.RestClient = {};
        $scope.MqttClient = null;
        $scope.MqttSubscriptions = {};
        $scope.MqttInChannels = {};
        
        RestClient.get({
            id: $routeParams.id
        }, function (data) {
            $scope.RestClient = data;

            $scope.MqttClient = MqttClientFactory.GetClient({
                Host: $scope.RestClient['app/host'],
                Port: $scope.RestClient['app/broker/http/port']
            }, $scope);
        });

        $scope.Subscribe = function () {
            var channels = $scope.RestClient['app/channels'] || [];

            channels.forEach(function (channel) {
                var topic = channel.topic;
                var qos = channel.qos;
                var direction = channel.direction;

                if (direction === 'out') {
                    $scope.SubscribeToTopic(topic, qos);
                }
                else if(direction === 'in') {
                    $scope.MqttInChannels[topic] = channel;
                }
            });
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
    }]);
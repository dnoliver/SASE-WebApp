/* global angular */

angular.module('SASEWebApp')
    .controller('LocalCtrl', ['Settings', 'MqttClientFactory', '$scope', function (Settings, MqttClientFactory, $scope) {
        var self = this;

        $scope.Settings = Settings;
        $scope.MqttClientFactory = MqttClientFactory;
        $scope.MqttClient = {};
        $scope.MqttSubscriptions = {};
        $scope.MqttSubscription = {
            topic: 'test',
            qos: 0
        };
        $scope.MqttPublication = {
            topic: 'test',
            qos: 0
        };

        $scope.Connect = function () {
            $scope.MqttClient = MqttClientFactory.GetClient(Settings.LocalMQTTBroker, $scope);
        };

        $scope.Subscribe = function () {
            var topic = $scope.MqttSubscription.topic,
                qos = $scope.MqttSubscription.qos;

            $scope.MqttClient.subscribe(topic, qos, function (error, granted) {
                if (error) {
                    console.error('MqttClient', 'Error subscribing to test', error);
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

        $scope.Publish = function () {
            $scope.MqttClient.publish($scope.MqttPublication.topic, $scope.MqttPublication.payload, {}, function () {});
        }
    }]);
/* global angular */

angular.module('SASEWebApp')
    .controller('ClientCtrl', ['Settings', 'MqttClientFactory', 'RestClient', 'Persistance', '$scope', '$routeParams', function (Settings, MqttClientFactory, RestClient, Persistance, $scope, $routeParams) {
        $scope.RestClient = {};
        $scope.Settings = Settings.RemoteMQTTBroker;
        $scope.EnableRemoteConnection = Settings.EnableRemoteConnection;
        $scope.ConnectionType = 'Local';
        $scope.MqttInChannels = {};
        $scope.MqttClient = MqttClientFactory.GetClient($scope.Settings);

        $scope.callback = function () {
            try {
                $scope.$apply();
            } catch (e) {}
        };

        $scope.MqttClient.callback = $scope.callback;

        $scope.$watch('ConnectionType', function (newVal, oldVal) {
            switch (newVal) {
            case 'Remote':
                $scope.Settings = Settings.RemoteMQTTBroker;
                break;
            case 'Local':
                $scope.Settings = Settings.LocalMQTTBroker;
                break;
            }

            $scope.Unsubscribe();
            $scope.MqttClient = MqttClientFactory.GetClient($scope.Settings);
            $scope.MqttClient.callback = $scope.callback;
        });

        $scope.Update = function () {
            RestClient.get({
                id: $routeParams.id
            }, function (data) {
                $scope.RestClient = data;
            });
        };

        $scope.Subscribe = function () {
            var channels = $scope.RestClient['app/channels'] || [];

            channels.forEach(function (channel) {
                var topic = channel.topic;
                var qos = channel.qos;
                var direction = channel.direction;
                
                if ($scope.ConnectionType === 'Remote') {
                    var remoteTopicPrefix = $scope.RestClient['app/name'] + '/';
                    // check if the topic is a remote topic
                    if(topic.indexOf(remoteTopicPrefix) !== 0) {
                        topic = remoteTopicPrefix + topic;
                    }
                }

                if (direction === 'out') {
                    $scope.MqttClient.subscribe(topic, qos);
                } else if (direction === 'in') {
                    $scope.MqttInChannels[topic] = {
                        topic: topic,
                        qos: qos,
                        direction: direction,
                        payload: null
                    };
                }
            });
        };

        $scope.Unsubscribe = function () {
            for (var topic in $scope.MqttClient.subscriptions) {
                $scope.MqttClient.unsubscribe(topic);
            }

            $scope.MqttInChannels = {};
        };

        // Start
        $scope.Update();
    }]);
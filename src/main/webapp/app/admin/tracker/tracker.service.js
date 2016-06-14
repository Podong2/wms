(function() {
    'use strict';
    /* globals SockJS, Stomp */

    angular
        .module('wmsApp')
        .factory('JhiTrackerService', JhiTrackerService);

    JhiTrackerService.$inject = ['$rootScope', '$window', '$cookies', '$http', '$q'];

    function JhiTrackerService ($rootScope, $window, $cookies, $http, $q) {
        var stompClient = null;
        var subscriber = null;
        var listener = $q.defer();
        var connected = $q.defer();
        var alreadyConnectedOnce = false;

        var service = {
            connect: connect,
            disconnect: disconnect,
            receive: receive,
            sendActivity: sendActivity,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;

        function connect () {
            //building absolute path so that websocket doesnt fail when deploying with a context path
            var loc = $window.location;
            var url = '//' + loc.host + loc.pathname + 'websocket/tracker';
            var socket = new SockJS(url);
            stompClient = Stomp.over(socket); // 해당 url의 웹소켓에 접속한다.
            var stateChangeStart;
            var headers = {};
            headers['X-CSRF-TOKEN'] = $cookies[$http.defaults.xsrfCookieName];
            stompClient.connect(headers, function() { //연결
                connected.resolve('success'); // 연결 성공 시
                sendActivity();
                if (!alreadyConnectedOnce) { // 이전에 연결된 정보가 없을 시 연결상태를 설정한다?
                    stateChangeStart = $rootScope.$on('$stateChangeStart', function () {
                        sendActivity();
                    });
                    alreadyConnectedOnce = true; // 한번 연결했다는 true 값으로 변경
                }
            });
            $rootScope.$on('$destroy', function () {
                if(angular.isDefined(stateChangeStart) && stateChangeStart !== null){
                    stateChangeStart();
                }
            });
        }

        function disconnect () {
            if (stompClient !== null) {
                stompClient.disconnect();
                stompClient = null;
            }
        }

        function receive () {
            return listener.promise;
        }

        function sendActivity() {
            if (stompClient !== null && stompClient.connected) {
                stompClient
                    .send('/topic/activity',
                    {},
                    angular.toJson({'page': $rootScope.toState.name}));
            }
        }

        function subscribe () {
            connected.promise.then(function() {
                subscriber = stompClient.subscribe('/topic/tracker', function(data) {
                    listener.notify(angular.fromJson(data.body));
                });
            }, null, null);
        }

        function unsubscribe () {
            if (subscriber !== null) {
                subscriber.unsubscribe();
            }
            listener = $q.defer();
        }
    }
})();

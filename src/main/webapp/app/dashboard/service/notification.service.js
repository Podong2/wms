(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Notification', Notification)
        .factory('UnreadCount', UnreadCount)
        .factory('ReadUpload', ReadUpload);

    Notification.$inject = ['$resource'];
    UnreadCount.$inject = ['$resource'];
    ReadUpload.$inject = ['$q', '$log', '$http'];

    function Notification ($resource) {
        var resourceUrl =  'api/notifications/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }

    function UnreadCount ($resource) {
        var resourceUrl =  'api/notifications/getUnreadCount';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        var notification =  {
                            count : data
                        }
                        data = angular.fromJson(notification);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
    function ReadUpload($q, $log, $http){
        var service = {
            put : put
        }
        return service;

        function put(){
            var deferred = $q.defer();
            $log.debug("task 싱글 업로드 data : ", parameter)
            $http.put( '/api/notifications', {}, {params : parameter}).then(function (result) {
                $log.debug("taskList : ", result);
                deferred.resolve(result);
            });
            return deferred.promise;
        }

    }


})();

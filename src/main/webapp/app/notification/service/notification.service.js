(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Notification', Notification)
        .factory('UnreadCount', UnreadCount);

    Notification.$inject = ['$resource'];
    UnreadCount.$inject = ['$resource'];

    function Notification ($resource) {
        var resourceUrl =  'api/notifications';

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

})();

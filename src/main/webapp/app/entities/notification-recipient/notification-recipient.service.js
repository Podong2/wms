(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('NotificationRecipient', NotificationRecipient);

    NotificationRecipient.$inject = ['$resource'];

    function NotificationRecipient ($resource) {
        var resourceUrl =  'api/notification-recipients/:id';

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
})();

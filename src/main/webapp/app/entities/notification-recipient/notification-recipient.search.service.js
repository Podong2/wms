(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('NotificationRecipientSearch', NotificationRecipientSearch);

    NotificationRecipientSearch.$inject = ['$resource'];

    function NotificationRecipientSearch($resource) {
        var resourceUrl =  'api/_search/notification-recipients/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

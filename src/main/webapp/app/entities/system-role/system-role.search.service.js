(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('SystemRoleSearch', SystemRoleSearch);

    SystemRoleSearch.$inject = ['$resource'];

    function SystemRoleSearch($resource) {
        var resourceUrl =  'api/_search/system-roles/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

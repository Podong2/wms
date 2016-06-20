(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('SystemRoleUserSearch', SystemRoleUserSearch);

    SystemRoleUserSearch.$inject = ['$resource'];

    function SystemRoleUserSearch($resource) {
        var resourceUrl =  'api/_search/system-role-users/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

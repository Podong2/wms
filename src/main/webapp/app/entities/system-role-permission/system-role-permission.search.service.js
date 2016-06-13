(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('SystemRolePermissionSearch', SystemRolePermissionSearch);

    SystemRolePermissionSearch.$inject = ['$resource'];

    function SystemRolePermissionSearch($resource) {
        var resourceUrl =  'api/_search/system-role-permissions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

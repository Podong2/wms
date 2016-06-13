(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('PermissionSearch', PermissionSearch);

    PermissionSearch.$inject = ['$resource'];

    function PermissionSearch($resource) {
        var resourceUrl =  'api/_search/permissions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

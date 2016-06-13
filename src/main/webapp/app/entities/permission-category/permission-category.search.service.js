(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('PermissionCategorySearch', PermissionCategorySearch);

    PermissionCategorySearch.$inject = ['$resource'];

    function PermissionCategorySearch($resource) {
        var resourceUrl =  'api/_search/permission-categories/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

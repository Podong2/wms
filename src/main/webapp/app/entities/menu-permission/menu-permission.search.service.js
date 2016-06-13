(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('MenuPermissionSearch', MenuPermissionSearch);

    MenuPermissionSearch.$inject = ['$resource'];

    function MenuPermissionSearch($resource) {
        var resourceUrl =  'api/_search/menu-permissions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

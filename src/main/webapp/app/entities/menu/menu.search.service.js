(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('MenuSearch', MenuSearch);

    MenuSearch.$inject = ['$resource'];

    function MenuSearch($resource) {
        var resourceUrl =  'api/_search/menus/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

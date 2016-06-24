(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('CodeSearch', CodeSearch);

    CodeSearch.$inject = ['$resource'];

    function CodeSearch($resource) {
        var resourceUrl =  'api/_search/codes/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

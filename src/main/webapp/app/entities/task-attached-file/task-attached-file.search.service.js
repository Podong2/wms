(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('TaskAttachedFileSearch', TaskAttachedFileSearch);

    TaskAttachedFileSearch.$inject = ['$resource'];

    function TaskAttachedFileSearch($resource) {
        var resourceUrl =  'api/_search/task-attached-files/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

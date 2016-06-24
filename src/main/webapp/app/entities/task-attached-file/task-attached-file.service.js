(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('TaskAttachedFile', TaskAttachedFile);

    TaskAttachedFile.$inject = ['$resource'];

    function TaskAttachedFile ($resource) {
        var resourceUrl =  'api/task-attached-files/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();

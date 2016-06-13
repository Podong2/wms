(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('PermissionCategory', PermissionCategory);

    PermissionCategory.$inject = ['$resource'];

    function PermissionCategory ($resource) {
        var resourceUrl =  'api/permission-categories/:id';

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

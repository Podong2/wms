(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('SystemRolePermission', SystemRolePermission);

    SystemRolePermission.$inject = ['$resource'];

    function SystemRolePermission ($resource) {
        var resourceUrl =  'api/system-role-permissions/:id';

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

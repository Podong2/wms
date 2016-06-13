(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('SystemRoleUser', SystemRoleUser);

    SystemRoleUser.$inject = ['$resource'];

    function SystemRoleUser ($resource) {
        var resourceUrl =  'api/system-role-users/:id';

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

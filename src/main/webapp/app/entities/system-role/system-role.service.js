(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('SystemRole', SystemRole);

    SystemRole.$inject = ['$resource'];

    function SystemRole ($resource) {
        var resourceUrl =  'api/system-roles/:id';

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

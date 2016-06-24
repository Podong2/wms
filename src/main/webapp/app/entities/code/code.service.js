(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Code', Code);

    Code.$inject = ['$resource'];

    function Code ($resource) {
        var resourceUrl =  'api/codes/:id';

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

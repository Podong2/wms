(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Code', Code)
        .factory('FIndCode', FIndCode);

    Code.$inject = ['$resource'];
    FIndCode.$inject = ['$http', '$log', '$rootScope', '$q'];

    function Code ($resource) {
        var resourceUrl =  'api/codes/findByCodeType';

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

    // 메뉴 권한
    function FIndCode ($http, $log, $rootScope, $q) {
        var service = {
            findByCodeType : findByCodeType
        }
        return service;

        function findByCodeType(codeType){
            var deferred = $q.defer();
            var code = [];
            $http({
                url :'/api/codes/findByCodeType',
                params : {codeType : codeType}
            }).success(function (result) {
                $rootScope.severity = result;
                deferred.resolve(result);
                $log.debug("$rootScope.severity : ", $rootScope.severity);
            });
            return deferred.promise;
        }

    }
})();

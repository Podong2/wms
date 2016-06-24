(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('MenuPermission', MenuPermission)
        .factory('PagePermission', PagePermission);

    MenuPermission.$inject = ['$resource'];
    PagePermission.$inject = ['$http', '$log', '$rootScope'];

    function MenuPermission ($resource) {
        var resourceUrl =  'api/menu-permissions/:id';

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
    function PagePermission ($http, $log, $rootScope) {
        var service = {
            getPagePermission : getPagePermission
        }
        return service;

        function getPagePermission(permissionName){
            $http({
                url :'/api/permissions/menu-permissions',
                params : {urlPath : permissionName}
            }).success(function (permission) {
                $rootScope.pagePermission = {};
                angular.forEach(permission, function (permission, index) {
                    $rootScope.pagePermission[permission.action] = permission.activeYn;
                });
                $log.debug("$rootScope.pagePermission : ", $rootScope.pagePermission)
            });
        }
    }
})();

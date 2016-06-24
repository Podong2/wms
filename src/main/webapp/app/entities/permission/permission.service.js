    'use strict';
    angular
        .module('wmsApp')
        .factory('Permission', Permission)
        .factory('UserPermission', UserPermission)
        .factory('permissionCheck', permissionCheck);


    Permission.$inject = ['$resource'];
    UserPermission.$inject = ['$http', '$log', '$rootScope', '$q'];
    permissionCheck.$inject = ['$log', '$rootScope'];

    function Permission ($resource) {
        var resourceUrl =  'api/permissions/:id';

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

    // 자기 자신의 권한
    function UserPermission ($http, $log, $rootScope, $q) {
        var service = {
            getUserPermission : getUserPermission,
        }
        return service;

        function getUserPermission(){
            var deferred = $q.defer();
            $http.get('/api/permissions/user-permissions').success(function (response) {
                $rootScope.authorities = {};

                angular.forEach(response, function (permission, index) {
                    $rootScope.authorities[permission.action] = permission.activeYn;
                });
                $log.debug("$rootScope.authorities : ", $rootScope.authorities)
                deferred.resolve(response);
            });
            return deferred.promise;
        }
    }

    // 권한 체크
    function permissionCheck($log, $rootScope) {
        return {
            check : function(actionUrl){
                if ($rootScope.authorities[actionUrl] !== undefined) {
                    return $rootScope.authorities[actionUrl];
                }
                else {
                    return false;
                }
            },
            pagePermissionCheck : function(actionUrl){
                if ($rootScope.pagePermission[actionUrl] !== undefined) {
                    return $rootScope.pagePermission[actionUrl];
                }
                else {
                    return false;
                }
            }
        }

    }




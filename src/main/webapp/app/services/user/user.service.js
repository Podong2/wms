(function () {
    'use strict';

    angular
        .module('wmsApp')
        .factory('User', User)
        .factory('findUser', findUser);

    User.$inject = ['$resource'];
    findUser.$inject = ['$http', '$log', '$q'];

    function User ($resource) {
        var service = $resource('api/users/:login', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': { method:'POST' },
            'update': { method:'PUT' },
            'delete':{ method:'DELETE'}
        });

        return service;
    }

    function findUser($http, $log, $q){
        var service = {
            findByName : findByName
            , findByNameAndExcludeIds : findByNameAndExcludeIds
            , findByProjectMemberAndExcludeIds : findByProjectMemberAndExcludeIds
        }
        return service;

        function findByName(name){
            var deferred = $q.defer();
            $http({
                url :'/api/users/findByName',
                params : {name : name}
            }).success(function (result) {
                deferred.resolve(result);
                $log.debug("find by Users : ", result);
            });
            return deferred.promise;
        }

        function findByNameAndExcludeIds(name, excludeIds){
            var deferred = $q.defer();
            $http({
                url :'/api/users/findByNameAndEntityId',
                params : {name : name, excludeIds : excludeIds}
            }).success(function (result) {
                deferred.resolve(result);
                $log.debug("find by Tasks : ", result);
            });
            return deferred.promise;
        }

        function findByProjectMemberAndExcludeIds(name, projectId, excludeIds){
            var deferred = $q.defer();
            $http({
                url :'/api/users/findProjectMember',
                params : {name : name, projectId : projectId, excludeIds : excludeIds}
            }).success(function (result) {
                deferred.resolve(result);
                $log.debug("find by project members : ", result);
            });
            return deferred.promise;
        }
    }
})();

(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Task', Task)
        .factory('TaskListSearch', TaskListSearch);

    Task.$inject = ['$resource'];
    TaskListSearch.$inject = ['$http', '$log'];

    function Task ($resource) {
        var resourceUrl =  'api/tasks/:id';

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

    function TaskListSearch($http, $log){
        var service = {
            findTaskList : findTaskList
        }
        return service;

        function findTaskList(searchData){
            $log.debug("task 검색 data : ", searchData)
            return $http.get( '/api/tasks', {
                params : searchData
            } ).then(function (result) {
                $log.debug("taskList : ", result);
                return result;
            });
        }

    }
})();

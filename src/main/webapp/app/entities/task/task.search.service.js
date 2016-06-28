(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('TaskSearch', TaskSearch)
        .factory('TaskListSearch', TaskListSearch);

    TaskSearch.$inject = ['$resource'];
    TaskListSearch.$inject = ['$http', '$log'];

    function TaskSearch($resource) {
        var resourceUrl =  'api/_search/tasks/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }

    // 타스크 목록 검색
    function TaskListSearch($http, $log){
        var service = {
            findTaskList : findTaskList,
            TaskFindSimilar : TaskFindSimilar
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

        function TaskFindSimilar(name){
            $log.debug("task 검색 data : ", name)
            return $http.get( '/api/tasks', {
                params : {
                    name : name
                }
            } ).then(function (result) {
                $log.debug("taskList : ", result);
                return result;
            });
        }
    }


})();

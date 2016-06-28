(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Task', Task)
        .factory('TaskEdit', TaskEdit);

    Task.$inject = ['$resource'];
    TaskEdit.$inject = ['$log', '$upload'];

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

    function TaskEdit($log, $upload){
        var service = {
            addTask : addTask
        }
        return service;

        function addTask(parameter){
            parameter.url = "api/tasks";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 자료실 생성 결과 : ", response);
                return response;
            });
        }
    }

})();

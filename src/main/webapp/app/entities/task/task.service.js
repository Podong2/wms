(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Task', Task)
        .factory('SubTask', SubTask)
        .factory('TaskRemove', TaskRemove)
        .factory('TaskEdit', TaskEdit);

    Task.$inject = ['$resource'];
    SubTask.$inject = ['$resource'];
    TaskRemove.$inject = ['$resource'];
    TaskEdit.$inject = ['$log', '$upload', '$http', '$q'];

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

    function SubTask ($resource) {
        var resourceUrl =  'api/tasks/createSubTask/:id';

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

    function TaskRemove ($resource) {
        var resourceUrl =  'api/tasks?targetIds=:targetIds';

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

    function TaskEdit($log, $upload, $http, $q){
        var service = {
            addTask : addTask,
            uploadTask : uploadTask,
            singleUpload : singleUpload
        }
        return service;

        function addTask(parameter){
            parameter.url = "api/tasks";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 자료실 생성 결과 : ", response);
                return response;
            });
        }

        function uploadTask(parameter){
            parameter.url = "api/tasks/update";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 자료실 수정 결과 : ", response);
                return response;
            });
        }
        function singleUpload(parameter){
            var deferred = $q.defer();
            $log.debug("task 싱글 업로드 data : ", parameter)
            $http.put( '/api/tasks', {}, {params : parameter}).then(function (result) {
                $log.debug("taskList : ", result);
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }

})();

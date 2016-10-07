(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Task', Task)
        .factory('SubTask', SubTask)
        .factory('FindTasks', FindTasks)
        .factory('TaskRemove', TaskRemove)
        .factory('TaskEdit', TaskEdit);

    Task.$inject = ['$resource'];
    SubTask.$inject = ['$resource'];
    FindTasks.$inject = ['$http', '$log', '$q'];
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

    function FindTasks($http, $log, $q){
        var service = {
            findByName : findByName
        }
        return service;

        function findByName(name){
            var deferred = $q.defer();
            $http({
                url :'/api/tasks/findByName',
                params : {name : name}
            }).success(function (result) {
                deferred.resolve(result);
                $log.debug("find by Tasks : ", result);
            });
            return deferred.promise;
        }
    }

    function TaskEdit($log, $upload, $http, $q){
        var service = {
            addTask : addTask,
            uploadTask : uploadTask,
            saveTask : saveTask,
            singleUpload : singleUpload,
            createComment : createComment
        }
        return service;

        function addTask(parameter){
            parameter.url = "api/tasks";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("타스크 생성 결과 : ", response);
                return response;
            });
        }

        function uploadTask(parameter){
            parameter.url = "api/tasks/update";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("타스크 수정 결과 : ", response);
                return response;
            });
        }

        function saveTask(parameter){
            parameter.url = "api/tasks/save";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("타스크 생성 결과 : ", response);
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

        function createComment(parameter){
            parameter.url = "api/trace-log";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("타스크 코멘트 생성 결과 : ", response);
                return response;
            });
        }
    }

})();

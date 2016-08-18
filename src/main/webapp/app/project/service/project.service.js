(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Project', Project)
        .factory('ProjectEdit', ProjectEdit);

    Project.$inject = ['$resource'];
    ProjectEdit.$inject = ['$log', '$upload', '$http', '$q'];

    function Project ($resource) {
        var resourceUrl =  'api/projects/:id';

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


    function ProjectEdit($log, $upload, $http, $q){
        var service = {
            addProject : addProject,
            uploadProject : uploadProject,
            singleUpload : singleUpload,
            createComment : createComment
        }
        return service;

        function addProject(parameter){
            parameter.url = "api/projects";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 생성 결과 : ", response);
                return response;
            });
        }

        function uploadProject(parameter){
            parameter.url = "api/projects/update";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 수정 결과 : ", response);
                return response;
            });
        }
        function singleUpload(parameter){
            var deferred = $q.defer();
            $log.debug("Project 싱글 업로드 data : ", parameter)
            $http.put( '/api/projects', {}, {params : parameter}).then(function (result) {
                $log.debug("ProjectList : ", result);
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function createComment(parameter){
            parameter.url = "api/trace-log";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 코멘트 생성 결과 : ", response);
                return response;
            });
        }
    }

})();

(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Project', Project)
        .factory('ProjectInfo', ProjectInfo)
        .factory('ProjectFind', ProjectFind)
        .factory('ProjectFindByName', ProjectFindByName)
        .factory('ProjectAttachedList', ProjectAttachedList)
        .factory('ProjectEdit', ProjectEdit)
        .factory('DeleteAttachedFile', DeleteAttachedFile)
        .factory('ProjectList', ProjectList);

    Project.$inject = ['$resource'];
    ProjectInfo.$inject = ['$resource'];
    ProjectFind.$inject = ['$resource'];
    ProjectFindByName.$inject = ['$resource'];
    ProjectAttachedList.$inject = ['$resource'];
    DeleteAttachedFile.$inject = ['$resource'];
    ProjectList.$inject = ['$resource'];
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

    function ProjectInfo ($resource) {
        var resourceUrl =  'api/projects/findManagedTasks:id';

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

    function ProjectFind ($resource) {
        var resourceUrl =  'api/projects/findByName:id';

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

    function ProjectAttachedList ($resource) {
        var resourceUrl =  'api/projects/findManagedAttachedFiles/:id';

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
    function ProjectFindByName ($resource) {
        var resourceUrl =  'api/projects/findByName';

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
    function ProjectList($resource) {
        var resourceUrl =  'api/projects/statistics';

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
            createComment : createComment,
            createProjectFiles : createProjectFiles,
            deleteAttachedFile : deleteAttachedFile
        };
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

        function createProjectFiles(parameter){
            parameter.url = "api/projects/addProjectSharedAttachedFile";
            return $upload.upload(parameter).then(function (response) {
                $log.debug("프로젝트 파일 생성 결과 : ", response);
                return response;
            });
        }

        function deleteAttachedFile(parameter){
            var deferred = $q.defer();
            $log.debug("Project 파일 삭제 data : ", parameter)
            $http.delete( 'api/projects/removeManagedAttachedFiles', {}, {entityName : parameter.entityName, entityId : parameter.entityId, attachedFileId : parameter.attachedFileId}).then(function (result) {
                $log.debug("ProjectList : ", result);
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }

    function DeleteAttachedFile ($resource) {
        var resourceUrl =  'api/projects/removeManagedAttachedFiles';

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

})();

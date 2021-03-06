/**
 * Created by Jeong on 2016-03-16.
 */
(function() {
'use strict';

angular.module('wmsApp')
    .controller("projectCtrl", projectCtrl);
projectCtrl.$inject=['$scope', 'Code', '$log', 'toastr', '$state', '$timeout', 'Project', '$rootScope'];
        function projectCtrl($scope, Code, $log, toastr, $state, $timeout, Project, $rootScope) {
            var vm = this;
            vm.projectAddOpen = false;

            vm.codes = Code.query();

            /* project info */
            vm.project = {
                name : '',
                id : '',
                folderYn : false
            };
            vm.projectList=[];

            $rootScope.$on('projectReloading', function(){
                getList();
            });

            function getList(){
                Project.query({}, onSuccess, onError);
            }

            function onSuccess (result) {
                vm.projectList = [];

                vm.projectList = result;
                $rootScope.$broadcast('projectListLoading');
                $log.debug("vm.projectList : ", vm.projectList);
            }
            function onError (result) {
                //toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
            }
            getList();
        }
})();


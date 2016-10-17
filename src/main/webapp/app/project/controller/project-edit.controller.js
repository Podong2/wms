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
            vm.saveProject = saveProject;
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
                vm.projectList = result;
                $rootScope.$broadcast('projectListLoading')
                $log.debug("vm.projectList : ", vm.projectList);
            }
            function onError (result) {
                //toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
            }
            getList();

            function saveProject(){
                $log.debug("세이브")
                if(vm.project.name != '') Project.save(vm.project, onSaveSuccess, onSaveError);
            }

            function onSaveSuccess (result) {
                $log.debug("프로젝트 생성 결과 : ", result);
                toastr.success('프로젝트 생성 완료', '프로젝트 생성 완료');
                $rootScope.$broadcast("projectAddClose");
                vm.project.name = '';
                Project.query({}, onSuccess, onError);
                $state.go("my-project", {id : result.id});
            }


            function onSaveError () {
            }



            function userIdPush(userInfo, type){

                var typeIds = new Array();

                angular.forEach(userInfo, function(val){
                    typeIds.push(val.id);
                });

                vm.task[type] = typeIds.join(",");
            }


        }
})();


/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectFunctionsCtrl", projectFunctionsCtrl);
projectFunctionsCtrl.$inject=['$state', '$stateParams', '$log', '$scope', '$timeout'];
        function projectFunctionsCtrl($state, $stateParams, $log, $scope, $timeout) {
            var vm = this;
            $log.debug("function $stateParams : ", $stateParams);
            vm.projectId = $stateParams.projectId;
            vm.project = $stateParams.project;
            if(vm.project != null && vm.project != undefined && vm.project.name != undefined && vm.project.name != ''){
                localStorage.setItem("projectInfo", JSON.stringify({
                    project : vm.project,
                }));
            }
            if($stateParams.project.id == undefined){
                var projectInfo = localStorage.getItem("projectInfo");
                if (angular.isDefined(projectInfo) && projectInfo != null) {
                    projectInfo = JSON.parse(projectInfo);
                    vm.project = projectInfo.project;
                }
            }

            vm.stateInfo = $state.current.name;
            vm.state = $state.get(vm.stateInfo);

            vm.getStateName = getStateName;
            function getStateName(){
                $timeout(function(){
                    vm.stateInfo = $state.current.name;
                    vm.state = $state.get(vm.stateInfo);
                },500)

            }

        }

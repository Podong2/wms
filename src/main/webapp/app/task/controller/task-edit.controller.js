/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskEditCtrl", taskEditCtrl);
taskEditCtrl.$inject=['$scope', '$uibModalInstance', 'Code', '$log', 'Task', 'toastr', '$state', '$timeout', 'DateUtils', 'SubTask', 'Principal', 'findUser', '$q', 'TaskEdit', 'FindTasks'];
        function taskEditCtrl($scope, $uibModalInstance, Code, $log, Task, toastr, $state, $timeout, DateUtils, SubTask, Principal, findUser, $q, TaskEdit, FindTasks) {
            var vm = this;
            vm.save = save;
            vm.subTaskSave = subTaskSave;
            vm.openCalendar = openCalendar;
            vm.ok = ok;
            vm.cancel = cancel;
            vm.autoValueInit = autoValueInit;
            vm.taskUpload = taskUpload;
            vm.userInfo = Principal.getIdentity();

            vm.codes = Code.query();

            /* user picker info */
            $scope.assigneeUser = [];
            $scope.watchers = [];
            $scope.relatedTaskList = [];

            /* task info */
            vm.task = {
                name : '',
                id : '',
                startDate : '',
                endDate : '',
                contents : '',
                statusId : '', //상태
                importantYn : false, //중요여부
                assigneeIds : [],
                watcherIds : [],
                relatedTaskIds : []

            };

            vm.subTaskOpen = false;
            vm.fileAreaOpen = false;
            vm.relatedTaskOpen = false;

            /* sub task info */
            vm.subTask = {
                name : '',
                parentId : '',
                assigneeId : 3,
                statusId : 1
            };

            // min date picker
            this.dueDateFrom = {
                date: "",
                datepickerOptions: {
                    maxDate: null
                }
            };
            // max date picker
            this.dueDateTo = {
                date: "",
                datepickerOptions: {
                    minDate: null
                }
            };

            $log.debug("vm.codes : ", vm.codes);
            $log.debug("vm.vm.userInfo : ", vm.userInfo);

            $scope.files = [];
            // 파일 목록 라이브러리에서 가져오기
            $scope.$on('setFiles', function (event, args) {
                $scope.files = [];
                angular.forEach(args, function(value){
                    $scope.files.push(value)
                });
                $log.debug("파일 목록 : ", $scope.files);
            });

            // date 포멧 변경
            $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.startDate= formatDate;
                }

            });
            // date 포멧 변경
            $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.endDate = formatDate;
                }
            });

            // 달력 오픈
            function openCalendar(e, picker) {
                vm[picker].open = true;
            }

            //  전송
            function ok () {

            }

            //  닫기
            function cancel () {
                $uibModalInstance.close();
            }

            /* task 명 만으로 저장 */
            function save(){
                if(vm.task.name != '') Task.save(vm.task, onSaveSuccess, onSaveError);
            }

            /* 타스크의 서브타스크 등록 */
            function subTaskSave(){
                if(vm.subTask.name != '') SubTask.save(vm.subTask, onSubTaskSaveSuccess, onSaveError);
            }

            function onSaveSuccess (result) {
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                vm.task.id = result.id;
                vm.subTask.parentId = result.id;
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
            }

            vm.subTaskList = [];
            function onSubTaskSaveSuccess (result) {
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                vm.subTaskList.push(result);
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
            }

            function onSaveError () {
            }

            // auto-complate : 다중사용자 모드 변경시 tags 값 초기화
            vm.autoType = false;
            function autoValueInit(){
                $scope.tags =[];
            }

            /* user picker */
            $scope.findUsers = function(name) {
                $log.debug("name - : ", name);
                var deferred = $q.defer();
                findUser.findByName(name).then(function(result){
                    deferred.resolve(result);
                    $log.debug("userList : ", result);
                }); //user search
                return deferred.promise;
            };

            /* task picker */
            $scope.findTasks = function(name) {
                $log.debug("name - : ", name);
                var deferred = $q.defer();
                FindTasks.findByName(name).then(function(result){
                    deferred.resolve(result);
                    $log.debug("taskList : ", result);
                }); //user search
                return deferred.promise;
            };

            function taskUpload(){
                if($scope.assigneeUser != [])userIdPush($scope.assigneeUser, "assigneeIds");
                if($scope.watchers != [])userIdPush($scope.watchers, "watcherIds");
                if($scope.relatedTaskList != [])userIdPush($scope.relatedTaskList, "relatedTaskIds");

                $log.debug("vm.task ;::::::", vm.task);
                TaskEdit.uploadTask({
                    method : "POST",
                    file : $scope.files,
                    //	data 속성으로 별도의 데이터 전송
                    fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    toastr.success('태스크 수정 완료', '태스크 수정 완료');
                    $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                        $uibModalInstance.close();
                    }, 100);
                });
            }

            function userIdPush(userInfo, type){

                var typeIds = new Array();

                angular.forEach(userInfo, function(val){
                    typeIds.push(val.id);
                });

                vm.task[type] = typeIds.join(",");
            }


        }

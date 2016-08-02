(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDialogController', TaskDialogController);

    TaskDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'User', '$log', 'TaskEdit', 'findUser', '$q', 'DateUtils', 'AlertService', 'toastr', '$http', '$state'];

    function TaskDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Task, Code, TaskAttachedFile, User, $log, TaskEdit, findUser, $q, DateUtils, AlertService, toastr, $http, $state) {
        var vm = this;
        vm.task = entity;
        vm.clear = clear;
        vm.save = save;
        vm.codes = Code.query();
        vm.taskattachedfiles = TaskAttachedFile.query();
        vm.assigneeUsers = [];
        vm.assigneeUsers = User.query();
        vm.taskFindSimilar = taskFindSimilar;
        vm.openCalendar = openCalendar;
        vm.userLoad = userLoad;
        vm.fileRemove = fileRemove;
        vm.onWarning = onWarning;
        vm.validationCheck = validationCheck;
        vm.fileDownLoad = fileDownLoad;
        vm.similarTasks = [];

        $log.debug("vm.task : ", vm.task);

        vm.removeTargetFiles = [];

        vm.dueDate = {
            date: vm.task.dueDate == null ? null : DateUtils.toDate(vm.task.dueDate) ,
            datepickerOptions: {
                maxDate: null
            }
        };

        // date 포멧 변경
        $scope.$watch("vm.dueDate.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2) + ' ' +
                    DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2);
                vm.task.dueDate = formatDate;
            }

        });
        // 담당자 변경
        $scope.$watchCollection("vm.assigneeUsers", function(newValue, oldValue){
            vm.task.assignee =[];
            angular.forEach(newValue, function(value){
                vm.task.assignee.push(value.id);
            });

        });

        $scope.files = [];
        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setFiles', function (event, args) {
            $scope.files = [];
            angular.forEach(args, function(value){
                $scope.files.push(value)
            });
            $log.debug("파일 목록 : ", $scope.files);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.task.id !== null) {

                $log.debug("vm.task : ", vm.task);
                $log.debug("$scope.files : ", $scope.files);

                vm.task.removeTargetFiles = vm.removeTargetFiles.join(',');

                TaskEdit.uploadTask({
                    method : "POST",
                    file : $scope.files,
                    //	data 속성으로 별도의 데이터 전송
                    fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    toastr.success('태스크 수정 완료', '태스크 수정 완료');
                    $state.go("task", {}, {reload : true});
                    $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                        $uibModalInstance.dismiss('cancel');
                    }, 100);
                });
            } else {

                $log.debug("$scope.files : ", $scope.files);

                if (vm.task.id === null) {
                    vm.task.id = "";
                }
                $log.debug("vm.task :", vm.task);
                if(validationCheck()){
                    TaskEdit.addTask({
                        method : "POST",
                        file : $scope.files,
                        //	data 속성으로 별도의 데이터 전송
                        fields : vm.task,
                        fileFormDataName : "file"
                    }).then(function (response) {
                        $scope.$emit('wmsApp:taskUpdate', response);
                        toastr.success('태스크 생성 완료', '태스크 생성 완료');
                        $state.go("task", {}, {reload : true});
                        $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                            $uibModalInstance.dismiss('cancel');
                        }, 100);

                    });
                }
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:taskUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        // 유사 타스크 검색
        function taskFindSimilar(){

            var parameter = {name : vm.task.name};

            $log.debug("parameter : ", parameter);

            return $http.get( '/api/tasks/findSimilar', {
                params : parameter
            } ).then(function (result) {
                $log.debug("taskList : ", result.data);

                vm.similarTasks = result.data;

                return result;
            });
        }

        // 달력 오픈 function ///////////////////////////////
        function openCalendar(e, picker) {
            vm[picker].open = true;
        }

        // 사용자 검색
        function userLoad(name, excludeList){
            var deferred = $q.defer();
            findUser.findByName(name).then(function(result){
                vm.Users = result;
                deferred.resolve(result);
            }); //user search
            return deferred.promise;
        }

        //	파일 삭제 클릭 시
        function fileRemove (data, fileIndex) {
            var tempFiles = [];
            angular.forEach(vm.task.attachedFiles, function (file, index) {
                //	클라이언트에서 등록한 파일인 경우
                if (data.id === undefined) {
                    if (fileIndex != index) {
                        tempFiles.push(file);
                    }
                }
                else {
                    if (data.id != file.id) {
                        tempFiles.push(file);
                    }
                    else {
                        vm.removeTargetFiles.push(file.id);
                    }
                }
            });

            vm.task.attachedFiles = tempFiles;
        }

        // 첨부파일 다운로드
        function fileDownLoad(key){
            var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                iframe.remove();
            }).attr("src", "/api/attachedFile/" + key);
        }

        function validationCheck(){
            if(angular.isUndefined(vm.task.name)){
                onWarning("태스크 명을 입력하세요.");
                $log.debug("태스크 명 오류");
                return false;
            }else if(angular.isUndefined(vm.task.dueDate)){
                onWarning("종료날짜를 입력하세요.");
                $log.debug("종료날짜 오류");
                return false;
            }else if(angular.isUndefined(vm.task.severityId)){
                onWarning("중요도를 입력하세요.");
                $log.debug("중요도 오류");
                return false;
            }else if(angular.isUndefined(vm.task.assigneeId)){
                onWarning("담당자를 선택하세요.");
                $log.debug("담당자 오류");
                return false;
            }else return true;

        }

        function onWarning(error) {
            AlertService.warning(error);
        }


    }
})();

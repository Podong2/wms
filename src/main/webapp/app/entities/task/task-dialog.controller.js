(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDialogController', TaskDialogController);

    TaskDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'User', '$log', 'TaskEdit', 'findUser', '$q', 'DateUtils'];

    function TaskDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Task, Code, TaskAttachedFile, User, $log, TaskEdit, findUser, $q, DateUtils) {
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
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
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
                //Task.update(vm.task, onSaveSuccess, onSaveError);
                TaskEdit.uploadTask({
                    method : "PUT",
                    file : $scope.files,
                    //	data 속성으로 별도의 데이터 전송
                    fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    $log.debug("task 생성 성공")
                });
            } else {

                //Task.save(vm.task, onSaveSuccess, onSaveError);

                if (vm.task.id === null) {
                    vm.task.id = "";
                }

                TaskEdit.addTask({
                    method : "POST",
                        file : $scope.files,
                        //	data 속성으로 별도의 데이터 전송
                        fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    $log.debug("task 생성 성공")
                });
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
                        vm.removeTargetFiles.push({ id : file.id});
                    }
                }
            });
$log.debug("vm.removeTargetFiles : ", vm.removeTargetFiles);
            vm.task.attachedFiles = tempFiles;
        }

    }
})();

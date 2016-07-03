(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailController', TaskDetailController);

    TaskDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'summaryService', '$log', 'TaskEdit', 'DateUtils', 'FIndCode', 'User', 'findUser', '$q', '$sce', 'TaskListSearch', '$state', 'toastr'];

    function TaskDetailController($scope, $rootScope, $stateParams, entity, Task, Code, TaskAttachedFile, summaryService, $log, TaskEdit, DateUtils, FIndCode, User, findUser, $q, $sce, TaskListSearch, $state, toastr) {
        var vm = this;

        vm.task = entity;
        vm.makeTableConfig = makeTableConfig;
        vm.tabDisplay = tabDisplay;
        vm.openCalendar = openCalendar;
        vm.singleUpload = singleUpload;
        vm.showStatus = showStatus;
        vm.assigneeUsers = [];
        vm.renderHtml = renderHtml;
        vm.userLoad = userLoad;
        vm.assigneeEditing = assigneeEditing;
        vm.dueDateEditing = dueDateEditing;
        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){ vm.TaskAuditLog = result; }); // Audit Log List call
        FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청


        vm.responseData = vm.task;
        vm.dueDate = {
            date: vm.task.dueDate == null ? null : DateUtils.toDate(vm.task.dueDate) ,
            datepickerOptions: {
                maxDate: null
            }
        };
        vm.responseData.dueDate = vm.task.dueDate == null ? null : DateUtils.toDate(vm.task.dueDate);

        // 갤러리 썸네일 이미지
        vm.images = [];

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },
            { status: false },
            { status: false }
        ];


        // 요약정보 영역 데이터
        $scope.summaryConfigs = [];
        $scope.tempConfigs = [];

        // -------------------  broadcast start ------------------- //
        $scope.$on("dateUpload", function(event, date){
            $log.debug(date)
            var d = date;
            var formatDate =
                DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2);
            vm.responseData.dueDate = DateUtils.toDate(formatDate);
            vm.task.dueDate = formatDate;
            dueDateEditing(); // date picker 창 닫기
            singleUpload(); // date picker 업로드
        });
        $scope.$on("assigneeEditingConfig", function(event, arg){
            $log.debug("arg : " , arg)
            angular.forEach( arg, function(assingee){
                vm.task.assigneeId = assingee.id;
            });
            singleUpload();
            assigneeEditing();
        });

        // xeditable 데이터 변경 체크
        $scope.$on('taskDetailInfoChange', function (event, args) {
            $log.debug("single upload data : ", vm.responseData);
            if(args == "vm.responseData.dueDate"){
                dataFormChage(vm.responseData.dueDate);
            }
            singleUpload();
        });
        $scope.$on('$destroy', unsubscribe);
        // xeditable 데이터 변경 체크
        $scope.$on('editingUpload', function (event, args) {
            singleUpload();
        });


        var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
            vm.task = result;
        });
        // -------------------  broadcast end ------------------- //


        // ------------------- watch start ------------------ //
        // 담당자 변경
        $scope.$watchCollection("vm.assigneeUsers", function(newValue, oldValue){
            vm.task.assignee =[];
            angular.forEach(newValue, function(value){
                vm.task.assignee.push(value.id);
            });
        });
        // ------------------- watch end ------------------ //


        // xeditable single upload
        function singleUpload(){
            TaskEdit.singleUpload(vm.task).then(function (response) {
                $log.debug("Task single upload success.");
                toastr.success('태스크 수정을 성공하였습니다.', '태스크 수정');
                $state.reload();
            });

        }

        //  탭메뉴 영역 표시 여부 지정
        function tabDisplay (number) {
            angular.forEach(vm.tabArea, function (tab, index) {
                tab.status = number == index;
            });
        }

        // xeditable select box value return
        function showStatus(value, name, id) {
            vm.selectArray = [];
            vm.selectArray = vm.code;
            var result = "";
            for (var count in vm.selectArray) {
                if (vm.selectArray[count].id == value) {
                    result = vm.selectArray[count].name;
                    break;
                }
            }
            return result;
        }

        // date 포멧 변경
        function dataFormChage(date){
            var d = date;
            var formatDate =
                DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2);
            vm.task.dueDate = formatDate;
        }

        // xeditable datePicker open
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

        //	겔러리 썸네일 정보 세팅
        function setAttachedFiles(attachedFiles) {
            vm.files = [];
            vm.files = attachedFiles;
            $log.debug("attachedFile : ", attachedFiles);
            angular.forEach(attachedFiles, function(val, idx){
                if(!angular.isUndefined(val)){
                    vm.image = {
                        thumb: window.location.origin + "/api/attachedFile/" + val.attachedFile.id,
                        img: window.location.origin + "/api/attachedFile/" + val.attachedFile.id,
                        description: val.attachedFile.name
                    };
                    vm.images.push(vm.image);
                }
            });
        }

        //	설명 html 형식으로 표현
        function renderHtml (data) {
            return $sce.trustAsHtml(data);
        }

        // 종료날짜 오픈/닫기
        vm.dueDateEditingConfig = true;
        function dueDateEditing(){
            vm.dueDateEditingConfig = !vm.dueDateEditingConfig;

        }
        // 담당자 변경 picker 오픈/닫기
        vm.assigneeEditingConfig = true;
        function assigneeEditing(){
            vm.assigneeEditingConfig = !vm.assigneeEditingConfig;

        }

        function makeTableConfig(){
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.name")
                .setKey("name"));
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.dueDate")
                .setKey("dueDate"));

            $scope.summaryConfigs.push($scope.tempConfigs);
            $scope.tempConfigs = [];

            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.severity")
                .setKey("severityName")
                .setValue("severityId"));
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("global.assignee")
                .setKey("assigneeName"));

            $scope.summaryConfigs.push($scope.tempConfigs);
        }
        makeTableConfig(); // 테이블 그리기
        setAttachedFiles(vm.task.attachedFiles); // 첨부파일목록 겔러리 세팅


    }
})();

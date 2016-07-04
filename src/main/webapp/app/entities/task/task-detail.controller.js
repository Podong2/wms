(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailController', TaskDetailController);

    TaskDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'summaryService', '$log', 'TaskEdit', 'DateUtils', 'FIndCode', 'User', 'findUser', '$q', '$sce', 'TaskListSearch', '$state', 'toastr', 'DataUtils'];

    function TaskDetailController($scope, $rootScope, $stateParams, entity, Task, Code, TaskAttachedFile, summaryService, $log, TaskEdit, DateUtils, FIndCode, User, findUser, $q, $sce, TaskListSearch, $state, toastr, DataUtils) {
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
        vm.fileDownLoad = fileDownLoad;
        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){ vm.TaskAuditLog = result; }); // Audit Log List call
        FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청


        vm.responseData = _.clone(vm.task);

        vm.responseData.dueDate = vm.task.dueDate == null ? null : DateUtils.toDate(vm.responseData.dueDate); //날짜 변환값
        vm.dueDate = {
            date: vm.task.dueDate == null ? null : vm.task.dueDate ,
            datepickerOptions: {
                maxDate: null
            }
        };



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
        // 종료날짜 데이터 체크 변경
        $scope.$on("dateUpload", function(event, date){
            $("body").unbind("click");
            var d = date;
            var formatDate = DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2);
                //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2);
            vm.task.dueDate = formatDate;
            dueDateEditing(); // date picker 창 닫기
            singleUpload(); // date picker 업로드

        });

        // 담당자 데이터 변경 체크
        $scope.$on("assigneeEditingConfig", function(event, arg){
            $log.debug("arg : " , arg)
            angular.forEach( arg, function(assingee){
                vm.task.assigneeId = assingee.id;
            });
            $("body").unbind("click");
            singleUpload();
            assigneeEditing(); // user picker 창 닫기
        });

        // xeditable 데이터 변경 체크 (input, select)
        $scope.$on('taskDetailInfoChange', function (event, args) {
            $("body").unbind("click");
            singleUpload();
        });

        // content 데이터 변경 체크
        $scope.$on('editingUpload', function (event, args) {
            if (!angular.equals(vm.responseData.contents, vm.task.contents)) {
                $("body").unbind("click");
                singleUpload();
            }
        });


        $scope.$on('$destroy', unsubscribe);
        var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
            vm.task = result;
        });
        // -------------------  broadcast end ------------------- //


        // ------------------- watch start ------------------ //
        // 담당자 변경
        $scope.$watchCollection("vm.assigneeUsers", function(newValue, oldValue){
            vm.task.assignee =[];
            vm.responseData.assignee =[];
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
        // 이미지 타입
        function setAttachedFiles(attachedFiles) {
            vm.files = [];
            vm.files = attachedFiles;
            $log.debug("attachedFile : ", attachedFiles);
            angular.forEach(attachedFiles, function(val, idx){
                var fileType = val.attachedFile.contentType.split('/');
                if(!angular.isUndefined(val) && fileType[0] == "image"){
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

        // 첨부 파일 다운로드
        function fileDownLoad(key){
            var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                iframe.remove();
            }).attr("src", "/api/attachedFile/" + key);
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

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailController', TaskDetailController);

    TaskDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'summaryService', '$log', 'TaskEdit', 'DateUtils', 'FIndCode', 'User', 'findUser', '$q', '$sce', 'TaskListSearch'];

    function TaskDetailController($scope, $rootScope, $stateParams, entity, Task, Code, TaskAttachedFile, summaryService, $log, TaskEdit, DateUtils, FIndCode, User, findUser, $q, $sce, TaskListSearch) {
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
        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){ vm.TaskAuditLog = result; }); // Audit Log List call
        FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청

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

        // 담당자 변경
        $scope.$watchCollection("vm.assigneeUsers", function(newValue, oldValue){
            vm.task.assignee =[];
            angular.forEach(newValue, function(value){
                vm.task.assignee.push(value.id);
            });
        });

        var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
            vm.task = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.responseData = vm.task;
        $log.debug("vm.responseData : ", vm.responseData);

        // xeditable 데이터 변경 체크
        $scope.$on('taskDetailInfoChange', function (event, args) {
            $log.debug("single upload data : ", vm.responseData);
            if(args == "vm.responseData.dueDate"){
                dataFormChage(vm.responseData.dueDate);
            }
            singleUpload();
        });

        // xeditable single upload
        function singleUpload(){
            TaskEdit.singleUpload(vm.task).then(function (response) {
                $log.debug("Task single upload success.");
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
        };

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

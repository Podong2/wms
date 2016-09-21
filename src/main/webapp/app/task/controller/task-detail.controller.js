(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailCtrl', TaskDetailCtrl);

    TaskDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', 'TaskAttachedFile', '$log', 'TaskEdit', 'DateUtils', 'findUser', '$q', '$sce', '$state', 'toastr', 'SubTask',
        'FindTasks', 'entity', 'TaskListSearch', 'dataService', 'Principal', 'ProjectFind', 'ProjectFindByName', 'ModalService', 'TaskProgressStatus', 'tableService', 'ModifySubTask', '$http', '$cookies'];

    function TaskDetailCtrl($scope, $rootScope, $stateParams, Task, Code, TaskAttachedFile, $log, TaskEdit, DateUtils, findUser, $q, $sce, $state, toastr, SubTask,
                            FindTasks, entity, TaskListSearch, dataService, Principal, ProjectFind, ProjectFindByName, ModalService, TaskProgressStatus, tableService, ModifySubTask, $http, $cookies) {
        var vm = this;
        vm.baseUrl = window.location.origin;

        vm.openCalendar = openCalendar;
        vm.taskUpload = taskUpload;
        vm.renderHtml = renderHtml;
        vm.fileDownLoad = fileDownLoad;
        vm.subTaskSave = subTaskSave;
        vm.createComment = createComment;
        vm.FindProjectList = FindProjectList;
        vm.selectDateTerm = selectDateTerm;
        vm.setRepeatType = setRepeatType;
        vm.setWeekday = setWeekday;
        vm.repeatClose = repeatClose;
        vm.subTaskClose = subTaskClose;
        vm.taskRevertModalOpen = taskRevertModalOpen;
        vm.projectRemoveInTask = projectRemoveInTask;
        vm.getTaskProgressStatus = getTaskProgressStatus;
        vm.removeComment = removeComment;
        vm.subTaskUserAdd = subTaskUserAdd;
        vm.subTaskUpdate = subTaskUpdate;
        vm.updateSubTaskForm = updateSubTaskForm;
        vm.setDatePickerInput = setDatePickerInput;
        vm.subTaskUserRemove = subTaskUserRemove;
        vm.watcherAdd = watcherAdd;
        vm.removeWatcher = removeWatcher;
        vm.watcherPopupClose = watcherPopupClose;
        vm.watcherInfoAdd = watcherInfoAdd;
        vm.userInfo = Principal.getIdentity();
        $scope.dataService = dataService;

        vm.privateYns = [{"id":false, "name":"공개", icon: 'fa-unlock-alt'},{"id":true,"name":"비공개", icon: 'fa-lock'}];

        $scope.getToken = function() {
            return $cookies.get("CSRF-TOKEN");
        };
        $scope.getToken()

        // bootstrap file uploader plugin load
        //$("#input-4").fileinput({
        //    showCaption: false, showUpload: false, uploadUrl:"1", uploadAsync: false
        //});

        /* 코멘트 배열 및 파일 업로더 설정 정보 */
        $scope.commentFiles = [];
        $("#input-5").fileinput({
            uploadUrl : '/tasks/uploadFile',
            task : '',
            type : 'task-add',
            token : $scope.getToken(),
            showCaption: false,
            showUpload: true,
            showRemove: false,
            uploadAsync: false,
            overwriteInitial: false,
            initialPreviewAsData: true, // defaults markup
            initialPreviewFileType: 'image', // image is the default and can be overridden in config below
            uploadExtraData: function (previewId, index) {
                var obj = {};
                $('.file-form').find('input').each(function() {
                    var id = $(this).attr('id'), val = $(this).val();
                    obj[id] = val;
                });
                return obj;
            }
        }).on('filesorted', function(e, params) {
            console.log('File sorted params', params);
        }).on('fileuploaded', function(e, params) {
            console.log('File uploaded params', params);
        }).on('getFileupload', function(e, params) {
            angular.forEach(params, function(value){
                $scope.commentFiles.push(value)
            });
            $scope.$apply();
            $log.debug("파일 목록 : ", $scope.commentFiles);
        }).on('filedeleted', function(event, key) {
            console.log('Key = ' + key);
        });

        var previewFile = {
            caption: '',
            size: '',
            url: '',
            key: ''
        };
        vm.removeFile = {
            entityName : '',
            entityId : '',
            attachedFileId : ''
        };
        vm.previewFiles=[]; // 파일 테이블 목록
        vm.previewFileUrl=[]; // 파일 url 목록
        vm.task = getTask();

        vm.date = '';
        vm.assigneeUsers = [];
        vm.logArrayData = [];
        vm.codes = Code.query();
        vm.commentList = [];
        vm.projectList=[];
        $scope.projectName = '';
        vm.userList = [];
        vm.userName = '';
        $scope.userName = '';
        vm.fileListYn = false;
        // 하위 작업 업데이트 파라미터
        vm.subTaskUpdateForm = {
            id : '',
            assigneeIds : '',
            startDate : '',
            endDate : '',
        }
        vm.DuplicationWatcherIds = [];



        function getTask(){
            // 파일 목록 주입
            vm.taskFiles = entity.attachedFiles;
            angular.forEach(vm.taskFiles, function(value, index){
                previewFile.caption = value.name;
                previewFile.locationType = 'Task';
                previewFile.locationId = entity.id;
                previewFile.size = byteCalculation(value.size);
                previewFile.url = window.location.origin + "/api/attachedFile/" + value.id;
                previewFile.id = value.id;
                previewFile.contentType = value.contentType;
                var fileInfo = _.clone(previewFile);
                vm.previewFiles.push(fileInfo);
                vm.previewFileUrl.push(previewFile.url);
            });
            $log.debug("vm.previewFiles : ", vm.previewFiles)
            //$log.debug("vm.previewFileUrl : ", vm.previewFileUrl)
            return entity;
        }


        $scope.fileRemove = function(url, id){
            $log.debug(url, id)
        }

        /* 로그& 댓글 불러오기 */
        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){
            vm.TaskAuditLog = result;
            $log.debug("작업 로그 목록 : ", vm.TaskAuditLog);
            angular.forEach(vm.TaskAuditLog.data, function(val){
                if(val.entityField == 'reply'){
                    vm.commentList.push(val);
                }
            });

            $("#input-4").fileinput({
                uploadUrl : '/tasks/uploadFile',
                task : vm.task,
                type : 'task',
                token : $scope.getToken(),
                autoReplace: true,
                showCaption: false,
                showUpload: true,
                showRemove: false,
                uploadAsync: false,
                overwriteInitial: false,
                initialPreview: vm.previewFileUrl,
                initialPreviewAsData: true, // defaults markup
                initialPreviewFileType: 'image', // image is the default and can be overridden in config below
                initialPreviewConfig: vm.previewFiles,
                uploadExtraData: function (previewId, index) {
                    var obj = {};
                    $('.file-form').find('input').each(function() {
                        var id = $(this).attr('id'), val = $(this).val();
                        obj[id] = val;
                    });
                    return obj;
                }
            }).on('filesorted', function(e, params) {
                console.log('File sorted params', params);
            }).on('fileuploaded', function(e, params) {
                console.log('File uploaded params', params);
            }).on('detailReload', function(e, params) {
                $state.go("my-task.detail", {}, {reload : 'my-task.detail'});
            })
            vm.task = entity;
        });

        vm.responseDataCheck = _.clone(vm.task);
        vm.responseData = _.clone(vm.previewFiles);

        $log.debug("info :", vm.task)
        vm.listType = $stateParams.listType;

        // 갤러리 썸네일 이미지
        vm.images = [];

        // 코멘트 생성 데이터
        vm.comment = {
            id : vm.userInfo.id,
            entityId : vm.task.id,
            entityName : 'Task',
            contents : '',
            mentionIds : [],
            removeAttachedFileIds : ''
        };

        // 하위작업, 파일첨부, 참조작업 클릭 이벤트 데이터
        vm.subTaskOpen = false;
        vm.fileAreaOpen = false;
        vm.commentFileAreaOpen = false;
        vm.relatedTaskOpen = false;

        $scope.files = [];

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },
            { status: false },
            { status: false }
        ];

        // 반복설정 월~일 날짜 선택 버튼 상태값
        vm.weekDaysArea = [
            {status : false},
            {status : false},
            {status : false},
            {status : false},
            {status : false},
            {status : false},
            {status : false}
        ];

        // min date picker
        this.dueDateFrom = {
            date: DateUtils.toDate(vm.task.startDate == null ? '' : vm.task.startDate),
            datepickerOptions: {
                customClass: '',
                minDate: new Date(),
                showWeeks: true
            }
        };

        // max date picker
        this.dueDateTo = {
            date: DateUtils.toDate(vm.task.endDate == null ? '' : vm.task.endDate),
            datepickerOptions: {
                customClass: '',
                minDate: new Date(),
                showWeeks: true
            }
        };
        // 반복작업 시작시간
        this.adventStartTime = {
            date: vm.task.taskRepeatSchedule == null ? '' : DateUtils.toDate('2016-11-11 '+vm.task.taskRepeatSchedule.adventDateStartTime),
            timepickerOptions: {
                readonlyInput: false,
                showMeridian: true
            }
        };
        // 반복작업 반복기간 시작일
        this.repeatDueDateFrom = {
            date: vm.task.taskRepeatSchedule == null ? '' : DateUtils.toDate(vm.task.taskRepeatSchedule.startDate),
            datepickerOptions: {
                maxDate: null
            }
        };
        // 반복작업 반복기간 종료일
        this.repeatDueDateTo = {
            date: vm.task.taskRepeatSchedule == null ? '' : DateUtils.toDate(vm.task.taskRepeatSchedule.endDate),
            datepickerOptions: {
                minDate: null
            }
        };
        // 하위 작업 일정 시작일
        this.subTaskDueDateFrom = {
            date: vm.task.taskRepeatSchedule == null ? '' : DateUtils.toDate(vm.task.taskRepeatSchedule.startDate),
            datepickerOptions: {
                maxDate: null
            }
        };
        // 하위 작업 일정 종료일
        this.subTaskDueDateTo = {
            date: vm.task.taskRepeatSchedule == null ? '' : DateUtils.toDate(vm.task.taskRepeatSchedule.endDate),
            datepickerOptions: {
                minDate: null
            }
        };

        // watch min and max dates to calculate difference
        var unwatchMinMaxValues = $scope.$watch(function() {
            return [vm.dueDateFrom, vm.dueDateTo];
        }, function() {
            // min max dates
            vm.dueDateFrom.datepickerOptions.maxDate = vm.dueDateTo.date;
            vm.dueDateTo.datepickerOptions.minDate = vm.dueDateFrom.date;

            if (vm.dueDateFrom.date && vm.dueDateTo.date) {
                var diff = vm.dueDateFrom.date.getTime() - vm.dueDateTo.date.getTime();
                vm.dayRange = Math.round(Math.abs(diff/(1000*60*60*24))) + 1
            } else {
                vm.dayRange = '0';
            }

        }, true);

        $scope.$on('$destroy', function() {
            unwatchMinMaxValues();
        });

        // 반복설정 '매월' 설정기간 데이터
        vm.weeks = [ {id : 1,name : '첫째주'},{id : 2,name : '둘째주'},{id : 3,name : '셋째주'},{id : 4,name : '넷째주'} ];

        // 반복설정 상단 탭
        vm.tapAreas = [];
        vm.tapAreas = [
            { status: true },  //today
            { status: false }, //tomorrow
            { status: false }, //nextWeek
            { status: false }, //oneMonth
            { status: false }, //directSelection
            { status: false }  //Undefined
        ];

        /* sub task info */
        vm.subTask = {
            name : '',
            parentId : vm.task.id,
            assigneeId : '',
            statusId : 1,
            projectId : $stateParams.projectId
        };

        // -------------------  broadcast start ------------------- //
        vm.tagArray = [];
        $scope.$on("tagRemoveId", function(event, args){
            vm.tagArray = [];
            vm.tagArray.push({id : args.id});
            if(args.tagType == "assignees") {
                userIdPush(vm.tagArray, "removeAssigneeIds")
            }else if(args.tagType == "watchers"){
                userIdPush(vm.tagArray, "removeWatcherIds")
            }else if(args.tagType == "relatedTasks"){
                userIdPush(vm.tagArray, "removeRelatedTaskIds")
            }
            taskUpload();
        });

        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setFiles', function (event, args) {
            $scope.files = [];
            angular.forEach(args, function(value){
                $scope.files.push(value)
            });
            $log.debug("파일 목록 : ", $scope.files);
            taskUpload();
        });
        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setCommentFiles', function (event, args) {
            angular.forEach(args, function(value){
                $scope.commentFiles.push(value)
            });
            $scope.$apply();
            $log.debug("코멘트 파일 목록 : ", $scope.commentFiles);
        });

        // content 데이터 변경 체크
        $scope.$on('editingUpload', function (event, args) {
            if (!angular.equals(vm.responseDataCheck.contents, vm.task.contents)) {
                vm.responseDataCheck.contents = vm.task.contents;
                taskUpload();
            }
        });


        //$scope.$on('$destroy', unsubscribe);
        //var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
        //    vm.task = result;
        //});
        // -------------------  broadcast end ------------------- //

        // date 포멧 변경
        $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.task.startDate= formatDate;
            }

        });
        // date 포멧 변경
        $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.task.endDate = formatDate;
            }
        });
        // 반복작업 시작 시간 포멧 변경(기간)
        $scope.$watch("vm.repeatDueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.taskRepeatSchedule.startDate = formatDate;
            }
        });
        // 반복작업 종료 시간 포멧 변경(기간)
        $scope.$watch("vm.repeatDueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                if(newValue != '') var formatDate = DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.taskRepeatSchedule.endDate = formatDate;
            }
        });
        // 반복작업 시작 시간 포멧 변경
        $scope.$watch("vm.adventStartTime.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate = DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2);
                vm.taskRepeatSchedule.adventDateStartTime = formatDate;
            }
        });
        // 하위 작업 시작 시간 포멧 변경(기간)
        $scope.$watch("vm.subTaskDueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.subTaskUpdateForm.startDate = formatDate;
            }
        });
        // 하위 작업 종료 시간 포멧 변경(기간)
        $scope.$watch("vm.subTaskDueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                if(newValue != '') var formatDate = DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                vm.subTaskUpdateForm.endDate = formatDate;
            }
        });


        $scope.$watchGroup(['vm.task.statusId', 'vm.task.importantYn'], function(newValue, oldValue){
            if(oldValue[0] != undefined && newValue[0] != undefined && newValue[1] != null&& oldValue != newValue) {
                taskUpload();
            }
        });
        $scope.$watchCollection('vm.task.assignees', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue) {
                if(oldValue == null && newValue.length > 0){
                    taskUpload();
                }else if(oldValue.length < newValue.length){
                    taskUpload();
                }
            }
        });
        $scope.$watchCollection('vm.task.watchers', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue) {
                if(oldValue == null && newValue.length > 0){
                    taskUpload();
                }else if(oldValue != null && oldValue.length < newValue.length){
                    taskUpload();
                }
            }
        });
        $scope.$watchCollection('vm.task.relatedTasks', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue) {
                if(oldValue == null && newValue.length > 0){
                    taskUpload();
                }else if(oldValue != null && oldValue.length < newValue.length){
                    taskUpload();
                }
            }
        });
        $scope.$watchCollection('vm.task.projectIds', function(newValue, oldValue){
            if(newValue != undefined && oldValue != newValue && newValue != '') {
                taskUpload();
            }
        });

        /* 프로젝트 목록 불러오기 */
        var excludeIds = '';
        function getProjectList(){ //  excludeIds : 속한 프로젝트는 안나오게 처리
            var projectIds = [];
            angular.forEach(vm.task.taskProjects, function(value, index){
                projectIds.push(value.id);
            });
            excludeIds = projectIds.join(",");
            ProjectFind.query({name : '' , excludeIds : excludeIds}, onProjectSuccess, onProjectError);
        }
        /* 프로젝트 목록 검색 */
        function FindProjectList(){
            ProjectFindByName.query({name : $scope.projectName, excludeIds : excludeIds},onProjectSuccess, onProjectError)
        }
        function onProjectSuccess (result) {
            vm.projectList = result;
        }
        function onProjectError (result) {
            toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
        }
        getProjectList();

        // 달력 오픈
        function openCalendar(e, picker) {
            vm[picker].open = true;
        }

        // 프로젝트 실시간 검색
        $scope.$watchCollection('projectName', function(){
            FindProjectList();
        });

        // 담당자 실시간 검색
        $scope.$watchCollection('vm.userName', function(newValue){
            $log.debug("vm.userName : ", newValue);
            $scope.userName = newValue;
            $scope.pickerFindUsers(newValue);
        });
        // 참조자 명 실시간 검색
        $scope.$watchCollection('vm.watcherName', function(newValue){
            if(newValue != '' && newValue != undefined){
                $log.debug("vm.watcherName : ", newValue);
                $scope.watcherName = newValue;
                $scope.pickerFindWatcher(newValue);
            }
        });

        function updateSubTaskForm(subTask) {

            $log.debug("subTask : ", subTask);
            vm.subTaskUpdateForm = subTask;
            $scope.pickerFindUsers('');
        }

        /* 하위 작업 저장 */
        function subTaskUserAdd(userId){
            vm.subTaskUpdateForm.assigneeIds = userId;
            subTaskUpdate();
        }
        function subTaskUserRemove(userId ,subTask){
            vm.subTaskUpdateForm = subTask;
            vm.subTaskUpdateForm.removeAssigneeIds = userId;
            subTaskUpdate();
        }
        function subTaskUpdate(){
            TaskEdit.putSubTask(vm.subTaskUpdateForm).then(function(result){
                getTaskInfo();
                subTaskClose();
                toastr.success('하위작업 수정 완료', '하위작업 수정 완료');
            });
        }


        /* 타스크의 서브타스크 등록 */
        function subTaskSave(){
            if(vm.subTask.name != '') SubTask.save(vm.subTask, onSubTaskSaveSuccess, onSaveError);
        }

        function onSubTaskSaveSuccess (result) {
            toastr.success('sub 태스크 생성 완료', 'sub 태스크 생성 완료');
            getTaskInfo();
            if($stateParams.parentType == 'project'){
                $rootScope.$broadcast('projectReload');
            }else if($stateParams.parentType == 'task'){
                $rootScope.$broadcast('taskReload', $stateParams.listType);
            }
        }
        function onSaveError () {
        }

        /* user picker */
        $scope.findUsers = function(name) {
            var deferred = $q.defer();
            findUser.findByName(name).then(function(result){
                deferred.resolve(result);
                $log.debug("userList : ", result);
            }); //user search
            return deferred.promise;
        };

        /* user picker */
        $scope.pickerFindUsers = function(name) {

            var userIds = [];
            angular.forEach(vm.subTaskUpdateForm.assignees, function(val){
                userIds.push(val.id);
            });

            var excludeUserIds = userIds.join(",");

            findUser.findByNameAndExcludeIds(name, excludeUserIds).then(function(result){
                $log.debug("userList : ", result);
                vm.userList = result;
            }); //user search
        };
        /* watcher picker */
        $scope.pickerFindWatcher = function(name) {

            var userIds = [];
            angular.forEach(vm.task.watchers, function(val){
                userIds.push(val.id);
            });

            var excludeUserIds = userIds.join(",");
            vm.DuplicationWatcherIds = excludeUserIds;

            findUser.findByNameAndExcludeIds(name, excludeUserIds).then(function(result){
                $log.debug("watcherList : ", result);
                vm.watcherList = result;
            }); //user search
        };


        /* task picker */
        $scope.findTasks = function(name) {
            var deferred = $q.defer();
            FindTasks.findByName(name).then(function(result){
                deferred.resolve(result);
                $log.debug("taskList : ", result);
            }); //user search
            return deferred.promise;
        };

        /* 타스크 업로드 */
        function taskUpload(){
            if(vm.task.assignees != [])userIdPush(vm.task.assignees, "assigneeIds");
            if(vm.task.watchers != [])userIdPush(vm.task.watchers, "watcherIds");
            if(vm.task.relatedTasks != [])userIdPush(vm.task.relatedTasks, "relatedTaskIds");
            vm.task.taskRepeatSchedule = vm.taskRepeatSchedule;
            vm.task.importantYn = vm.task.importantYn == null ? '': vm.task.importantYn;

            $log.debug("업로드 작업 정보 : ", vm.task);
            $log.debug("업로드 파일 정보 : ", $scope.files);
            TaskEdit.uploadTask({
                method : "POST",
                file : $scope.files,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.task,
                fileFormDataName : "file"
            }).then(function (response) {
                toastr.success('태스크 수정 완료', '태스크 수정 완료');
                $rootScope.$broadcast('projectEditClose');
                $rootScope.$broadcast('taskReload', $stateParams.listType);
                vm.task.removeAssigneeIds = "";
                vm.task.removeWatcherIds = "";
                vm.task.removeRelatedTaskIds ="";
                vm.task.assigneeIds = "";
                vm.task.watcherIds = "";
                vm.task.relatedTaskIds ="";
                vm.task.projectIds = "";
                vm.task.removeProjectIds = "";
                vm.repeatClose(); // 반복설정 팝업 닫기
                $scope.files = [];
                //getTaskInfo();
                $state.go("my-task.detail", {}, {reload : 'my-task.detail'});
            });
        }

        // 작업 정보 불러오기
        function getTaskInfo(){
            Task.get({id : vm.task.id}, successTask, erorrTask);
        }

        $rootScope.$on('task-detail-reload', function(){
            getTaskInfo();
        })

        // 타스크 불러오기 성공
        function successTask(result){
            vm.task = result;

            vm.taskFiles = vm.task.attachedFiles;
            vm.previewFiles = [];
            vm.previewFileUrl = [];
            vm.responseData = [];
            angular.forEach(vm.taskFiles, function(value, index){
                previewFile.caption = value.name;
                previewFile.locationType = 'Task';
                previewFile.locationId = vm.task.id;
                previewFile.size = value.size;
                previewFile.url = window.location.origin + "/api/attachedFile/" + value.id;
                previewFile.id = value.id;
                var fileInfo = _.clone(previewFile);
                vm.previewFiles.push(fileInfo);
                vm.previewFileUrl.push(previewFile.url);
            });
            vm.responseData = _.clone(vm.previewFiles);
            $("#input-4").fileinput({
                uploadUrl : '/tasks/uploadFile',
                task : vm.task,
                type : 'task',
                token : $scope.getToken(),
                autoReplace: true,
                showCaption: false,
                showUpload: true,
                showRemove: false,
                uploadAsync: false,
                overwriteInitial: false,
                initialPreview: vm.previewFileUrl,
                initialPreviewAsData: true, // defaults markup
                initialPreviewFileType: 'image', // image is the default and can be overridden in config below
                initialPreviewConfig: vm.previewFiles,
                uploadExtraData: function (previewId, index) {
                    var obj = {};
                    $('.file-form').find('input').each(function() {
                        var id = $(this).attr('id'), val = $(this).val();
                        obj[id] = val;
                    });
                    return obj;
                }
            }).on('filesorted', function(e, params) {
                console.log('File sorted params', params);
            }).on('fileuploaded', function(e, params) {
                console.log('File uploaded params', params);
            });


            getTaskAudigLog();

            $log.debug("내작업 정보 : ", vm.task);
            $log.debug("내작업 파일 불러온 정보 : ", vm.previewFiles);


        }
        function erorrTask(){

        }

        function userIdPush(userInfo, type){

            var typeIds = [];
            angular.forEach(userInfo, function(val){
                typeIds.push(val.id);
            });

            vm.task[type] = typeIds.join(",");
        }

        //설명 html 형식으로 표현
        function renderHtml (data) {
            return $sce.trustAsHtml(data);
        }

        // 첨부 파일 다운로드
        function fileDownLoad(key){
            var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                iframe.remove();
            }).attr("src", "/api/attachedFile/" + key);
        }

        //setAttachedFiles(vm.task.attachedFiles); // 첨부파일목록 겔러리 세팅


        vm.mentionIds = []; // mention ids
        function createComment(){
            if(vm.comment.contents == ''){
                toastr.warning('코멘트를 입력해주세요.', '코멘트 내용');
                return false;
            }
            var $mention = $(".comment-area .mentionUser");
            vm.comment.mentionIds = [];
            vm.mentionIds = [];
            angular.forEach($mention, function(value){
                vm.mentionIds.push(value.id);
            });
            commentMentionIdPush(vm.mentionIds);
            $log.debug('댓글 저장 정보 : ', vm.comment)
            TaskEdit.createComment({
                method : "POST",
                file : $scope.commentFiles,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.comment,
                fileFormDataName : "file"
            }).then(function (response) {
                $scope.$emit('wmsApp:taskUpdate', response);
                toastr.success('태스크 댓글 생성 완료', '태스크 댓글 생성 완료');
                getTaskAudigLog();
            });
        }

        // 코멘트 멘션 유저 아이디 주입
        function commentMentionIdPush(ids){
            var typeIds = [];
            angular.forEach(ids, function(val){
                typeIds.push(val);
            });
            vm.comment.mentionIds = typeIds.join(",");
        }

        // 댓글만 보기 기능
        vm.onlyComment = onlyComment;
        vm.commentViewType = false;
        function onlyComment(){

        }

        function getTaskAudigLog(){
            TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){
                vm.TaskAuditLog = result;
                vm.commentList=[];
                angular.forEach(vm.TaskAuditLog.data, function(val){
                    if(val.entityField == 'reply'){
                        vm.commentList.push(val);
                    }
                });
            });
        }

        //  탭메뉴 영역 표시 여부 지정
        function selectDateTerm (number) {
            angular.forEach(vm.tapAreas, function (tab, index) {
                if (number == index) {
                    tab.status = true;
                }
                else {
                    tab.status = false;
                }
            });
            var resultDates = '';
            // 일정 선택 시 ()
            switch (number){
                case 0 : // 오늘
                    vm.dueDateFrom.date = DateUtils.toDate(new Date().format("yyyy-MM-dd"));
                    vm.dueDateTo.date = DateUtils.toDate(new Date().format("yyyy-MM-dd"));
                    break;
                case 1 : // 내일
                    $log.debug(" DateUtils.getTomorrow() : ", DateUtils.getTomorrow());
                    resultDates = DateUtils.getTomorrow();
                    vm.dueDateFrom.date = DateUtils.toDate(resultDates.startDate);
                    vm.dueDateTo.date = DateUtils.toDate(resultDates.endDate);
                    break;
                case 2 : // 다음주
                    $log.debug(" DateUtils.getTomorrow() : ", DateUtils.getAfterWeek());
                    resultDates = DateUtils.getAfterWeek();
                    vm.dueDateFrom.date = DateUtils.toDate(resultDates.startDate);
                    vm.dueDateTo.date = DateUtils.toDate(resultDates.endDate);
                    break;
                case 3 : // 한달
                    $log.debug(" DateUtils.getTomorrow() : ", DateUtils.getMonthDays());
                    resultDates = DateUtils.getMonthDays();
                    vm.dueDateFrom.date = DateUtils.toDate(resultDates.startDate);
                    vm.dueDateTo.date = DateUtils.toDate(resultDates.endDate);
                    break;
                case 4 : // 미정
                    vm.dueDateFrom.date = '';
                    vm.dueDateTo.date = '';
                    vm.task.startDate = '';
                    vm.task.endDate = '';
                    break;
            }
        }

        // 반복설정 임시 파라미터
        vm.taskRepeatSchedule = {
            adventDateStartTime : vm.task.taskRepeatSchedule == null ? '' : vm.task.taskRepeatSchedule.adventDateStartTime,
            endDate : vm.task.taskRepeatSchedule == null ? '' : vm.task.taskRepeatSchedule.endDate,
            id : 0,
            monthlyCriteria :vm.task.taskRepeatSchedule == null ? '' :  vm.task.taskRepeatSchedule.monthlyCriteria,
            permanentYn : vm.task.taskRepeatSchedule == null ? 'true' : (vm.task.taskRepeatSchedule.permanentYn ? 'true' : 'false'),
            repeatType : vm.task.taskRepeatSchedule == null ? '' : vm.task.taskRepeatSchedule.repeatType,
            repeatYn : vm.task.taskRepeatSchedule == null ? true : vm.task.taskRepeatSchedule.repeatYn,
            startDate : vm.task.taskRepeatSchedule == null ? '' : vm.task.taskRepeatSchedule.startDate,
            weekdays : vm.task.taskRepeatSchedule == null ? '' : vm.task.taskRepeatSchedule.weekdays
        };

        // 반복설정 weekdays 화면 active 세팅
        weekDaysAreaSetting();
        function weekDaysAreaSetting() {
            if(vm.task.taskRepeatSchedule != null && vm.task.taskRepeatSchedule.weekdays != ''){
                var weekday = vm.task.taskRepeatSchedule.weekdays.split(',');
                angular.forEach(weekday, function (value, index) {
                    vm.weekDaysArea[value-1].status = true;
                });
                $log.debug("vm.weekDaysArea", vm.weekDaysArea)
            }
        }

        // 매월 선택 시 날짜, 요일 영역 오픈
        vm.monthlyAreaOpen = vm.task.taskRepeatSchedule == null ? '' : (vm.task.taskRepeatSchedule.repeatType == 'MONTHLY_DATE' || vm.task.taskRepeatSchedule.repeatType == 'MONTHLY_WEEKDAY' ? true : false);

        // 반복설정 타입 주입
        function setRepeatType(type){
            vm.taskRepeatSchedule.weekdays = '';
            angular.forEach(vm.weekDaysArea, function(val, index){
                val.status = false;
            });
            if(type == 'MONTHLY'){
                vm.taskRepeatSchedule.repeatType = 'MONTHLY_DATE';
                vm.monthlyAreaOpen = true;

            }else if(type == 'END_DATE_REMOVE'){
                vm.taskRepeatSchedule.endDate = '';
                vm.repeatDueDateTo.date = '';
            }else if(type == ''){
                vm.taskRepeatSchedule.monthlyCriteria = '';
            }else{
                vm.monthlyAreaOpen = false;
                vm.taskRepeatSchedule.weekdays = '';
                vm.taskRepeatSchedule.monthlyCriteria = '';

                vm.taskRepeatSchedule.repeatType = type;
            }
        }

        // 날짜 1~31까지 데이터 생성
        vm.days = [];
        for(var i=0; i <= 31; i++ ){
            var day = {
                id : i,
                name : i + '일'
            }
            vm.days.push(day)
        }

        // 반복설정 weekdays 값 ',' 세팅
        function setWeekday(value){
            var typeIds = [];
            vm.weekDaysArea[value -1].status = !vm.weekDaysArea[value -1].status;
            angular.forEach(vm.weekDaysArea, function(val, index){
                if(val.status) typeIds.push(index + 1);
            });
            vm.taskRepeatSchedule.weekdays = typeIds.join(",");
        }

        // 반복설정 팝업 닫기
        function repeatClose(){
            $rootScope.$broadcast('repeatClose');
        }
        // 반복설정 팝업 닫기
        function subTaskClose(){
            $rootScope.$broadcast('subTaskClose');
        }

        // 작업 본문 복원 팝업 오픈
        function taskRevertModalOpen(){
            var editModalConfig = {
                size : "lg",
                url : "app/task/html/modal/taskRevertModal.html",
                ctrl : "taskRevertCtrl",
                data : vm.task
            };
            ModalService.openModal(editModalConfig);
        }

        //타스크에 속한 프로젝트 x 버튼 눌러 삭제
        function projectRemoveInTask(projectId){
            vm.task.removeProjectIds = projectId;
            taskUpload();
        }

        function removeComment(traceLogId) {
            TaskEdit.removeComment(traceLogId).then(function(response){
                toastr.error('태스크 댓글 삭제 완료', '태스크 댓글 삭제 완료');
                getTaskAudigLog();
            });
        }

        //byte를 용량 계산해서 반환
        function byteCalculation(bytes) {
            var bytes = parseInt(bytes);
            var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
            var e = Math.floor(Math.log(bytes)/Math.log(1024));

            if(e == "-Infinity") return "0 "+s[0];
            else
                return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
        }

        // 하위 작업 날짜 폼 입력 및 하위 작업 정보 주입
        function setDatePickerInput(subTask){
            vm.subTaskUpdateForm = subTask;
            vm.subTaskDueDateFrom.date = DateUtils.toDate(subTask.startDate)
            vm.subTaskDueDateTo.date = DateUtils.toDate(subTask.endDate)
        }

        //
        function getTaskProgressStatus(){
            // 작업 본문 복원 팝업 오픈
            var editModalConfig = {
                size : "lg",
                url : "app/task/html/modal/taskProgressStatusView.html",
                ctrl : "TaskProgressStatusCtrl",
                data : vm.task
            };
            if(vm.task.relatedTasks.length != 0 || vm.task.subTasks.length != 0)ModalService.openModal(editModalConfig);
        }

        // 참조자 데이터 주입
        function watcherAdd(watcher){
            var index = vm.DuplicationWatcherIds.indexOf(watcher.id);
            if(index > -1){
                $log.debug("중복")
            }else{
                //vm.DuplicationWatcherIds.push(watcher.id);
                vm.task.watchers.push(watcher);
                $rootScope.$broadcast('watcherPopupClose');
            }
        }

        // 참조자 데이터 제거
        function removeWatcher(watcher){
            $rootScope.$broadcast('watcherPopupClose');
            vm.task.removeWatcherIds = watcher.id;
            taskUpload();
        }

        //참조자 팝업 닫기
        function watcherPopupClose(){
            $rootScope.$broadcast('watcherPopupClose');
        }
        function watcherInfoAdd(watcher){
            $scope.watcherInfo = watcher;
        }


        vm.tableConfigs = [];
        vm.tableConfigs.push(tableService.getConfig("", "checked")
            .setHWidth("width-30-p")
            .setDAlign("text-center")
            .setHAlign("text-center")
            .setDType("check"));
        vm.tableConfigs.push(tableService.getConfig("이름", "caption")
            .setHWidth("width-200-p")
            .setDAlign("text-center")
            .setDColor('field1_color'));
        vm.tableConfigs.push(tableService.getConfig("파일 크기", "size")
            .setHWidth("width-200-p")
            .setDAlign("text-center"));
        vm.tableConfigs.push(tableService.getConfig("다운로드", "")
            .setHWidth("width-80-p")
            .setDAlign("text-center")
            .setDType("renderer")
            .setDRenderer("file_download"));
        vm.tableConfigs.push(tableService.getConfig("삭제", "")
            .setHWidth("width-80-p")
            .setDAlign("text-center")
            .setDType("renderer")
            .setDRenderer("file_remove"));

        //$scope.tags = [];
        //$scope.loadCountries = function($query) {
        //    return $http.get('countries.json', { cache: true}).then(function(response) {
        //        var countries = response.data;
        //        return countries.filter(function(country) {
        //            return country.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
        //        });
        //    });
        //};
    }

})();



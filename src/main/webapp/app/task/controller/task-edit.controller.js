/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskEditCtrl", taskEditCtrl);
taskEditCtrl.$inject=['$rootScope', '$scope', '$uibModalInstance', 'Code', '$log', 'Task', 'toastr', '$state', '$timeout', 'DateUtils', 'SubTask', 'Principal', 'findUser', '$q', 'TaskEdit', 'FindTasks'
    , 'ProjectFind', 'ProjectFindByName', '$cookies', 'FindByCondition', 'ModalService'];
        function taskEditCtrl($rootScope, $scope, $uibModalInstance, Code, $log, Task, toastr, $state, $timeout, DateUtils, SubTask, Principal, findUser, $q, TaskEdit, FindTasks
            , ProjectFind, ProjectFindByName, $cookies, FindByCondition, ModalService) {
            var vm = this;
            vm.baseUrl = window.location.origin;

            vm.save = save;
            vm.subTaskSave = subTaskSave;
            vm.openCalendar = openCalendar;
            vm.ok = ok;
            vm.cancel = cancel;
            vm.autoValueInit = autoValueInit;
            vm.taskUpload = taskUpload;
            vm.taskUpdate = taskUpdate;
            vm.FindProjectList = FindProjectList;
            vm.setRepeatType = setRepeatType;
            vm.setWeekday = setWeekday;
            vm.repeatClose = repeatClose;
            vm.selectDateTerm = selectDateTerm;
            vm.subTaskUserAdd = subTaskUserAdd;
            vm.subTaskUpdate = subTaskUpdate;
            vm.updateSubTaskForm = updateSubTaskForm;
            vm.setDatePickerInput = setDatePickerInput;
            vm.subTaskClose = subTaskClose;
            vm.subTaskUserRemove = subTaskUserRemove;
            vm.watcherAdd = watcherAdd;
            vm.removeWatcher = removeWatcher;
            vm.watcherPopupClose = watcherPopupClose;
            vm.watcherInfoAdd = watcherInfoAdd;
            vm.findRelatedTask = findRelatedTask;
            vm.addRelatedTask = addRelatedTask;
            vm.relatedTaskFormOpen = relatedTaskFormOpen;
            vm.relatedTaskPopupClose = relatedTaskPopupClose;
            vm.removeRelatedTask = removeRelatedTask;
            vm.projectClose = projectClose;
            vm.getCurrentWatchers = getCurrentWatchers;
            vm.profileClose = profileClose;
            vm.userInfo = Principal.getIdentity();

            vm.DuplicationWatcherIds = [];
            vm.DuplicationRelatedTaskIds = [];

            vm.privateYns = [{"id":false, "name":"공개", icon: 'fa-unlock-alt'},{"id":true,"name":"비공개", icon: 'fa-lock'}];

            vm.stateInfo = $state.current.name;
            vm.modifyYn = true;
            vm.state = $state.get(vm.stateInfo).name.split('.')[0];

            vm.date = new Date();

            $scope.checkedTask = [];
            $scope.checkedTaskIds = [];

            // toggle selection for a given fruit by name
            $scope.toggleSelection = function toggleSelection(fruitName, event) {

                var idx = $scope.checkedTask.indexOf(fruitName);

                // is currently selected
                if (idx > -1) {
                    $scope.checkedTask.splice(idx, 1);
                    $scope.checkedTaskIds.splice(idx, 1);
                }

                // is newly selected
                else {
                    $scope.checkedTask.push(fruitName);
                    $scope.checkedTaskIds.push(fruitName.id);
                }
            };

            /* user picker info */
            $scope.assigneeUser = [];
            $scope.watchers = [];
            $scope.relatedTaskList = [];
            $scope.projectPickerList=[];

            $scope.watcherInfo=''; // 참조자 정보 팝업

            $scope.getToken = function() {
                return $cookies.get("CSRF-TOKEN");
            };
            $scope.getToken()

            /* task info */
            vm.task = {
                name : '',
                id : '',
                startDate : '',
                endDate : '',
                contents : '',
                statusId : 1, //상태
                importantYn : false, //중요여부
                assigneeIds : [],
                watcherIds : [],
                relatedTaskIds : [],
                projectIds : [],
                privateYn : false
            };

            vm.codes = Code.query('', onSuccess, erorr);
            function onSuccess(){
                $("#input-3").fileinput({
                    uploadUrl : '/tasks/uploadFile',
                    task : vm.task,
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
                        $scope.files.push(value)
                    });
                    $scope.$apply();
                    $log.debug("파일 목록 : ", $scope.files);
                }).on('reloadFileList', function(e, params) { // 파일 삭제 시 파일 목록 reload
                    $scope.files = [];
                    angular.forEach(params, function(value){
                        if(value != undefined){
                            $scope.files.push(value)
                        }
                    });
                    $scope.$apply();
                    $log.debug("삭제 후 파일 목록 : ", $scope.files);
                })
            }
            function erorr(){

            }
            vm.taskProject=[];

            vm.subTaskOpen = false;
            vm.fileAreaOpen = false;
            vm.relatedTaskOpen = false;

            vm.relatedSearchYn = true; // 참조작업 검색 오픈 유무
            vm.relatedSearchAgainYn = false;
            vm.relatedSearchSelectedYn = false; // 추가 검색 버튼 오픈 유무
            vm.relatedTaskEmptyYn = false;
            vm.relatedTaskValidateYn = false; // 참조작업 검색 벨리데이션
            vm.relatedSearchForm = {
                name : '',
                assigneeName : '',
                assigneeSelfYn : '',
                createdBySelfYn : '',
                projectId : ''
            }

            /* 프로젝트 목록 */
            vm.projectList = [];
            $scope.projectName = '';

            vm.userList = [];
            vm.userName = '';
            $scope.userName = '';
            vm.watcherName = '';
            vm.relatedTaskName = '';
            // 하위 작업 업데이트 파라미터
            vm.subTaskUpdateForm = {
                id : '',
                assigneeIds : '',
                startDate : '',
                endDate : '',
            }

            /* sub task info */
            vm.subTask = {
                name : '',
                parentId : '',
                assigneeId : '',
                statusId : 1
            };

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
                date: "",
                datepickerOptions: {
                    customClass: '',
                    minDate: new Date(),
                    showWeeks: true
                }
            };

            // max date picker
            this.dueDateTo = {
                date: "",
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
                date: '',
                datepickerOptions: {
                    maxDate: null
                }
            };
            // 하위 작업 일정 종료일
            this.subTaskDueDateTo = {
                date: '',
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

            $log.debug("vm.codes : ", vm.codes);
            $log.debug("vm.vm.userInfo : ", vm.userInfo);

            $scope.files = [];
            // 파일 목록 라이브러리에서 가져오기
            $scope.$on('setTaskAddFiles', function (event, args) {
                //$scope.files = [];
                angular.forEach(args, function(value){
                    $scope.files.push(value)
                });
                $scope.$apply();
                $log.debug("파일 목록 : ", $scope.files);
            });

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
            $scope.pickerFindWatcher = function(name) {

                var userIds = [];
                angular.forEach($scope.watchers, function(val){
                    userIds.push(val.id);
                });

                var excludeUserIds = userIds.join(",");

                findUser.findByNameAndExcludeIds(name, excludeUserIds).then(function(result){
                    $log.debug("watcherList : ", result);
                    vm.watcherList = result;
                }); //user search
            };


            // date 포멧 변경
            $scope.dueDateFrom = '';
            $scope.dueDateTo = '';
            $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
                if(newValue !=undefined && oldValue != newValue){
                    if(vm.dueDateTo.date != undefined && vm.dueDateTo.date != '' && newValue > vm.dueDateTo.date) {
                        toastr.warning('시작일이 종료일보다 큽니다.', '경고');
                        vm.dueDateFrom.date = $scope.dueDateFrom;
                        return;
                    }
                    $scope.dueDateFrom = newValue;
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.startDate= formatDate;
                }

            });
            // date 포멧 변경
            $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
                if(newValue !=undefined && oldValue != newValue){
                    if(vm.dueDateFrom.date != undefined && vm.dueDateFrom.date != '' && newValue < vm.dueDateFrom.date) {
                        toastr.warning('종료일이 시작일보다 작습니다.', '경고');
                        vm.dueDateTo.date = $scope.dueDateTo;
                        return;
                    }
                    $scope.dueDateTo = newValue;
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.endDate = formatDate;
                }
            });
            // 반복작업 시작 시간 포멧 변경(기간)
            $scope.$watch("vm.repeatDueDateFrom.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                    //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.taskRepeatSchedule.startDate = formatDate;
                }
            });
            // 반복작업 종료 시간 포멧 변경(기간)
            $scope.$watch("vm.repeatDueDateTo.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    if(newValue != '') var formatDate = DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                    //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
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
            $scope.subTaskDueDateFrom = '';
            $scope.subTaskDueDateTo = '';
            $scope.$watch("vm.subTaskDueDateFrom.date", function(newValue, oldValue){
                if(newValue !=undefined && oldValue != newValue){
                    if(vm.subTaskDueDateTo.date != undefined && vm.subTaskDueDateTo.date != '' && newValue != '' && newValue > vm.subTaskDueDateTo.date) {
                        toastr.warning('시작일이 종료일보다 큽니다.', '경고');
                        vm.subTaskDueDateFrom.date = $scope.subTaskDueDateFrom;
                        return;
                    }
                    $scope.subTaskDueDateFrom = newValue;
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                    vm.subTaskUpdateForm.startDate = formatDate;
                }
            });
            // 하위 작업 종료 시간 포멧 변경(기간)
            $scope.$watch("vm.subTaskDueDateTo.date", function(newValue, oldValue){
                if(newValue !=undefined && oldValue != newValue){
                    if(vm.subTaskDueDateFrom.date != undefined && vm.subTaskDueDateFrom.date != '' && newValue != '' && newValue < vm.subTaskDueDateFrom.date) {
                        toastr.warning('종료일이 시작일보다 작습니다.', '경고');
                        vm.subTaskDueDateTo.date = $scope.subTaskDueDateTo;
                        return;
                    }
                    $scope.subTaskDueDateTo = newValue;
                    var d = newValue;
                    if(newValue != '') var formatDate = DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                    vm.subTaskUpdateForm.endDate = formatDate;
                }
            });
            // 비공개여부
            $scope.$watchCollection("vm.task.privateYn", function(newValue, oldValue){
                if(oldValue != newValue && newValue != ''){
                    if(newValue) {
                        vm.subTasks = [];
                        vm.subTaskOpen = false;
                        vm.subTask.name = '';
                    }
                }
            });
            // 본인체크시 본인이름 담당자명에 주입
            $scope.$watchCollection("vm.assigneeYn", function(newValue, oldValue){
                if(oldValue != newValue && newValue != ''){
                    if(newValue) vm.assigneeName = vm.userInfo.name;
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

            function updateSubTaskForm(subTask) {

                $log.debug("subTask : ", subTask);
                vm.subTaskUpdateForm = subTask;
                $scope.pickerFindUsers('');
            }

            /* 타스크의 서브타스크 등록 */
            function subTaskSave(){
                //if(vm.subTask.name != '') SubTask.save(vm.subTask, onSubTaskSaveSuccess, onSaveError);
            }

            function onSaveSuccess (result) {
                toastr.success('작업 생성 완료', '작업 생성 완료');
                vm.task.id = result.id;
                vm.subTask.parentId = result.id;
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
                if(vm.state = 'my-task'){
                    $rootScope.$broadcast('taskReload', {listType : 'TODAY'})
                }

            }

            vm.subTasks = [];
            function onSubTaskSaveSuccess (result) {
                toastr.success('하위 작업 생성 완료', '하위 작업 생성 완료');
                getTaskInfo();
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
            /* user picker */
            $scope.findProjects = function(name) {
                $log.debug("name - : ", name);
                var deferred = $q.defer();
                ProjectFindByName.query({name : name},onProjectPickerSuccess, onProjectPickerError)
                function onProjectPickerSuccess(result){
                    deferred.resolve(result);
                    $log.debug("projectList : ", result);
                }
                function onProjectPickerError(){

                }
                return deferred.promise;
            };

            /* task picker */
            //$scope.findTasks = function(name) {
            //    $log.debug("name - : ", name);
            //    var deferred = $q.defer();
            //
            //    return deferred.promise;
            //};

            function taskUpdate(){
                if(vm.task.name == null || vm.task.name == '') {
                    toastr.warning('작업명을 입력하세요', '작업 생성');
                    return false;
                }
                if($scope.assigneeUser != [])userIdPush($scope.assigneeUser, "assigneeIds"); // 담당자
                if($scope.watchers != [])userIdPush($scope.watchers, "watcherIds"); //참조자
                if(vm.task.relatedTaskList != [])userIdPush(vm.task.relatedTaskList, "relatedTaskIds"); //참조 작업
                if(vm.taskProject != [])userIdPush(vm.taskProject, "projectIds"); // 프로젝트
                vm.task.taskRepeatSchedule = vm.taskRepeatSchedule; // 반복작업 주입
                if(vm.task.privateYn) vm.subTasks = []; // 비공개일 시 하위 작업 삭제

                // 하위작업 주입 및 담당자 아이디 주입
                vm.task.subTasks  = vm.subTasks;
                angular.forEach(vm.task.subTasks, function(val, index){
                    val.assigneeIds = [];
                    val.assigneeIds = subTaskUserIdAdd(val.assignees);
                });

                $log.debug("vm.task ;::::::", vm.task);
                $log.debug("파일 목록 ;::::::", $scope.files);
                TaskEdit.saveTask({
                    method : "POST",
                    file : $scope.files,
                    //	data 속성으로 별도의 데이터 전송
                    fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    toastr.success('작업 생성 완료', '작업 생성 완료');
                    $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                        $uibModalInstance.close();
                    }, 100);

                    if(vm.state = 'my-task'){
                        $rootScope.$broadcast('taskReload', {listType : 'TODAY'})
                    }

                });
            }

            function userIdPush(userInfo, type){

                var typeIds = new Array();

                angular.forEach(userInfo, function(val){
                    if(type == 'projectIds')typeIds.push(val);
                    else typeIds.push(val.id);
                });

                vm.task[type] = typeIds.join(",");
            }
            function subTaskUserIdAdd(userInfo, type){
                var typeIds = new Array();
                angular.forEach(userInfo, function(val){
                    typeIds.push(val.id);
                });

                return typeIds;
            }

            //function projectListAdd(project){
            //    $("#projectPickerSection").append('<span class="task-project" ng-click="vm.deleteProjectElement($this)">'+project.name+'<i class="fa fa-close"></i></span>')
            //}

            vm.deleteProjectElement = deleteProjectElement;
            function deleteProjectElement(_this){
                $log.debug(_this)
            }

            // 프로젝트 목록 불러오기
            function getProjectList(){
                ProjectFind.query({name : ''}, onProjectSuccess, onProjectError);
            }
            // 프로젝트목록 필터링
            function FindProjectList(){
                ProjectFindByName.query({name : $scope.projectName},onProjectSuccess, onProjectError)
            }
            function onProjectSuccess (result) {
                vm.projectList = result;
            }
            function onProjectError (result) {
                toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
            }
            getProjectList(); // 프로젝트 목록 불러오기

            // 프로젝트 명 실시간 검색
            $scope.$watchCollection('projectName', function(){
                FindProjectList();
            });

            // 사용자 명 실시간 검색
            $scope.$watchCollection('vm.userName', function(newValue){
                if(newValue != '' && newValue != undefined){
                    $log.debug("vm.userName : ", newValue);
                    $scope.userName = newValue;
                    $scope.pickerFindUsers(newValue);
                }
            });
            // 참조자 명 실시간 검색
            $scope.$watchCollection('vm.watcherName', function(newValue){
                if(newValue != '' && newValue != undefined){
                    $log.debug("vm.watcherName : ", newValue);
                    $scope.watcherName = newValue;
                    $scope.pickerFindWatcher(newValue);
                }
            });
            // 참조자 명 실시간 검색
            $scope.$watchCollection('vm.relatedTaskName', function(newValue){
                if(newValue != '' && newValue != undefined){
                    $log.debug("vm.watcherName : ", newValue);
                    $scope.watcherName = newValue;
                    $scope.pickerFindWatcher(newValue);
                }
            });

            // 참조작업 검색
            function findRelatedTask(){
                if($scope.projectPickerList.length > 0) vm.relatedSearchForm.projectId = $scope.projectPickerList[0].id;
                vm.relatedSearchForm.excludeIds = vm.DuplicationRelatedTaskIds;
                if(vm.relatedSearchForm.name == ''){
                    vm.relatedTaskValidateYn = true;
                }else{
                    FindByCondition.query(vm.relatedSearchForm, getRelatedTaskSuccess, getRelatedTaskErorr);
                }
            }
            function getRelatedTaskSuccess(result){
                $log.debug("참조작업 검색 목록 : ", result);
                vm.relatedTaskList = result;
                if(vm.relatedTaskList.length == 0) {
                    vm.relatedTaskEmptyYn = true;
                    vm.relatedSearchYn = false;
                } else {
                    vm.relatedTaskEmptyYn = false;
                    vm.relatedSearchAgainYn = true;
                    vm.relatedSearchSelectedYn = false;
                    vm.relatedSearchYn = false;
                }
            }
            function getRelatedTaskErorr(){

            }

            /* 하위 작업 저장 */
            function subTaskUserAdd(userId){
                vm.subTaskUpdateForm.assigneeIds = userId;
                subTaskUpdate();
            }
            function subTaskUserRemove(userId){
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

            function getTaskInfo(){
                Task.get({id : vm.task.id}, successTask, erorrTask);
            }
            function successTask(result){
                vm.subTasks = result.subTasks;
            }
            function erorrTask(){

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

            function setWeekday(value){
                var typeIds = [];
                vm.weekDaysArea[value -1].status = !vm.weekDaysArea[value -1].status;
                angular.forEach(vm.weekDaysArea, function(val, index){
                    if(val.status) typeIds.push(index + 1);
                });
                vm.taskRepeatSchedule.weekdays = typeIds.join(",");
            }


            function repeatClose(){
                $rootScope.$broadcast('repeatClose');
            }
            // 반복설정 팝업 닫기
            function subTaskClose(){
                $rootScope.$broadcast('subTaskClose');
            }

            function taskUpload(){
                vm.task.taskRepeatSchedule = vm.taskRepeatSchedule;
                repeatClose();
            }

            // 하위 작업 날짜 폼 입력 및 하위 작업 정보 주입
            function setDatePickerInput(subTask){
                vm.subTaskUpdateForm = subTask;
                vm.subTaskDueDateFrom.date = DateUtils.toDate(subTask.startDate)
                vm.subTaskDueDateTo.date = DateUtils.toDate(subTask.endDate)
            }

            // 참조자 데이터 주입
            function watcherAdd(watcher){
                var index = vm.DuplicationWatcherIds.indexOf(watcher.id);
                if(index > -1){
                    $log.debug("중복")
                }else{
                    vm.DuplicationWatcherIds.push(watcher.id);
                    setCurrentSearchWatcher(watcher)
                    $scope.watchers.push(watcher);
                    if(vm.watcherName != '') $scope.pickerFindWatcher(vm.watcherName);
                }

            }

            // 참조자 데이터 제거
            function removeWatcher(watcher){
                var index = vm.DuplicationWatcherIds.indexOf(watcher.id);
                if(index > -1){
                    vm.DuplicationWatcherIds.splice(index, 1);
                    $scope.watchers.splice(index, 1);
                    if(vm.watcherName != '') $scope.pickerFindWatcher(vm.watcherName);
                }
            }

            // 참조작업 데이터 제거
            function removeRelatedTask(task){
                var index = vm.DuplicationRelatedTaskIds.indexOf(task.id);
                if(index > -1){
                    vm.DuplicationRelatedTaskIds.splice(index, 1);
                    vm.task.relatedTaskList.splice(index, 1);
                }
                var checked = $scope.checkedTaskIds.indexOf(task.id);
                if(index > -1){
                    $scope.checkedTaskIds.splice(checked, 1);
                    $scope.checkedTask.splice(checked, 1);
                }
            }

            //참조자 팝업 닫기
            function watcherPopupClose(){
                $rootScope.$broadcast('watcherPopupClose');
            }

            //참조작업 팝업 닫기
            function relatedTaskPopupClose(){
                $rootScope.$broadcast('relatedTaskPopupClose');
            }

            // 프로젝트 팝업 닫기
            function projectClose(){
                $rootScope.$broadcast('projectPickerAddClose');
            }

            // 프로필 팝업 닫기
            function profileClose(){
                $rootScope.$broadcast("profileClose")
            }


            function watcherInfoAdd(watcher){
                $scope.watcherInfo = watcher;
            }

            function addRelatedTask(){
                var checkList = _.clone($scope.checkedTask);
                vm.task.relatedTaskList = checkList;
                vm.DuplicationRelatedTaskIds = [];
                angular.forEach(vm.task.relatedTaskList, function(value){
                    vm.DuplicationRelatedTaskIds.push(value.id)
                })
                vm.relatedTaskList=[];
                vm.relatedSearchSelectedYn = true;
                vm.relatedSearchYn = false;
                vm.relatedSearchAgainYn = false;
                vm.relatedTaskEmptyYn = false;
            }

            // 참조검색 검색 폼 오픈(추가검색, 재검색, 확인 버튼)
            function relatedTaskFormOpen(){
                vm.relatedTaskList=[];
                vm.relatedSearchSelectedYn = false;
                vm.relatedSearchYn = true;
                vm.relatedSearchAgainYn = false;
                vm.relatedTaskEmptyYn = false;
            }

            /* localStorage 에서 최근 검색한 사용자 가져오기 */
            function getCurrentWatchers(){
                vm.watcherName='';
                var currentSearchWatcher = localStorage.getItem("currentSearchWatcher");
                vm.watchers = [];
                if (angular.isDefined(currentSearchWatcher) && currentSearchWatcher != null) {
                    currentSearchWatcher = JSON.parse(currentSearchWatcher);
                    vm.watcherList = currentSearchWatcher.watchers;
                }
            }

            /* localStorage에 최근 검색한 사용자 주입 */
            function setCurrentSearchWatcher(watcher){
                var currentSearchWatcher = localStorage.getItem("currentSearchWatcher");
                vm.watchers = [];
                if (angular.isDefined(currentSearchWatcher) && currentSearchWatcher != null) {
                    currentSearchWatcher = JSON.parse(currentSearchWatcher);
                    if(currentSearchWatcher.watchers.length >= 3){
                        currentSearchWatcher.watchers.splice(0, 1);
                        vm.watchers = currentSearchWatcher.watchers;
                        vm.watchers.push(watcher);
                        localStorage.setItem("currentSearchWatcher", JSON.stringify({
                            watchers : vm.watchers,
                        }));
                    }else{
                        vm.watchers = currentSearchWatcher.watchers;
                        vm.watchers.push(watcher);
                        localStorage.setItem("currentSearchWatcher", JSON.stringify({
                            watchers : vm.watchers,
                        }));
                    }
                } else {
                    vm.watchers.push(watcher);
                    localStorage.setItem("currentSearchWatcher", JSON.stringify({
                        watchers : vm.watchers,
                    }));
                }
            }

        }

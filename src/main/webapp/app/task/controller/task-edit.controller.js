/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskEditCtrl", taskEditCtrl);
taskEditCtrl.$inject=['$rootScope', '$scope', '$uibModalInstance', 'Code', '$log', 'Task', 'toastr', '$state', '$timeout', 'DateUtils', 'SubTask', 'Principal', 'findUser', '$q', 'TaskEdit', 'FindTasks', 'ProjectFind', 'ProjectFindByName'];
        function taskEditCtrl($rootScope, $scope, $uibModalInstance, Code, $log, Task, toastr, $state, $timeout, DateUtils, SubTask, Principal, findUser, $q, TaskEdit, FindTasks, ProjectFind, ProjectFindByName) {
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
            vm.setDatePickerInput = setDatePickerInput;
            vm.subTaskClose = subTaskClose;
            vm.userInfo = Principal.getIdentity();

            vm.codes = Code.query();

            vm.stateInfo = $state.current.name;
            vm.state = $state.get(vm.stateInfo).name.split('.')[0];

            vm.date = new Date();

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
                statusId : 1, //상태
                importantYn : false, //중요여부
                assigneeIds : [],
                watcherIds : [],
                relatedTaskIds : [],
                projectIds : []
            };
            vm.taskProject=[];

            vm.subTaskOpen = false;
            vm.fileAreaOpen = false;
            vm.relatedTaskOpen = false;

            /* 프로젝트 목록 */
            vm.projectList = [];
            $scope.projectName = '';

            vm.userList = [];
            vm.userName = '';
            $scope.userName = '';
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
            $scope.$on('setFiles', function (event, args) {
                $scope.files = [];
                angular.forEach(args, function(value){
                    $scope.files.push(value)
                });
                $log.debug("파일 목록 : ", $scope.files);
            });

            /* user picker */
            $scope.pickerFindUsers = function(name) {

                findUser.findByName(name).then(function(result){
                    $log.debug("userList : ", result);
                    vm.userList = result;
                }); //user search
            };

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

            vm.subTaskList = [];
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

            function taskUpdate(){
                if(vm.task.name == null || vm.task.name == '') {
                    toastr.warning('작업명을 입력하세요', '작업 생성');
                    return false;
                }
                if($scope.assigneeUser != [])userIdPush($scope.assigneeUser, "assigneeIds");
                if($scope.watchers != [])userIdPush($scope.watchers, "watcherIds");
                if($scope.relatedTaskList != [])userIdPush($scope.relatedTaskList, "relatedTaskIds");
                if(vm.taskProject != [])userIdPush(vm.taskProject, "projectIds");
                vm.task.taskRepeatSchedule = vm.taskRepeatSchedule;

                $log.debug("vm.task ;::::::", vm.task);
                TaskEdit.saveTask({
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
                $log.debug("vm.userName : ", newValue);
                $scope.userName = newValue;
                $scope.pickerFindUsers(newValue);
            });

            /* 하위 작업 저장 */
            function subTaskUserAdd(userId){
                vm.subTaskUpdateForm.assigneeIds = userId;
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
                vm.subTaskList = result.subTasks;
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

        }

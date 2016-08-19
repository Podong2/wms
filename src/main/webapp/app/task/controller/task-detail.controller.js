(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailCtrl', TaskDetailCtrl);

    TaskDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', 'TaskAttachedFile', '$log', 'TaskEdit', 'DateUtils', 'findUser', '$q', '$sce', '$state', 'toastr', 'SubTask', 'FindTasks', 'entity', 'TaskListSearch', 'dataService', 'Principal', 'ProjectFind'];

    function TaskDetailCtrl($scope, $rootScope, $stateParams, Task, Code, TaskAttachedFile, $log, TaskEdit, DateUtils, findUser, $q, $sce, $state, toastr, SubTask, FindTasks, entity, TaskListSearch, dataService, Principal, ProjectFind) {
        var vm = this;

        vm.openCalendar = openCalendar;
        vm.taskUpload = taskUpload;
        vm.renderHtml = renderHtml;
        vm.fileDownLoad = fileDownLoad;
        vm.subTaskSave = subTaskSave;
        vm.createComment = createComment;
        vm.userInfo = Principal.getIdentity();
        $scope.dataService = dataService;

        vm.task = entity;
        vm.date = '';
        vm.assigneeUsers = [];
        vm.logArrayData = [];
        vm.codes = Code.query();
        vm.commentList = [];
        vm.projectList=[];

        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){
            vm.TaskAuditLog = result;
            angular.forEach(vm.TaskAuditLog.data, function(val){
                if(val.entityField == 'reply'){
                    vm.commentList.push(val);
                }
            });
            $log.debug("vm.commentList : ", vm.commentList)
        });

        function getProjectList(){
            ProjectFind.query({name : ''}, onProjectSuccess, onProjectError);
        }
        function onProjectSuccess (result) {
            vm.projectList = result;
            $log.debug("프로젝트 목록 : ", result);
        }
        function onProjectError (result) {
            $log.debug("프로젝트 목록 : ", result);
            toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
        }
        getProjectList();

        vm.responseData = _.clone(vm.task);

        $log.debug("info :", vm.task)
        $log.debug("$stateParams.listType :", $stateParams.listType);


        // 갤러리 썸네일 이미지
        vm.images = [];

        // 코멘트 생성 데이터
        vm.comment = {
            id : vm.userInfo.id,
            taskId : vm.task.id,
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

        /* sub task info */
        vm.subTask = {
            name : '',
            parentId : vm.task.id,
            assigneeId : vm.userInfo.id,
            statusId : 1
        };

        // -------------------  broadcast start ------------------- //
        //$scope.$on("showDetail", function(event, args){
        //    vm.task = [];
        //    Task.get({id : args["id"]}, function(result){
        //        vm.task = result;
        //        vm.responseData = _.clone(vm.task);
        //    })
        //});
        vm.tagArray = [];
        $scope.$on("tagRemoveId", function(event, args){
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
        });
        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setCommentFiles', function (event, args) {
            $scope.commentFiles = [];
            angular.forEach(args, function(value){
                $scope.commentFiles.push(value)
            });
            $log.debug("코멘트 파일 목록 : ", $scope.commentFiles);
        });

        // content 데이터 변경 체크
        $scope.$on('editingUpload', function (event, args) {
            if (!angular.equals(vm.responseData.contents, vm.task.contents)) {
                vm.responseData.contents = vm.task.contents;
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

        $scope.$watchGroup(['vm.task.startDate', 'vm.task.endDate',  'vm.task.statusId', 'vm.task.importantYn'], function(newValue, oldValue){
            if(oldValue[0] != undefined && newValue[0] != undefined && oldValue != newValue) {
                taskUpload();
            }
        });
        $scope.$watchCollection('vm.task.assignees', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                taskUpload();
            }
        });
        $scope.$watchCollection('vm.task.watchers', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                taskUpload();
            }
        });
        $scope.$watchCollection('vm.task.relatedTasks', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                taskUpload();
            }
        });
        $scope.$watchCollection('vm.task.projectIds', function(newValue, oldValue){
            if(oldValue !== newValue) {
                taskUpload();
            }
        });

        // 달력 오픈
        function openCalendar(e, picker) {
            vm[picker].open = true;
        }



        /* 타스크의 서브타스크 등록 */
        function subTaskSave(){
            if(vm.subTask.name != '') SubTask.save(vm.subTask, onSubTaskSaveSuccess, onSaveError);
        }

        function onSubTaskSaveSuccess (result) {
            toastr.success('sub 태스크 생성 완료', 'sub 태스크 생성 완료');
            vm.task = entity;
        }
        function onSaveError () {
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

        /* 타스크 업로드 */
        function taskUpload(){
            if(vm.task.assignees != [])userIdPush(vm.task.assignees, "assigneeIds");
            if(vm.task.watchers != [])userIdPush(vm.task.watchers, "watcherIds");
            if(vm.task.relatedTasks != [])userIdPush(vm.task.relatedTasks, "relatedTaskIds");

            $log.debug("vm.task ;::::::", vm.task);
            TaskEdit.uploadTask({
                method : "POST",
                file : $scope.files,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.task,
                fileFormDataName : "file"
            }).then(function (response) {
                toastr.success('태스크 수정 완료', '태스크 수정 완료');
                //$state.go("my-task", {}, {reload : true});
                $state.go("my-task.detail", {}, {reload : true});
                $rootScope.$broadcast("taskReload", {listType : $stateParams.listType});
                vm.task.removeAssigneeIds = "";
                vm.task.removeWatcherIds = "";
                vm.task.removeRelatedTaskIds ="";
                vm.task.assigneeIds = "";
                vm.task.watcherIds = "";
                vm.task.relatedTaskIds ="";
                vm.task.projectIds = "";
            });
        }

        function userIdPush(userInfo, type){

            var typeIds = new Array();

            angular.forEach(userInfo, function(val){
                typeIds.push(val.id);
            });

            vm.task[type] = typeIds.join(",");
        }


        //	겔러리 썸네일 정보 세팅
        // 이미지 타입
        //function setAttachedFiles(attachedFiles) {
        //    vm.files = [];
        //    vm.files = attachedFiles;
        //    $log.debug("attachedFile : ", attachedFiles);
        //    angular.forEach(attachedFiles, function(val, idx){
        //        var fileType = val.attachedFile.contentType.split('/');
        //        if(!angular.isUndefined(val) && fileType[0] == "image"){
        //            vm.image = {
        //                thumb: window.location.origin + "/api/attachedFile/" + val.attachedFile.id,
        //                img: window.location.origin + "/api/attachedFile/" + val.attachedFile.id,
        //                description: val.attachedFile.name
        //            };
        //            vm.images.push(vm.image);
        //        }
        //    });
        //}

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

        // bootstrap file uploader plugin load
        $("#input-4").fileinput({
            showCaption: false, showUpload: false, uploadUrl:"1", uploadAsync: false
        });
        $("#input-5").fileinput({
            showCaption: false, showUpload: false, uploadUrl:"1", uploadAsync: false
        });

        vm.mentionIds = []; // mention ids
        function createComment(){
            var $mention = $(".comment-area .mentionUser");
            vm.comment.mentionIds = [];
            vm.mentionIds = [];
            angular.forEach($mention, function(value){
                vm.mentionIds.push(value.id);
            });
            commentMentionIdPush(vm.mentionIds);
            TaskEdit.createComment({
                method : "POST",
                file : $scope.commentFiles,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.comment,
                fileFormDataName : "file"
            }).then(function (response) {
                $scope.$emit('wmsApp:taskUpdate', response);
                toastr.success('태스크 코멘트 생성 완료', '태스크 코멘트 생성 완료');
                TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task'}).then(function(result){
                    vm.TaskAuditLog = result;
                    vm.commentList=[];
                    angular.forEach(vm.TaskAuditLog.data, function(val){
                        if(val.entityField == 'reply'){
                            vm.commentList.push(val);
                        }
                    });
                });

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
    }

})();



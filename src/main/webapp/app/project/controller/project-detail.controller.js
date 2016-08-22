(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('projectDetailCtrl', projectDetailCtrl);

    projectDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', '$log', 'ProjectEdit', 'DateUtils', 'findUser', '$q', '$sce', '$state', 'toastr', 'SubTask', 'FindTasks', 'TaskListSearch', 'dataService', 'Principal', 'ProjectFind'];

    function projectDetailCtrl($scope, $rootScope, $stateParams, Task, Code, $log, ProjectEdit, DateUtils, findUser, $q, $sce, $state, toastr, SubTask, FindTasks, TaskListSearch, dataService, Principal, ProjectFind ) {
        var vm = this;

        vm.openCalendar = openCalendar;
        vm.projectUpload = projectUpload;
        vm.renderHtml = renderHtml;
        vm.fileDownLoad = fileDownLoad;
        vm.createComment = createComment;
        vm.userInfo = Principal.getIdentity();
        $scope.dataService = dataService;

        vm.date = '';
        vm.assigneeUsers = [];
        vm.logArrayData = [];
        vm.codes = Code.query();
        vm.commentList = [];
        vm.projectList=[];
        vm.project = $stateParams.project;
        vm.fileAreaOpen = false;


        vm.responseData = _.clone(vm.project);
        $log.debug("vm.project  : ", vm.project );

        vm.project.admin = [{
            id : vm.project.adminId,
            name :  vm.project.adminName
        }];


        // 갤러리 썸네일 이미지
        vm.images = [];

        // 코멘트 생성 데이터
        vm.comment = {
            id : vm.userInfo.id,
            taskId : vm.project.id,
            contents : '',
            mentionIds : [],
            removeAttachedFileIds : ''
        };


        $scope.files = [];

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },
            { status: false },
            { status: false }
        ];

        // min date picker
        vm.dueDateFrom = {
            date: DateUtils.toDate(vm.responseData.startDate),
            datepickerOptions: {
                maxDate: null
            }
        };
        // max date picker
        vm.dueDateTo = {
            date: DateUtils.toDate(vm.responseData.endDate),
            datepickerOptions: {
                minDate: null
            }
        };


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

        TaskListSearch.TaskAudigLog({'entityId' : vm.project.id, 'entityName' : 'Project'}).then(function(result){
            vm.TaskAuditLog = result;
            angular.forEach(vm.TaskAuditLog.data, function(val){
                if(val.entityField == 'reply'){
                    vm.commentList.push(val);
                }
            });
            $log.debug("vm.commentList : ", vm.commentList)
        });

        // -------------------  broadcast start ------------------- //
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
            projectUpload();
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
            if (!angular.equals(vm.responseData.contents, vm.project.contents)) {
                vm.responseData.contents = vm.project.contents;
                projectUpload();
            }
        });

        // -------------------  broadcast end ------------------- //

        // date 포멧 변경
        $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue && newValue != ''){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                vm.project.startDate= formatDate;
            }else if(newValue == ''){
                vm.project.startDate= '';
            }

        });
        // date 포멧 변경
        $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue && newValue != ''){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                vm.project.endDate = formatDate;
            }else if(newValue == ''){
                vm.project.endDate = '';
            }
        });

        $scope.$watchGroup(['vm.project.startDate', 'vm.project.endDate',  'vm.project.statusId', 'vm.project.importantYn'], function(newValue, oldValue){
            if(oldValue[0] != undefined && newValue[0] != undefined && oldValue != newValue) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.admin', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.watchers', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.parentProjectIds', function(newValue, oldValue){
            if(oldValue !== newValue) {
                projectUpload();
            }
        });

        // 달력 오픈
        function openCalendar(e, picker) {
            vm[picker].open = true;
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

        /* 프로젝트 업로드 */
        function projectUpload(){
            vm.project.adminId = vm.project.admin[0].id;
            if(vm.project.projectUsers != [])userIdPush(vm.project.projectUsers, "projectUsers");
            //if(vm.project.relatedTasks != [])userIdPush(vm.project.relatedTasks, "relatedTaskIds");

            $log.debug("vm.project update ;::::::", vm.project);
            ProjectEdit.uploadProject({
                method : "POST",
                file : $scope.files,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.project,
                fileFormDataName : "file"
            }).then(function (response) {
                toastr.success('프로젝트 수정 완료', '프로젝트 수정 완료');
                $state.go("my-project.detail", {}, {reload : true});
                //$rootScope.$broadcast("taskReload", {listType : $stateParams.listType});
                vm.project.removeAssigneeIds = "";
                vm.project.removeWatcherIds = "";
                vm.project.removeRelatedTaskIds ="";
                vm.project.assigneeIds = "";
                vm.project.watcherIds = "";
                vm.project.relatedTaskIds ="";
            });
        }

        function userIdPush(userInfo, type){

            var typeIds = new Array();

            angular.forEach(userInfo, function(val){
                typeIds.push(val.id);
            });

            vm.project[type] = typeIds.join(",");
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

        //setAttachedFiles(vm.project.attachedFiles); // 첨부파일목록 겔러리 세팅

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
            ProjectEdit.createComment({
                method : "POST",
                file : $scope.commentFiles,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.comment,
                fileFormDataName : "file"
            }).then(function (response) {
                $scope.$emit('wmsApp:taskUpdate', response);
                toastr.success('태스크 코멘트 생성 완료', '태스크 코멘트 생성 완료');
                TaskListSearch.TaskAudigLog({'entityId' : vm.project.id, 'entityName' : 'Project'}).then(function(result){
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



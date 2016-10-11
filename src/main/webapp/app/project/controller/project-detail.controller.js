(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('projectDetailCtrl', projectDetailCtrl);

    projectDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', '$log', 'ProjectEdit', 'DateUtils', 'findUser', '$q', '$sce', '$state', 'toastr', 'SubTask', 'FindTasks', 'TaskListSearch', 'dataService', 'Principal', 'ProjectFind', 'ProjectInfo', 'ProjectFindByName', 'tableService', '$cookies', 'projectForm'];

    function projectDetailCtrl($scope, $rootScope, $stateParams, Task, Code, $log, ProjectEdit, DateUtils, findUser, $q, $sce, $state, toastr, SubTask, FindTasks, TaskListSearch, dataService, Principal, ProjectFind, ProjectInfo, ProjectFindByName, tableService, $cookies, projectForm ) {
        var vm = this;
        vm.baseUrl = window.location.origin;
        $log.debug("$stateParams.project : ", $stateParams.project)
        vm.openCalendar = openCalendar;
        vm.projectUpload = projectUpload;
        vm.renderHtml = renderHtml;
        vm.fileDownLoad = fileDownLoad;
        vm.createComment = createComment;
        vm.FindProjectList = FindProjectList;
        vm.projectRemove = projectRemove;
        vm.removeComment = removeComment;
        vm.watcherInfoAdd = watcherInfoAdd;
        vm.profileClose = profileClose;
        //vm.getCurrentWatchers = getCurrentWatchers;
        //vm.setCurrentSearchWatcher = setCurrentSearchWatcher;
        vm.watcherPopupClose = watcherPopupClose;
        vm.watcherAdd = watcherAdd;
        vm.removeWatcher = removeWatcher;
        vm.getTraceLog = getTraceLog;
        vm.commonPopupClose = commonPopupClose;
        vm.memberAdd = memberAdd;
        vm.removeMember = removeMember;
        vm.userInfo = Principal.getIdentity();
        $scope.dataService = dataService;

        $scope.getToken = function() {
            return $cookies.get("CSRF-TOKEN");
        };
        $scope.getToken()

        // bootstrap file uploader plugin load
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

        vm.date = '';
        vm.assigneeUsers = [];
        vm.logArrayData = [];
        vm.codes = Code.query();
        vm.commentList = [];
        vm.projectList = [];
        vm.responseData = [];
        vm.previewFiles = []; // 파일 테이블 목록
        vm.previewFileUrl = []; // 파일 url 목록
        vm.project = getProject();
        vm.fileListYn = false;
        vm.watcherName = '';
        vm.DuplicationWatcherIds = [];

        /* member관련 파라미터 */
        vm.DuplicationMemberIds = [];
        vm.memberSearchYn = false;
        vm.memberFilter = '';
        vm.currentMemberIds= [];

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

        $log.debug("$stateParams.project :" ,projectForm.project);

        function getProject(){
            var previewFile = {
                caption: '',
                size: '',
                url: '',
                key: ''
            };
            // 파일 목록 주입
            vm.projectFiles = $stateParams.project.attachedFiles;
            angular.forEach(vm.projectFiles, function(value, index){
                previewFile.caption = value.name;
                previewFile.locationType = 'Project';
                previewFile.locationId = $stateParams.project.id;
                previewFile.size = byteCalculation(value.size);
                previewFile.url = window.location.origin + "/api/attachedFile/" + value.id;
                previewFile.id = value.id;
                previewFile.contentType = value.contentType;
                var fileInfo = _.clone(previewFile);
                vm.previewFiles.push(fileInfo);
                vm.previewFileUrl.push(previewFile.url);
            });
            $log.debug("vm.previewFiles : ", vm.previewFiles);
            vm.responseData = _.clone(vm.previewFiles);

            fileViewConfig($stateParams.project);

            vm.getTraceLog($stateParams.project.id);

            return $stateParams.project;
        }

        vm.fileAreaOpen = false;

        vm.project.modifyYn = true;// 임시



        vm.responseProjectData = _.clone(vm.project);
        $log.debug("vm.project  : ", vm.project );

        //vm.project.projectAdminIds = vm.project.projectAdmins;
        //vm.project.projectUserIds = vm.project.projectUsers;


        // 갤러리 썸네일 이미지
        vm.images = [];

        // 코멘트 생성 데이터
        vm.comment = {
            id : vm.userInfo.id,
            entityId : vm.project.id,
            entityName : 'Project',
            contents : '',
            mentionIds : [],
            removeAttachedFileIds : ''
        };

        $scope.projectName = '';

        $scope.files = [];

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },
            { status: false },
            { status: false }
        ];

        // min date picker
        vm.dueDateFrom = {
            date: DateUtils.toDate(vm.responseProjectData.startDate),
            datepickerOptions: {
                maxDate: null
            }
        };
        // max date picker
        vm.dueDateTo = {
            date: DateUtils.toDate(vm.responseProjectData.endDate),
            datepickerOptions: {
                minDate: null
            }
        };

        var excludeIds = '';
        function getProjectList(){ //  excludeIds : 속한 프로젝트는 안나오게 처리
            var projectIds = [];
            projectIds.push(vm.project.id);
            angular.forEach(vm.project.projectParents, function(value, index){
                projectIds.push(value.id);
            });
            excludeIds = projectIds.join(",");
            ProjectFind.query({name : '', excludeIds : excludeIds}, onProjectSuccess, onProjectError);
        }
        function FindProjectList(){
            $log.debug($scope.projectName);
            ProjectFindByName.query({name : $scope.projectName, excludeIds : excludeIds},onProjectSuccess, onProjectError)
        }
        function onProjectSuccess (result) {
            vm.projectList = result;
        }
        function onProjectError (result) {
            toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
        }
        getProjectList();
        $scope.$watchCollection('projectName', function(){
            FindProjectList();
        });

        // -------------------  broadcast start ------------------- //
        vm.tagArray = [];
        $scope.$on("tagRemoveId", function(event, args){
            vm.tagArray=[];
            vm.tagArray.push({id : args.id});
            if(args.tagType == "projectUserIds") {
                userIdPush(vm.tagArray, "removeProjectWatcherIds")
            }else if(args.tagType == "projectAdminIds") {
                userIdPush(vm.tagArray, "removeProjectAdminIds")
            }
            projectUpload();
        });

        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setFiles', function (event, args) {
            vm.files = [];
            angular.forEach(args, function(value){
                vm.files.push(value)
            });
            $log.debug("파일 목록 : ", vm.files);
            projectUpload();
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
            if (!angular.equals(vm.responseProjectData.contents, vm.project.contents)) {
                vm.responseProjectData.contents = vm.project.contents;
                projectUpload();
            }
        });

        /* 프로젝트 리로드 */
        $rootScope.$on('project-detail-reload', function(){
            projectDetailReload();
        });

        // -------------------  broadcast end ------------------- //

        // date 포멧 변경
        $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue && newValue != '' && newValue != undefined){
                var formatDate = new Date(newValue).format("yyyy-MM-dd");
                vm.project.startDate= formatDate;
            }else if(newValue == ''){
                vm.project.startDate= '';
            }

        });
        // date 포멧 변경
        $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue && newValue != '' && newValue != undefined){
                var formatDate = new Date(newValue).format("yyyy-MM-dd");
                vm.project.endDate = formatDate;
            }else if(newValue == ''){
                vm.project.endDate = '';
            }
        });

        $scope.$watchGroup(['vm.project.startDate', 'vm.project.endDate',  'vm.project.statusId', 'vm.project.importantYn'], function(newValue, oldValue){
            if( newValue[0] != undefined && oldValue != newValue) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.projectAdmins', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.projectWatchers', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.projectMembers', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.parentProjectIds', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue) {
                vm.projectReload = true;
                projectUpload();
            }
        });
        $scope.$watch('vm.files', function(newValue, oldValue){
            if(oldValue != undefined && newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
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
            if(vm.project.projectAdmins != [])userIdPush(vm.project.projectAdmins, "projectAdminIds");
            if(vm.project.projectWatchers != [])userIdPush(vm.project.projectWatchers, "projectWatcherIds");
            if(vm.project.projectMembers != [])userIdPush(vm.project.projectMembers, "projectMemberIds");

            $log.debug("vm.project update ;::::::", vm.project);
            ProjectEdit.uploadProject({
                method : "POST",
                file : vm.files,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.project,
                fileFormDataName : "file"
            }).then(function (response) {
                toastr.success('프로젝트 수정 완료', '프로젝트 수정 완료');
                if(vm.projectReload) $rootScope.$broadcast('projectReloading');
                $rootScope.$broadcast('projectEditClose');
                vm.project.removeAssigneeIds = "";
                vm.project.removeProjectWatcherIds = "";
                vm.project.removeProjectMemberIds = "";
                vm.project.removeRelatedTaskIds ="";
                vm.project.projectAdminIds = "";
                vm.project.projectUserIds = "";
                vm.projectReload = false;
                vm.responseData = [];
                vm.previewFiles=[];
                vm.previewFileUrl=[];
                //projectDetailReload();
                vm.getTraceLog(vm.project.id);
                //$state.go("my-project.detail", {}, {reload : 'my-project.detail'});
                projectDetailReload();
            });
        }

        function onSuccess(data){
            $log.debug("프로젝트 수정 결과 : ", data.project);
            vm.project = data.project;
            vm.responseProjectData = _.clone(vm.project);
            vm.dueDateFrom.date = DateUtils.toDate(vm.responseProjectData.startDate);
            vm.dueDateTo.date = DateUtils.toDate(vm.responseProjectData.endDate);
            setProjectAttachedFiles();
            vm.project.modifyYn = true;// 임시

            if(vm.uploadType == 'member'){ // 업로드 타입이 맴버 일 시 맴버 목록 리로드
                $scope.pickerFindMember(vm.memberName);
                vm.uploadType = '';
                if(vm.currentMemberIds.length > 0){
                    angular.forEach(vm.currentMemberIds, function(id, index){
                        angular.forEach(vm.project.projectMembers, function(member){
                            if(id == member.id){
                                member.currentYn = true;
                            }
                        })
                    })
                }
            }
        }
        function onError(){

        }

        function projectDetailReload(){
            ProjectInfo.get({projectId : $stateParams.id, listType : 'TOTAL'}, onSuccess, onError);
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

        vm.mentionIds = []; // mention ids
        function createComment(){
            if(vm.comment.contents == '' && $scope.commentFiles.length == 0){
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
            ProjectEdit.createComment({
                method : "POST",
                file : $scope.commentFiles,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.comment,
                fileFormDataName : "file"
            }).then(function (response) {
                $scope.$emit('wmsApp:taskUpdate', response);
                toastr.success('프로젝트 댓글 등록 완료', '프로젝트 댓글 등록 완료');
                $scope.commentFiles = [];
                vm.comment.contents='';

                vm.getTraceLog(vm.project.id);
            });
        }

        function getTraceLog(projectId) {
            vm.commentList=[];
            TaskListSearch.TaskAudigLog({'entityId' : projectId, 'entityName' : 'Project'}).then(function(result){
                vm.TaskAuditLog = result;
                vm.commentList=[];
                angular.forEach(vm.TaskAuditLog.data, function(val){
                    if(val.entityField == 'reply'){
                        vm.commentList.push(val);
                    }
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

        function removeComment(traceLogId) {
            ProjectEdit.removeComment(traceLogId).then(function(response){
                toastr.error('프로젝트 댓글 삭제 완료', '프로젝트 댓글 삭제 완료');
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

        //프로젝트 x 버튼 눌러 삭제
        function projectRemove(projectId){
            vm.project.removeParentProjectIds = projectId;
            vm.projectReload = true;
            projectUpload();
        }


        function setProjectAttachedFiles(){
            var previewFile = {
                caption: '',
                size: '',
                url: '',
                key: ''
            };
            // 파일 목록 주입
            vm.previewFiles=[];
            vm.previewFileUrl=[];
            vm.responseData = [];
            vm.projectFiles = vm.project.attachedFiles;
            angular.forEach(vm.projectFiles, function(value, index){
                previewFile.caption = value.name;
                previewFile.locationType = 'Project';
                previewFile.locationId = vm.project.id;
                previewFile.size = byteCalculation(value.size);
                previewFile.url = window.location.origin + "/api/attachedFile/" + value.id;
                previewFile.id = value.id;
                var fileInfo = _.clone(previewFile);
                vm.previewFiles.push(fileInfo);
                vm.previewFileUrl.push(previewFile.url);
            });
            $log.debug("vm.previewFiles : ", vm.previewFiles);
            vm.responseData = _.clone(vm.previewFiles);

            fileViewConfig();

        }

        function fileViewConfig(project){
            $("#input-4").fileinput({
                uploadUrl : '/api/projects/uploadFile',
                project : project,
                type : 'project',
                token : $scope.getToken(),
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
                $state.go("my-project.detail", {}, {reload : 'my-project.detail'});
            })
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

        function profileClose(){
            $rootScope.$broadcast("profileClose")
        }

        //참조자 팝업 닫기
        function watcherPopupClose(){
            $rootScope.$broadcast('watcherPopupClose');
        }

        function watcherInfoAdd(watcher){
            $scope.watcherInfo = watcher;
        }

        // 참조자 데이터 제거
        function removeWatcher(watcher){
            //$rootScope.$broadcast('watcherPopupClose');
            vm.uploadType = 'watcher';
            vm.project.removeProjectWatcherIds = watcher.id;
            if(vm.watcherName != '') $scope.pickerFindWatcher(vm.watcherName);
            projectUpload();
        }

        // 참조자 명 실시간 검색
        $scope.$watchCollection('vm.watcherName', function(newValue){
            if(newValue != '' && newValue != undefined){
                $log.debug("vm.watcherName : ", newValue);
                vm.watcherName = newValue;
                if(vm.watcherName != '') $scope.pickerFindWatcher(vm.watcherName);
            }
        });

        /* watcher picker */
        $scope.pickerFindWatcher = function(name) {

            var userIds = [];
            angular.forEach(vm.project.projectWatchers, function(val){
                userIds.push(val.id);
            });

            var excludeUserIds = userIds.join(",");
            vm.DuplicationWatcherIds = excludeUserIds;

            findUser.findByNameAndExcludeIds(name, excludeUserIds).then(function(result){
                $log.debug("watcherList : ", result);
                vm.watcherList = result;
            }); //user search
        };

        // 참조자 데이터 주입
        function watcherAdd(watcher){
            var index = vm.DuplicationWatcherIds.split(",").indexOf(watcher.id);
            if(index > -1){
                $log.debug("중복")
            }else{
                //vm.DuplicationWatcherIds.push(watcher.id);
                vm.uploadType = 'watcher';
                //setCurrentSearchWatcher(watcher) // 최근 선택한 사용자 저장
                vm.project.projectWatchers.push(watcher);
                if(vm.watcherName != '') $scope.pickerFindWatcher(vm.watcherName);
                //$rootScope.$broadcast('watcherPopupClose');
            }
        }


        /* localStorage 에서 최근 검색한 사용자 가져오기 */
        //function getCurrentWatchers(){
        //    vm.watcherName='';
        //    var currentSearchWatcher = localStorage.getItem("currentSearchWatcher");
        //    vm.watchers = [];
        //    if (angular.isDefined(currentSearchWatcher) && currentSearchWatcher != null) {
        //        currentSearchWatcher = JSON.parse(currentSearchWatcher);
        //        vm.watcherList = currentSearchWatcher.watchers;
        //    }
        //}

        /* localStorage에 최근 검색한 사용자 주입 */
        //function setCurrentSearchWatcher(watcher){
        //    var currentSearchWatcher = localStorage.getItem("currentSearchWatcher");
        //    vm.watchers = [];
        //    if (angular.isDefined(currentSearchWatcher) && currentSearchWatcher != null) {
        //        currentSearchWatcher = JSON.parse(currentSearchWatcher);
        //        if(currentSearchWatcher.watchers.length >= 3){
        //            currentSearchWatcher.watchers.splice(0, 1);
        //            vm.watchers = currentSearchWatcher.watchers;
        //            vm.watchers.push(watcher);
        //            localStorage.setItem("currentSearchWatcher", JSON.stringify({
        //                watchers : vm.watchers,
        //            }));
        //        }else{
        //            vm.watchers = currentSearchWatcher.watchers;
        //            vm.watchers.push(watcher);
        //            localStorage.setItem("currentSearchWatcher", JSON.stringify({
        //                watchers : vm.watchers,
        //            }));
        //        }
        //    } else {
        //        vm.watchers.push(watcher);
        //        localStorage.setItem("currentSearchWatcher", JSON.stringify({
        //            watchers : vm.watchers,
        //        }));
        //    }
        //}


        function commonPopupClose(){
            $rootScope.$broadcast("commonPopupClose");
        }

        // 맴버 데이터 주입
        function memberAdd(member){
            vm.uploadType = 'member';
            vm.currentMemberIds.push(member.id)
            vm.project.projectMembers.push(member);
            $scope.$apply();
            //$scope.pickerFindMember(vm.memberName);
            //$rootScope.$broadcast('watcherPopupClose');
        }

        // 맴버 명 실시간 검색
        $scope.$watchCollection('vm.memberName', function(newValue){
            if(newValue != '' && newValue != undefined){
                $log.debug("vm.memberName : ", newValue);
                vm.memberName = newValue;
                if(vm.memberName != '') $scope.pickerFindMember(vm.memberName);
            }
        });

        /* member picker */
        $scope.pickerFindMember = function(name) {

            var userIds = [];
            angular.forEach(vm.project.projectMembers, function(val){
                userIds.push(val.id);
            });

            var excludeUserIds = userIds.join(",");
            vm.DuplicationMemberIds = excludeUserIds;

            findUser.findByProjectMemberAndExcludeIds(name, vm.project.id, excludeUserIds).then(function(result){
                $log.debug("memberList : ", result);
                vm.memberList = result;
            }); //user search
        };

        // 맴버 데이터 제거
        function removeMember(member){
            vm.uploadType = 'member';
            vm.project.removeProjectMemberIds = member.id;
            projectUpload();
            //$scope.pickerFindMember(vm.memberName);
        }





        // 프로젝트 파일첨부 테이블 정보
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


    }

})();



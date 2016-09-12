(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('projectDetailCtrl', projectDetailCtrl);

    projectDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', '$log', 'ProjectEdit', 'DateUtils', 'findUser', '$q', '$sce', '$state', 'toastr', 'SubTask', 'FindTasks', 'TaskListSearch', 'dataService', 'Principal', 'ProjectFind', 'ProjectInfo', 'ProjectFindByName', 'tableService', '$cookies'];

    function projectDetailCtrl($scope, $rootScope, $stateParams, Task, Code, $log, ProjectEdit, DateUtils, findUser, $q, $sce, $state, toastr, SubTask, FindTasks, TaskListSearch, dataService, Principal, ProjectFind, ProjectInfo, ProjectFindByName, tableService, $cookies ) {
        var vm = this;
        vm.baseUrl = window.location.origin;

        vm.openCalendar = openCalendar;
        vm.projectUpload = projectUpload;
        vm.renderHtml = renderHtml;
        vm.fileDownLoad = fileDownLoad;
        vm.createComment = createComment;
        vm.FindProjectList = FindProjectList;
        vm.projectRemove = projectRemove;
        vm.removeComment = removeComment;
        vm.userInfo = Principal.getIdentity();
        $scope.dataService = dataService;

        $scope.getToken = function() {
            return $cookies.get("CSRF-TOKEN");
        };
        $scope.getToken()

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

        $log.debug("$stateParams.project :" ,$stateParams.project);

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
                var fileInfo = _.clone(previewFile);
                vm.previewFiles.push(fileInfo);
                vm.previewFileUrl.push(previewFile.url);
            });
            $log.debug("vm.previewFiles : ", vm.previewFiles);
            vm.responseData = _.clone(vm.previewFiles);

            fileViewConfig($stateParams.project);

            return $stateParams.project;
        }

        vm.fileAreaOpen = false;


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


        function getProjectList(){
            ProjectFind.query({name : ''}, onProjectSuccess, onProjectError);
        }
        function FindProjectList(){
            $log.debug($scope.projectName);
            ProjectFindByName.query({name : $scope.projectName},onProjectSuccess, onProjectError)
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



        TaskListSearch.TaskAudigLog({'entityId' : vm.project.id, 'entityName' : 'Project'}).then(function(result){
            vm.TaskAuditLog = result;
            angular.forEach(vm.TaskAuditLog.data, function(val){
                if(val.entityField == 'reply'){
                    vm.commentList.push(val);
                }
            });
        });

        // -------------------  broadcast start ------------------- //
        vm.tagArray = [];
        $scope.$on("tagRemoveId", function(event, args){
            vm.tagArray=[];
            vm.tagArray.push({id : args.id});
            if(args.tagType == "projectUserIds") {
                userIdPush(vm.tagArray, "removeProjectUserIds")
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
            $scope.commentFiles = [];
            angular.forEach(args, function(value){
                $scope.commentFiles.push(value)
            });
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
            if( newValue[0] != undefined && oldValue != newValue) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.projectAdmins', function(newValue, oldValue){
            if(newValue != undefined && oldValue !== newValue && oldValue.length < newValue.length) {
                projectUpload();
            }
        });
        $scope.$watchCollection('vm.project.projectUsers', function(newValue, oldValue){
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
            if(vm.project.projectUsers != [])userIdPush(vm.project.projectUsers, "projectUserIds");

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
                vm.project.removeWatcherIds = "";
                vm.project.removeRelatedTaskIds ="";
                vm.project.projectAdminIds = "";
                vm.project.projectUserIds = "";
                vm.projectReload = false;
                vm.responseData = [];
                vm.previewFiles=[];
                vm.previewFileUrl=[];
                projectDetailReload();
                $scope.getTraceLog(vm.project.id);
                //$state.go("my-project.detail", {}, {reload : true});
            });
        }

        function onSuccess(data){
            $log.debug("프로젝트 수정 결과 : ", data.project);
            vm.project = data.project;
            setProjectAttachedFiles();
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

        // bootstrap file uploader plugin load
        $("#input-5").fileinput({
            showCaption: false, showUpload: false, uploadUrl:"1", uploadAsync: false
        });

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
            ProjectEdit.createComment({
                method : "POST",
                file : $scope.commentFiles,
                //	data 속성으로 별도의 데이터 전송
                fields : vm.comment,
                fileFormDataName : "file"
            }).then(function (response) {
                $scope.$emit('wmsApp:taskUpdate', response);
                toastr.success('프로젝트 댓글 등록 완료', '프로젝트 댓글 등록 완료');
                // TaskListSearch.TaskAudigLog({'entityId' : vm.project.id, 'entityName' : 'Project'}).then(function(result){
                //     vm.TaskAuditLog = result;
                //     vm.commentList=[];
                //     angular.forEach(vm.TaskAuditLog.data, function(val){
                //         if(val.entityField == 'reply'){
                //             vm.commentList.push(val);
                //         }
                //     });
                // });

                $scope.getTraceLog(vm.project.id);
            });
        }

        $scope.getTraceLog = function(projectId) {
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



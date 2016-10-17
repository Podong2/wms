/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectHistoryCtrl", projectHistoryCtrl);
projectHistoryCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', '$rootScope', '$state', 'ProjectHistoryTasksInfo', '$stateParams', 'toastr', 'TaskListSearch', '$sce', 'dataService', 'Principal', 'TaskEdit', '$cookies'];
        function projectHistoryCtrl($scope, Code, $log, Task, AlertService, $rootScope, $state, ProjectHistoryTasksInfo, $stateParams, toastr, TaskListSearch, $sce, dataService, Principal, TaskEdit, $cookies) {
            var vm = this;
            vm.baseUrl = window.location.origin;

            vm.taskHistoryOpen = taskHistoryOpen;
            vm.fileDownLoad = fileDownLoad;
            vm.renderHtml = renderHtml;
            vm.createComment = createComment;
            vm.createCommentFile = createCommentFile;
            vm.removeComment = removeComment;
            vm.getTaskTwoDateHistory = getTaskTwoDateHistory;
            vm.userInfo = Principal.getIdentity();
            vm.tasks=[];
            vm.history = [];
            vm.historyArea = [];
            vm.TaskAuditLog = [];
            $scope.commentFiles = [];
            vm.commentFileAreaOpen = false;

            function getTaskTwoDateHistory(index, taskId){
                TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task', recentYn : true, offset : vm.tasks[index].offset}).then(function(result){
                    $log.debug("이전 내용 더보기 결과 : ", result);
                    if(result.data.length == 0){
                        vm.tasks[index].endDataYn = true;
                    }else{
                        angular.forEach(result.data, function(value){
                            vm.tasks[index].TaskAuditLog.data.push(value)
                        });
                        vm.tasks[index].offset += 2;
                    }

                });
            }

            vm.taskId = '';
            vm.index = 0;
            function createCommentFile(id, index){
                vm.taskId = id;
                vm.index = index;
            }

            $scope.dataService = dataService;

            // 코멘트 생성 데이터
            vm.comment = {
                id : vm.userInfo.id,
                entityId : '',
                entityName : 'Task',
                contents : '',
                mentionIds : [],
                removeAttachedFileIds : ''
            };

            $scope.getToken = function() {
                return $cookies.get("CSRF-TOKEN");
            };
            $scope.getToken()

            // 파일 목록 라이브러리에서 가져오기
            $scope.$on('setCommentFiles', function (event, args) {
                $scope.commentFiles = [];
                angular.forEach(args, function(value){
                    $scope.commentFiles.push(value)
                });
                $scope.$apply();
                $log.debug("코멘트 파일 목록 : ", $scope.commentFiles);
                //createComment();
            });

            // 타스크 목록 불러오기
            function getList(){
                ProjectHistoryTasksInfo.findHistoryTasks($stateParams.id).then(function(result){
                    vm.tasks = result;
                    angular.forEach(vm.tasks, function(val){
                        val.historyArea = false;
                    });
                    $log.debug("vm.tasks : ", vm.tasks);

                    //taskHistoryOpen(0, vm.tasks[0].id, vm.tasks[0].historyArea);
                }, function(reason) {
                    AlertService.error(reason);
                });
            }

            getList();

            function onSuccess(data) {
                vm.tasks = data;
                angular.forEach(vm.tasks, function(val){
                    val.historyArea = false;
                });
                $log.debug("vm.tasks : ", vm.tasks);

                taskHistoryOpen(0, vm.tasks[0].id, vm.tasks[0].historyArea);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            // 타스크 히스토리 오픈&클로즈 처리 및 로그 불러오기
            function taskHistoryOpen(index, taskId, openYn){
                angular.forEach(vm.tasks, function(value, key){
                    value.historyArea = false;
                    //value.TaskAuditLog = [];
                });
                if(!openYn) vm.tasks[index].historyArea = true;
                if(vm.tasks[index].historyArea && vm.tasks[index].TaskAuditLog == undefined){
                    TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task', recentYn : true, offset : 0}).then(function(result){
                        vm.tasks[index].TaskAuditLog = result;
                        vm.tasks[index].offset = 2;
                        vm.tasks[index].endDataYn = false;
                        vm.tasks[index].endDataCloseYn = false;
                    });
                    $log.debug("최초 히스토리 불러오기 : ", vm.tasks)
                }
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

            /* 코멘트 저장 */
            vm.mentionIds = []; // mention ids
            function createComment(taskId, index){
                $log.debug("$scope.commentFiles : ", $scope.commentFiles);

                if(vm.comment.contents == '' && $scope.commentFiles.length == 0){
                    toastr.warning('코멘트를 입력해주세요.', '코멘트 내용');
                    return false;
                }else if($scope.commentFiles.length == 0){
                    vm.comment.entityId = taskId;
                    vm.index = index;
                }else if($scope.commentFiles.length > 0){
                    vm.comment.entityId = vm.taskId;
                }

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
                    toastr.success('태스크 댓글 등록 완료', '태스크 댓글 등록 완료');
                    vm.comment.contents = [];
                    $scope.commentFiles=[];
                    TaskListSearch.TaskAudigLog({'entityId' : vm.comment.entityId, 'entityName' : 'Task'}).then(function(result){
                        vm.tasks[vm.index].TaskAuditLog = result;
                    });

                });
            }

            function removeComment(taskId, index, traceLogId) {
                TaskEdit.removeComment(traceLogId).then(function(response){
                    toastr.error('태스크 댓글 삭제 완료', '태스크 댓글 삭제 완료');
                    TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task'}).then(function(result){
                        vm.tasks[index].TaskAuditLog = result;
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

            $("#input-5").fileinput({
                uploadUrl : '/tasks/uploadFile',
                task : '',
                type : 'task-history',
                token : $scope.getToken(),
                showCaption: false,
                showUpload: true,
                showClose: true,
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
                //createComment();
            }).on('filedeleted', function(event, key) {
                console.log('Key = ' + key);
            });


        }

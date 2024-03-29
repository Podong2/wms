/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectHistoryCtrl", projectHistoryCtrl);
projectHistoryCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', '$rootScope', '$state', 'ProjectHistoryTasksInfo', '$stateParams', 'toastr', 'TaskListSearch', '$sce', 'dataService', 'Principal', 'TaskEdit', '$cookies', 'ProjectFileHistoryList'];
        function projectHistoryCtrl($scope, Code, $log, Task, AlertService, $rootScope, $state, ProjectHistoryTasksInfo, $stateParams, toastr, TaskListSearch, $sce, dataService, Principal, TaskEdit, $cookies, ProjectFileHistoryList) {
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
            vm.projectInfo = '';
            var projectInfo = localStorage.getItem("projectInfo");
            if (angular.isDefined(projectInfo) && projectInfo != null) {
                projectInfo = JSON.parse(projectInfo);
                vm.projectInfo = projectInfo.project;
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

                    taskHistoryOpen(0, vm.tasks[0].id, vm.tasks[0].historyArea, vm.tasks[0].historyType);

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
            function taskHistoryOpen(index, taskId, openYn, type){
                angular.forEach(vm.tasks, function(value, key){
                    value.historyArea = false;
                    //value.TaskAuditLog = [];
                });
                if(!openYn) vm.tasks[index].historyArea = true;
                if(vm.tasks[index].historyArea && vm.tasks[index].TaskAuditLog == undefined){
                    if(type == "SHARED_ATTACHED_FILE"){
                        ProjectFileHistoryList.getFiles({projectId : vm.projectInfo.id, offset : 0, limit : 2}).then(function(result){
                            angular.forEach(result.data.projectFiles, function(value, index){
                                value.sharedAttachedFileSize = byteCalculation(value.sharedAttachedFileSize);
                            });
                            vm.tasks[index].TaskAuditLog = result;
                            vm.tasks[index].offset = 2;
                            vm.tasks[index].endDataYn = false;
                            vm.tasks[index].endDataCloseYn = false;
                            vm.tasks[index].recentYn = true;

                            vm.tasks[index].currentLogs = angular.copy(vm.tasks[index].TaskAuditLog.data.projectFiles);
                            $log.debug("최초 히스토리 불러오기 : ", vm.tasks)
                            $log.debug("최초 히스토리 2일 로그 목록 : ", vm.tasks[index].currentLogs)
                        });

                    }else{
                        TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task', recentYn : true, offset : 0}).then(function(result){ // recentYn : 최근데이터만 가져오는지 여부 체크
                            vm.tasks[index].TaskAuditLog = result;
                            vm.tasks[index].offset = 2;
                            vm.tasks[index].endDataYn = false;
                            vm.tasks[index].endDataCloseYn = false;
                            vm.tasks[index].recentYn = true;

                            vm.tasks[index].currentLogs = angular.copy(vm.tasks[index].TaskAuditLog.data.traceLogs);
                            $log.debug("최초 히스토리 불러오기 : ", vm.tasks)
                            $log.debug("최초 히스토리 2일 로그 목록 : ", vm.tasks[index].currentLogs)
                        });
                    }


                }
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

                    $log.debug("최근 히스토리 날짜 체크 : ", vm.tasks[index].TaskAuditLog.data.traceLogs[vm.tasks[index].TaskAuditLog.data.traceLogs.length -1].createdDate)
                    var today = new Date().format("yyyy-MM-dd");
                    var target = new Date(vm.tasks[index].TaskAuditLog.data.traceLogs[vm.tasks[index].TaskAuditLog.data.traceLogs.length -1].createdDate).format("yyyy-MM-dd");
                    var limit = 0;
                    var offset = 0;
                    if(today == target){ // 최근 히스토리가 오늘인 경우
                        limit = vm.tasks[index].offset;
                        offset = 0;
                    }else{// 최근 히스토리가 오늘이 아닌경우
                        limit = vm.tasks[index].offset + 1;
                        vm.tasks[index].offset += 1;
                        offset = 0;
                    }

                    TaskListSearch.TaskAudigLog({'entityId' : vm.comment.entityId, 'entityName' : 'Task', recentYn : vm.tasks[index].recentYn, offset : offset, limit : limit}).then(function(result){
                        vm.tasks[index].TaskAuditLog = '';
                        vm.tasks[index].TaskAuditLog = result;
                        $log.debug("코멘트 입력 후 히스토리 불러오기 : ", vm.tasks)
                    });

                });
            }

            function removeComment(taskId, index, traceLogId) {
                TaskEdit.removeComment(traceLogId).then(function(response){
                    toastr.error('태스크 댓글 삭제 완료', '태스크 댓글 삭제 완료');
                    TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task', recentYn : vm.tasks[index].recentYn, offset : 0, limit : vm.tasks[index].offset}).then(function(result){
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

            /* 이전내용 가져오기 */
            function getTaskTwoDateHistory(index, taskId, recentYn, type){
                if(!recentYn){
                    vm.tasks[index].recentYn = recentYn;
                    vm.tasks[index].offset = 0;
                    vm.tasks[index].endDataYn = true;
                }
                if(type == "SHARED_ATTACHED_FILE"){
                    ProjectFileHistoryList.getFiles({projectId : vm.projectInfo.id, recentYn : vm.tasks[index].recentYn, offset : vm.tasks[index].offset}).then(function(result){
                        $log.debug("이전 내용 더보기 결과 : ", result);
                        if(result.data.length == 0){
                            vm.tasks[index].endDataYn = true;
                        }else{
                            angular.forEach(result.data.projectFiles, function(value, index){
                                value.sharedAttachedFileSize = byteCalculation(value.sharedAttachedFileSize);
                            });
                            if(!recentYn){
                                vm.tasks[index].TaskAuditLog.data.projectFiles = _.clone(result.data.projectFiles);
                            }else{
                                angular.forEach(vm.tasks[index].TaskAuditLog.data.projectFiles, function(value){
                                    result.data.projectFiles.push(value)
                                });
                                vm.tasks[index].TaskAuditLog.data.projectFiles = _.clone(result.data.projectFiles);
                                vm.tasks[index].offset += 1;
                            }

                        }
                        $log.debug("이전 내용 더보기 결과 : ", vm.tasks[index].TaskAuditLog);
                        $log.debug("이전 내용 최근 2일 : ", vm.tasks[index].currentLogs);

                    });
                }else{
                    TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task', recentYn : vm.tasks[index].recentYn, offset : vm.tasks[index].offset}).then(function(result){
                        $log.debug("이전 내용 더보기 결과 : ", result);
                        if(result.data.length == 0){
                            vm.tasks[index].endDataYn = true;
                        }else{
                            if(!recentYn){
                                vm.tasks[index].TaskAuditLog.data.traceLogs = _.clone(result.data.traceLogs);
                            }else{
                                angular.forEach(vm.tasks[index].TaskAuditLog.data.traceLogs, function(value){
                                    result.data.traceLogs.push(value)
                                });
                                vm.tasks[index].TaskAuditLog.data.traceLogs = _.clone(result.data.traceLogs);
                                vm.tasks[index].offset += 1;
                            }

                        }
                        $log.debug("이전 내용 더보기 결과 : ", vm.tasks[index].TaskAuditLog);
                        $log.debug("이전 내용 최근 2일 : ", vm.tasks[index].currentLogs);

                    });
                }
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

/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectHistoryCtrl", projectHistoryCtrl);
projectHistoryCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', '$rootScope', '$state', 'ProjectInfo', '$stateParams', 'toastr', 'TaskListSearch', '$sce', 'dataService', 'Principal', 'TaskEdit'];
        function projectHistoryCtrl($scope, Code, $log, Task, AlertService, $rootScope, $state, ProjectInfo, $stateParams, toastr, TaskListSearch, $sce, dataService, Principal, TaskEdit) {
            var vm = this;
            vm.baseUrl = window.location.origin;

            vm.taskHistoryOpen = taskHistoryOpen;
            vm.fileDownLoad = fileDownLoad;
            vm.renderHtml = renderHtml;
            vm.createComment = createComment;
            vm.userInfo = Principal.getIdentity();
            vm.tasks=[];
            vm.history = [];
            vm.historyArea = [];
            vm.TaskAuditLog = [];
            $scope.commentFiles = [];
            vm.commentFileAreaOpen = false;

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

            // 파일 목록 라이브러리에서 가져오기
            $scope.$on('setCommentFiles', function (event, args) {
                $scope.commentFiles = [];
                angular.forEach(args, function(value){
                    $scope.commentFiles.push(value)
                });
                $log.debug("코멘트 파일 목록 : ", $scope.commentFiles);
            });

            // 타스크 목록 불러오기
            function getList(){
                ProjectInfo.get({projectId : $stateParams.id, listType : 'TOTAL'}, onSuccess, onError);
            }
        getList();
            function onSuccess(data) {
                vm.tasks = data.tasks;
                angular.forEach(vm.tasks, function(val){
                    val.historyArea = false;
                })
                $log.debug("vm.tasks : ", vm.tasks)
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            // 타스크 히스토리 오픈&클로즈 처리 및 로그 불러오기
            function taskHistoryOpen(index, taskId, openYn){
                angular.forEach(vm.tasks, function(value, key){
                    value.historyArea = false;
                    value.TaskAuditLog = [];
                });
                if(!openYn) vm.tasks[index].historyArea = true;
                if(vm.tasks[index].historyArea){
                    TaskListSearch.TaskAudigLog({'entityId' : taskId, 'entityName' : 'Task'}).then(function(result){
                        vm.tasks[index].TaskAuditLog = result;
                    });
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
                vm.comment.entityId = taskId;
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
                    vm.comment.contents = [];
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


        }

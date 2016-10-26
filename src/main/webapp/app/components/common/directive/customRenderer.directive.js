/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('customRenderer', customRenderer);
customRenderer.$inject=['$compile', '$filter', '$log', '$sce'];
function customRenderer($compile, $filter, $log, $sce) {
    return {
        restrict : "E",
        scope: {
            data: "=",
            rendererCallback: "="
        },
        controller : ['$scope', '$element', '$attrs', '$rootScope', '$sce', 'TaskEdit', '$state', 'ProjectEdit',
            function ($scope, $element, $attrs, $rootScope, $sce, TaskEdit, $state, ProjectEdit) {
                // 첨부 파일 다운로드
                $scope.fileDownLoad = function(key){
                    var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                        iframe.remove();
                    }).attr("src", "/api/attachedFile/" + key.id);
                };
                // 첨부 파일 삭제
                $scope.fileRemove = function(entityName, entityId, attachedFileId){
                    $scope.params = {
                        entityName : entityName,
                        entityId : entityId,
                        attachedFileId : attachedFileId
                    };
                    ProjectEdit.deleteAttachedFile([{entityName : $scope.params.entityName, entityId : $scope.params.entityId, attachedFileId : $scope.params.attachedFileId}]).then(function(result){
                        $log.debug("프로젝트 파일 삭제 : ", result);
                        $rootScope.$broadcast('task-detail-reload')
                        $rootScope.$broadcast('project-detail-reload')
                        $rootScope.$broadcast('project-file-reload')
                    });
                };
                //설명 html 형식으로 표현
                $scope.renderHtml = function(data) {
                    return $sce.trustAsHtml(data);
                };
                $scope.revertTaskContent = function(data){
                    TaskEdit.putContentRevert(data.taskId, data.id).then(function(){
                        $rootScope.$broadcast('task-detail-reload');
                        $rootScope.$broadcast('cancel');
                    });
                };
                $scope.revertProjectContent = function(data){
                    ProjectEdit.putContentRevert(data.entityId, data.id).then(function(){
                        $rootScope.$broadcast('project-detail-reload');
                        $rootScope.$broadcast('cancel');
                    });
                };

                $scope.setUserInfo = function(user){
                    $scope.userInfo = user;
                };

                $scope.profileClose = function (){
                    $rootScope.$broadcast("profileClose")
                };


        }],
        link: function (scope, element, attrs) {
            /*	change value는 목록 화면에서 팝업을 통해 responseData값이 변경되었을 때
             * 	responseData의 값 변경을 스코프가 감지 못하는 현상때문에 changeValue 스코프 값
             * 	변경을 통해 감지 - ex_) project.ctrl
             */
            function renderer() {
                var rendererType = attrs["property"];
                var index = attrs["index"];
                var tableAttr = attrs["tableAttr"]; //  테이블 dAttr 값
                var customTag = "";

                element.empty();

                if (scope.data === undefined) {
                    if (scope.tableData != null) {
                        scope.data = scope.tableData[index];
                    }
                }

                function getTimeStamp() {
                    var d = new Date();
                    var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2) + '-' + leadingZeros(d.getDate(), 2);
                    return s;
                }

                function leadingZeros(n, digits) {
                    var zero = '';
                    n = n.toString();

                    if (n.length < digits) {
                        for (var i = 0; i < digits - n.length; i++)
                            zero += '0';
                    }
                    return zero + n;
                }

                switch (rendererType) {
                    case "config" :
                        customTag = "<a owl-btn-link link-type='edit' ui-sref='task.edit({id \: " + scope.data.id + "})' href='#/task/" + scope.data.id + "/edit'></a>";
                        break;
                    case "TASK_NAME_EDIT" :
                        customTag =
                            "<div class='taskEdit'>" +
                            "<div class='btn btn-default pull-right glyphicon glyphicon-pencil edit-btn' toggle-event></div>" +
                            "<a ui-sref='task-detail({id \: " + scope.data.id + "})' href='#/task/" + scope.data.id + "/edit'>"+ scope.data.name +"</a>" +
                            "<input type='text' class='form-control col-xs-2 title-focus' ng-model='data.name' id='searchQuery' bindonce placeholder='태스크 이름' aria-invalid='false' enter-submit='rendererCallback(data)' ng-blur='rendererCallback(data)'>" +
                            "</div>";
                        break;
                    case "field_edit" :
                        customTag =
                            "<div class='taskEdit'>" +
                            "<div class='btn btn-default pull-right glyphicon glyphicon-pencil edit-btn' toggle-event></div>" +
                            "<a href='#'>"+ scope.data.name +"</a>" +
                            "<input type='text' class='form-control col-xs-2 title-focus' ng-model='data.name' bindonce id='searchQuery' aria-invalid='false' enter-submit='rendererCallback(data)' ng-blur='rendererCallback(data)'>" +
                            "</div>";
                        break;
                    case "file_name" :
                        var contentType = scope.data.contentType.split('/');
                        if(contentType[0] == 'image'){
                            customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-image-o'></i>"
                        }else {
                            if(contentType[1] == 'msword') customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-word-o'></i>";
                            else if(contentType[1] == 'pdf') customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-pdf-o'></i>";
                            else if(contentType[1] == 'excel') customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-excel-o'></i>";
                            else if(contentType[1] == 'vnd.ms-powerpoint') customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-powerpoint-o'></i>";
                            else customTag = "<div class='word-break-all' style='width: 200px;'><i class='fa fa-file-text-o'></i>";
                        }

                        $log.debug("scope.data.locationType : ", scope.data.locationType);

                        customTag += " <span ng-click='fileDownLoad(3)'>"+ scope.data.name + "</span></div>";
                        break;
                    case "file_location" :

                        if(scope.data.locationType == 'TASK') {
                            customTag = "<a ui-sref='my-task.detail({id \: " + scope.data.locationId + ", listType : \"TODAY\"})' >" + scope.data.location + "</a>";
                        } else if(scope.data.locationType == 'TASK_REPLY'){
                            customTag = "<span>[댓글]</span> <a ui-sref='my-task.detail({id \: " + scope.data.locationId + ", listType : \"TODAY\"})' >"+ scope.data.location +"</a>";
                        } else if(scope.data.locationType == 'PROJECT_REPLY'){
                            customTag = "<span>[댓글]</span> <a ui-sref='my-project({id \: " + scope.data.locationId + "})' >"+ scope.data.location +"</a>";
                        } else {
                            customTag = "<a ui-sref='my-project({id \: " + scope.data.locationId + "})' >"+ scope.data.location +"</a>";
                        }

                        break;
                    case "file_download" :
                            customTag = "<button type='button' class='btn' ng-click='fileDownLoad(data)'><i class='fa fa-download'></i></button>";
                        break;
                    case "file_upload" :
                            customTag = "<button type='button' class='btn'><i class='fa fa-upload'></i></button>";
                        break;
                    case "file_remove" :
                            customTag = "<button type='button' class='btn' ng-click='fileRemove(data.locationType, data.locationId, data.id)'><i class='fa fa-trash'></i></button>";
                        break;
                    case "revert_task_content" :
                            customTag = "<span class='display-content'>본문내용" +
                                "<span class='revert-content' ng-bind-html='renderHtml(data.newValue)'></span>" +
                                "</span>";
                        break;
                    case "set_task_content" :
                        customTag = "<button type='button' class='btn' ng-click='revertTaskContent(data)'><i class='fa fa-download'></i></button>";
                        break;
                    case "set_project_content" :
                        customTag = "<button type='button' class='btn' ng-click='revertProjectContent(data)'><i class='fa fa-download'></i></button>";
                        break;
                    case "file_version" :
                        customTag = "<span>-</span>";
                        break;
                    case "project-date" :
                        if(scope.data.startDate != '' || scope.data.endDate != '') customTag = "<span>"+ scope.data.startDate + "<span ng-show='data.startDate != \"\" && data.endDate != \"\"'>~</span>" + scope.data.endDate +"</span>";
                        else customTag = "<span>-</span>";
                        break;
                    case "project-task-count" :
                        if(scope.data.taskCompleteCount != 0 || scope.data.taskTotalCount != 0) customTag = "<span>"+ scope.data.taskCompleteCount + "<span>/</span>" + scope.data.taskTotalCount +"</span>";
                        else customTag = "<span>-</span>";
                        break;
                    case "project-task-percent" :
                        if(scope.data.taskPercent.width != '') customTag = "<span>"+ scope.data.taskPercent.width + "</span>";
                        else customTag = "<span>-</span>";
                        break;
                    case "project-member" :
                        if(scope.data.projectMembers.length > 0) {
                            customTag = "<div class='position-relative'><span class='cursor' common-popup-toggle>"+ scope.data.projectMembers.length + "명</span>";
                            customTag += '<div class="member-popup-area text-left common" users="data.projectMembers" type="member" common-users-popup></div></div>';
                        }
                        else customTag = "<div><span>-</span>";

                        break;
                    case "project-watcher" :
                        if(scope.data.projectWatchers.length > 0) {
                            customTag = "<div class='position-relative'><span class='cursor' common-popup-toggle>"+ scope.data.projectWatchers.length + "명</span>";
                            customTag += '<div class="member-popup-area text-left common" users="data.projectWatchers" type="watcher" common-users-popup></div></div>';
                        }
                        else customTag = "<span>-</span>";
                        break;
                    case "project-admin" :
                        if(scope.data.projectAdmins.length > 0) {
                            customTag += "<ul class='list-inline friends-list' style='margin-bottom: 0'>";

                            angular.forEach(scope.data.projectAdmins, function(value, index){
                                if(index < 3)
                                customTag += "<li>" +

                                    "<div class='row watcher-picker-info'>" +
                                    "<div class='col-md-4 padding-10 text-center' style='border-right:1px solid #ddd; height: 100%;'>" +
                                    "<img ng-src='/api/attachedFile/"+ value.profileImageId +"' ng-if='"+ value.profileImageId +" !=null' />" +
                                    "<img ng-src='/content/images/demo/male.png' ng-if='"+ value.profileImageId +" ==null' />" +
                                    "</div>" +
                                    "<div class='col-md-8 padding-10' style='height: 100%;'>" +
                                    "<i class='fa fa-close cursor pull-right' ng-click='profileClose()'></i>" +
                                    "<ul>" +
                                    "<li>"+value.name+"</li>" +
                                    "<li>"+(value.phone == null ? '' : value.phone)+"</li>" +
                                    "<li>"+value.email+"</li>" +
                                    "</ul></div></div>" +

                                    "<span class='cursor' sub-task-user-info-btn-toggle>" + value.name + "<span ng-if='"+ (index + 1) +" != data.projectAdmins.length'>,</span></span></li>";
                            });
                            if(scope.data.projectAdmins.length > 3){
                                customTag +=
                                    "<li class='position-relative'>" +
                                        "<span common-popup-toggle>" +
                                        "<span class='activity'>" +
                                        "<a class='position-relative'>… <i class='fa fa-play'></i></a>" +
                                        "</span>" +
                                        "</span>" +
                                        "<div class='other-users-popup'>" +
                                            "<ul class='' style='margin-bottom: 0'>";
                                angular.forEach(scope.data.projectAdmins, function(value, index){
                                    if(index > 2)
                                        customTag += "<li class='clear-both text-left'>" +

                                            "<div class='row common-picker-info'>" +
                                            "<div class='col-md-4 padding-10 text-center' style='border-right:1px solid #ddd; height: 100%;'>" +
                                            "<img ng-src='/api/attachedFile/"+ value.profileImageId +"' ng-if='"+ value.profileImageId +" !=null' />" +
                                            "<img ng-src='/content/images/demo/male.png' ng-if='"+ value.profileImageId +" ==null' />" +
                                            "</div>" +
                                            "<div class='col-md-8 padding-10' style='height: 100%;'>" +
                                            "<i class='fa fa-close cursor pull-right' ng-click='profileClose()'></i>" +
                                            "<ul>" +
                                            "<li>" + value.name + "</li>" +
                                            "<li>" + value.phone + "</li>" +
                                            "<li>" + value.email + "</li>" +
                                            "</ul></div></div>"+
                                            "<div class='cursor' common-user-info-btn-toggle>"+ value.name + "</div></li>";
                                });

                                customTag += "</ul>" +
                                        "</div>" +
                                    "</li>" ;
                            }

                            customTag += "</ul>";

                        } else customTag = "<span>-</span>";
                        break;
                    case "project-update-date" :

                        var date = prettyDate(scope.data.lastModifiedDate);

                        if(scope.data.lastModifiedDate != '') customTag = "<span>"+ date + "</span>";
                        else customTag = "<span>-</span>";
                        break;
                    case "project-status" :
                        if(scope.data.statusId > 0){
                            switch (scope.data.statusId){
                                case 1 : customTag = "<span>활성</span>";break;
                                case 2 : customTag = "<span>완료</span>";break;
                                case 3 : customTag = "<span>보류</span>";break;
                                case 4 : customTag = "<span>취소</span>";break;
                                default : customTag = "<span>-</span>";break;
                            }
                        } else if(scope.data.statusId == null){
                            customTag = "<span>-</span>";
                        }
                        break;
                    case "project-name" :
                        if(scope.data.depth == undefined) scope.data.depth = 0;
                        var depth = '';
                        for(var i =0; i < scope.data.depth; i ++){
                            depth += '<span style="margin-left: 5px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
                        }
                        var userType = '';
                        if(scope.data.adminYn) userType = "<span class='project-list-title-length' style='font-size:11px;'>(관리자 <i class='fa fa-user'></i>)</span>";
                        else if(scope.data.memberYn) userType = "<span class='project-list-title-length' style='font-size:11px;'>(맴버 <i class='fa fa-users'></i>)</span>";
                        else if(scope.data.watcherYn) userType = "<span class='project-list-title-length' style='font-size:11px;'>(공유 <i class='fa fa-eye'></i>)</span>";

                        if(scope.data.depth == 0) customTag = "<div data-ui-sref='my-project({id:data.id})'><strong class='project-list-title-length' tooltip-placement='top-left' uib-tooltip='"+ scope.data.name +"'>" +"<i class='fa fa-angle-down' ng-if='!data.childsYn'></i> " + scope.data.name + "</strong>" + userType + "</div>" ;
                        else customTag = "<div data-ui-sref='my-project({id:data.id})'><span class='project-list-title-length' tooltip-placement='top-left' uib-tooltip='"+ scope.data.name +"'> "+ depth +"<i class='fa fa-angle-down' ng-if='!data.childsYn'></i> "+ scope.data.name + "</span>" + userType + "</div>" ;
                        break;
                }

                var linkFn = $compile(customTag);
                var content = linkFn(scope);
                element.append(content);
            }

            var watchFunc = function (newValue, oldValue) {
                renderer();
            }

            if (scope.changeValue != null) {
                scope.$watch("changeValue", watchFunc);
            }
            else {
                renderer();
            }

            /* 날짜 분전, 시간전, 일전, 주전 표현 */
            function prettyDate(time){
                var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ").split(".")[0]),
                    diff = (((new Date()).getTime() - date.getTime()) / 1000);

                diff = diff - 33000;
                if(diff < 0) diff = 0;
                var day_diff = Math.floor(diff / 86400);

                if ( isNaN(day_diff) || day_diff < 0 )
                    return;

                return day_diff == 0 && (
                    diff < 60 && "방금전" ||
                    diff < 120 && "1분전" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " 분전" ||
                    diff < 7200 && "1 시간전" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " 시간전") ||
                    day_diff <= 1 && new Date(time).format("yyyy-MM-dd") ||
                    day_diff < 7 && new Date(time).format("yyyy-MM-dd") ||
                    day_diff < 31 && new Date(time).format("yyyy-MM-dd") ||
                    day_diff < 360 && new Date(time).format("yyyy-MM-dd") ||
                    day_diff >= 360 && new Date(time).format("yyyy-MM-dd")
            }
        }
    }
}

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
        controller : ['$scope', '$element', '$attrs', '$rootScope', 'ProjectEdit',
            function ($scope, $element, $attrs, $rootScope, ProjectEdit) {
            // 첨부 파일 다운로드
            $scope.fileDownLoad = function(key){
                $log.debug("다운로드")
                var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                    iframe.remove();
                }).attr("src", "/api/attachedFile/" + key.id);
            };
            // 첨부 파일 삭제
            $scope.fileRemove = function(entityName, entityId, attachedFileId){
                $scope.params = {
                    entityName : entityName,
                    entityId : entityId,
                    attachedFileId : attachedFileId,
                };
                ProjectEdit.deleteAttachedFile($scope.params).then(function(result){

                });
            }
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
                            customTag = "<i class='fa fa-file-image-o'></i>"
                        }else {
                            if(contentType[1] == 'msword') customTag = "<i class='fa fa-file-word-o'></i>";
                            else if(contentType[1] == 'pdf') customTag = "<i class='fa fa-file-pdf-o'></i>";
                            else if(contentType[1] == 'excel') customTag = "<i class='fa fa-file-excel-o'></i>";
                            else if(contentType[1] == 'vnd.ms-powerpoint') customTag = "<i class='fa fa-file-powerpoint-o'></i>";
                            else customTag = "<i class='fa fa-file-text-o'></i>";
                        }
                        customTag += " <span ng-click='fileDownLoad(3)'>"+ scope.data.name + "</span>";
                        break;
                    case "file_location" :
                        if(scope.data.locationType == 'TASK'){
                            customTag = "<a ui-sref='my-task.detail({id \: " + scope.data.locationId + ", listType : \"TODAY\"})' >"+ scope.data.location +"</a>";
                        }else{
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
                            customTag = "<button type='button' class='btn' ng-click='fileRemove(data.locationType, data.locationId, data.id)'><i class='fa fa-trash'></i>" + scope.data + "</button>";
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
        }
    }
}

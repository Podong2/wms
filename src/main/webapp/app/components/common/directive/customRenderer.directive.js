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
            scope: "=data",
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
                        if (scope.vm.responseData.data != null) {
                            scope.data = scope.vm.responseData.data[index];
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
                        case "issue_detail" :
                            customTag =
                                "<div class='taskEdit'>" +
                                    "<button class='btn btn-default pull-right' toggle-event><span class='glyphicon glyphicon-pencil'></span> </button>" +
                                    "<a ui-sref='task-detail({id \: " + scope.data.id + "})' href='#/task/" + scope.data.id + "/edit'>"+ scope.data.name +"</a>" +
                                    "<input type='text' class='form-control col-xs-2' ng-model='row.name' id='searchQuery' placeholder='태스크 검색' aria-invalid='false' enter-submit='vm.singleUpload(row)' ng-blur='vm.singleUpload(row)'>" +
                                "</div>";
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

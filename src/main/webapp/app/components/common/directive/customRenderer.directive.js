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
                        if (scope.responseData.data != null) {
                            scope.data = scope.responseData.data[index];
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
                        case "test" :
                            customTag = "<a owl-btn-link link-type='edit'></a>";
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

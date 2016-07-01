/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
'use strict';

angular.module('wmsApp')
    .directive('pickerSearch', pickerSearch);
pickerSearch.$inject=['$document', '$log']
        function pickerSearch($document, $log) {

        function removeTarget (list, target) {
            var tempList = [];

            angular.forEach(list, function (listTarget, index) {
                if (target.id != listTarget.id) {
                    tempList.push(listTarget);
                }
            });
            return tempList;
        }

        return {
            restrict: 'E',
            required : "ngModel",
            scope: {
                source : '&',
                search : '=search',
                save : '=ngModel'
            },
            replace : false,
            templateUrl : 'app/components/userPicker/pickerSearch.html',
            controller : ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {
                $scope.serverList = [];    //  전체 목록
                $scope.text = "";


                var $dropdownTrigger = $element.children()[0];

                $scope.toggleDropdown = function () {
                    $scope.open = !$scope.open;
                };

                $scope.settings = {
                    closeOnBlur: true
                };

                if ($scope.settings.closeOnBlur) {
                    $("body").on('click', function (e) {
                        var target = e.target.parentElement;
                        var parentFound = false;

                        while (angular.isDefined(target) && target !== null && !parentFound) {
                            if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                if(target === $dropdownTrigger) {
                                    parentFound = true;
                                }
                            }
                            target = target.parentElement;
                        }

                        if (!parentFound) {
                            $scope.$apply(function () {
                                $scope.open = false;

                                if($scope.save != null){
                                    $log.debug("$scope.save : ", $scope.save);
                                    $rootScope.$broadcast("assigneeEditingConfig", $scope.save);
                                }
                            });
                        }

                    });
                }

                $scope.close = function () {
                    $scope.open = false;
                };

                //  서버에서 내려온 데이터를 선택했을 때
                $scope.targetSelect = function (target) {
                    target.checked = !target.checked;

                    if (target.checked) {
                        $scope.save.push(target);
                        var temp = [];
                        for (var userCount in $scope.serverList) {
                            if ($scope.serverList[userCount].id != target.id) {
                                temp.push($scope.serverList[userCount]);
                            }
                        }
                        $scope.serverList = temp;
                    }
                    else {
                        $scope.save = removeTarget($scope.save, target);
                    }
                }

                //  선택되었던 데이터를 체크해제 했을때
                $scope.selectTargetSelect = function (selectTarget) {
                    selectTarget.checked = !selectTarget.checked;
                    if (!selectTarget.checked) {
                        $scope.save = removeTarget($scope.save, selectTarget);
                        $scope.save = $scope.save;

                        if ($scope.serverList.length < 5) {
                            $scope.serverList.push(selectTarget);
                        }
                    }
                }

                $scope.getSelectName = function () {
                    var selectNames = "";
                    for (var count in $scope.save) {
                        selectNames += $scope.save[count].name + ",";
                    }

                    return selectNames;
                }
            }],
            link: function (scope, element, attrs) {
                //  제어 이벤트 : 시작
                var nextObj = $(element).find("ul:first").next();
                $(element).find("ul:first").find("li:first").click(function () {
                    $(nextObj).toggle();
                });

                $(element).find(".picker_close").click(function () {
                    $(nextObj).toggle();
                });

                // 제어 이벤트 : 종료

                var blank_pattern = /^\s+|\s+$/g;

                element.keyup(function () {
                    if (element.val().length > 0) {
                        if (element.val().replace(blank_pattern, '') == "") {
                            element.val("");
                            return false;
                        }
                    }

                    //  고립 스코프에서 외부 스코프에 값 전달.
                    scope.search = angular.copy(scope.text);
                    scope.$apply();
                    scope.source().then(function (response) {
                        scope.serverList = response;
                    });
                });
            }
        }
    }

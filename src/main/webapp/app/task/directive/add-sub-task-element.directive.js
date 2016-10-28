/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsAddSubTaskElement', wmsAddSubTaskElement)
    .directive('wmsSubTaskUserAdd', wmsSubTaskUserAdd)
    .directive('wmsSubTaskUserRemove', wmsSubTaskUserRemove)
    .directive('wmsRelatedTaskUserRemove', wmsRelatedTaskUserRemove)
    .directive('wmsSubTaskDateAdd', wmsSubTaskDateAdd);
wmsAddSubTaskElement.$inject=['$log', '$compile', '$rootScope'];
wmsSubTaskUserAdd.$inject=['$log', '$rootScope'];
wmsSubTaskUserRemove.$inject=['$log'];
wmsRelatedTaskUserRemove.$inject=['$log'];
wmsSubTaskDateAdd.$inject=['$log'];
/**
 * 하위작업 추가
 * @param $log
 * @param $compile
 * @param $rootScope
 * @returns {{restrict: string, scope: {taskName: string, subTasks: string}, controller: *[], link: link}}
 */
function wmsAddSubTaskElement($log, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope : {
                taskName : '=ngModel',
                subTasks : '=subTasks'
            },
            controller : ['$scope', function ($scope) {
                $scope.subTask = {
                    name : '',
                    parentId : '',
                    assigneeId : '',
                    statusId : 1,
                    assignees : [],
                    startDate : '',
                    endDate : '',
                    duplicateUserIds : []
                };
                $scope.addSubTask = function(name){
                    $scope.subTask.name = name;
                    var subTaskInfo = _.clone($scope.subTask);
                    $scope.subTasks.push(subTaskInfo);
                    $scope.subTask = {
                        name : '',
                        parentId : '',
                        assigneeId : '',
                        statusId : 1,
                        assignees : [],
                        startDate : '',
                        endDate : '',
                        duplicateUserIds : []
                    };
                    $scope.$apply();
                };
            }],
            link: function (scope, element, attrs) {
                element.on('keypress', function(e){
                    if (e.which == 13) {/* 13 == enter key@ascii */
                        if(scope.taskName != ''){
                            scope.addSubTask(scope.taskName);
                            scope.taskName ='';
                            scope.$apply();
                        }
                    }

                });

            }
        }
    }
/**
 * 하위 작업 사용자 입력
 * @param $log
 * @returns {{restrict: string, scope: {user: string, subTask: string}, controller: *[], link: link}}
 */
function wmsSubTaskUserAdd($log, $rootScope) {
        return {
            restrict: 'A',
            scope : {
                user : '=user',
                subTask : '=subTask',
                elementValue : '=elementValue',
                elementFind : '&'
            },
            controller : ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                element.on('click', function(e){
                        var index = scope.subTask.duplicateUserIds.indexOf(scope.user.id);
                        if(index > -1){
                            $log.debug("이미 존재")
                        }else{
                            var subTask = _.clone(scope.subTask);
                            var subTaskUser = _.clone(scope.user);
                            subTask.assignees.push(subTaskUser);
                            subTask.duplicateUserIds.push(subTaskUser.id);
                            scope.$apply();
                            scope.elementFind()(scope.elementValue).then(function(){
                                $rootScope.$broadcast("initArrayArrows")
                            })
                        }
                });

            }
        }
    }
/**
 * 하위 작업 사용자 제거
 * @param $log
 * @returns {{restrict: string, scope: {user: string, subTask: string}, controller: *[], link: link}}
 */
function wmsSubTaskUserRemove($log) {
        return {
            restrict: 'A',
            scope : {
                user : '=user',
                subTask : '=subTask'
            },
            controller : ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                element.on('click', function(e){
                        var index = scope.subTask.assignees.indexOf(scope.user);
                        if(index > -1){
                            $log.debug(scope.user.name, " 삭제");
                            scope.subTask.assignees.splice(index, 1);
                            scope.subTask.duplicateUserIds.splice(index, 1);
                            scope.$apply();
                        }
                });

            }
        }
    }
/**
 * 하위 작업 사용자 제거
 * @param $log
 * @returns {{restrict: string, scope: {user: string, subTask: string}, controller: *[], link: link}}
 */
function wmsRelatedTaskUserRemove($log) {
        return {
            restrict: 'A',
            scope : {
                user : '=user',
                relatedTask : '=relatedTask'
            },
            controller : ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                element.on('click', function(e){
                        var index = scope.relatedTask.indexOf(scope.user);
                        if(index > -1){
                            $log.debug(scope.user.name, " 삭제");
                            scope.relatedTask.splice(index, 1);
                            scope.subTask.duplicateUserIds.splice(index, 1);
                            scope.$apply();
                        }
                });

            }
        }
    }
/**
 * 하위 작업 달력 입력(대기 미사용)
 * @param $log
 * @returns {{restrict: string, scope: {user: string, subTask: string}, controller: *[], link: link}}
 */
function wmsSubTaskDateAdd($log) {
        return {
            restrict: 'A',
            scope : {
                user : '=user',
                subTask : '=subTask'
            },
            controller : ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                element.on('click', function(e){
                        var index = scope.subTask.assignees.indexOf(scope.user);
                        if(index > -1){
                            $log.debug("이미 존재")
                        }else{
                            var subTask = _.clone(scope.subTask);
                            var subTaskUser = _.clone(scope.user);
                            subTask.assignees.push(subTaskUser);
                            scope.subTask.push(subTask);
                            scope.$apply();
                        }
                });

            }
        }
    }

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsAddProjectElement', wmsAddProjectElement);
wmsAddProjectElement.$inject=['$log', '$compile', '$rootScope'];
function wmsAddProjectElement($log, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope : {
              project : '=ngModel',
              taskProject : '=taskProject'
            },
            controller : ['$scope', function ($scope) {
                $scope.addProjectId = function(id){
                    $scope.taskProject = [];
                    $scope.taskProject.push(id);
                }
                $scope.projectDelete = function(id, event){
                    event.target.parentElement.remove()
                    var index = $scope.taskProject.indexOf(id);
                    if(index > -1){
                        $scope.taskProject.splice(index, 1);
                    }
                }

            }],
            link: function (scope, element, attrs) {
                element.on('click', function(){
                    if(scope.taskProject.indexOf(scope.project.id) == -1){
                        var template = '<span class="task-project" ng-click="vm.deleteProjectElement($this)" wms-close-btn-display type="project">'+scope.project.name+'<i class="fa fa-close project-close-btn close-btn" ng-click="projectDelete(project.id, $event)"></i></span>';
                        scope.addProjectId(scope.project.id);
                        var linkFn = $compile(template);
                        var content = linkFn(scope);
                        $('.taskAddProject .task-project').remove();
                        $('.taskAddProject').append(content);
                        $rootScope.$broadcast('projectPickerAddClose', false);
                    }
                });

            }
        }
    }

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsAddProjectElement', wmsAddProjectElement);
wmsAddProjectElement.$inject=['$log', '$compile'];
function wmsAddProjectElement($log, $compile) {
        return {
            restrict: 'A',
            scope : {
              project : '=ngModel',
              taskProject : '=taskProject'
            },
            controller : ['$scope', function ($scope) {
                $scope.addProjectId = function(id){
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
                        var template = '<span class="task-project" ng-click="vm.deleteProjectElement($this)">'+scope.project.name+'<i class="fa fa-close" ng-click="projectDelete(project.id, $event)"></i></span>';
                        scope.addProjectId(scope.project.id);
                        var linkFn = $compile(template);
                        var content = linkFn(scope);
                        $('.taskAddProject').append(content);
                    }
                });

            }
        }
    }

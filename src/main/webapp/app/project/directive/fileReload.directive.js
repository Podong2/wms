/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('fileReload', fileReload);
fileReload.$inject=['$log', '$compile', '$rootScope'];
function fileReload($log, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope : {
              pageType : '=pageType'
            },
            controller : ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                element.on('click', function(event){
                    var type = event.target.getAttribute('page-type');
                    if(type == 'task') $rootScope.$broadcast('task-detail-reload');
                    else if(type == 'project') $rootScope.$broadcast('project-detail-reload');
                });

            }
        }
    }

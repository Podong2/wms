/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('taskListPopup',  taskListPopup);
taskListPopup.$inject=['$timeout'];
function taskListPopup($timeout) {
        return {
            restrict: 'A',
            scope : {
                type : '=type'
            },
            link: function (scope, element, attr) {
                var position = '';
                scope.$watch('$last',function(v){
                    $timeout(function(){
                        position = element.find('.sub-task-area-popup');
                    }, 1000);

                });
                $('body').click(function (e) {
                    if (!$(".sub-task-area-popup").has(e.target).length) {
                        $('.sub-task-area-popup').removeClass('on');
                    }
                });
                element.on('click', function (event) {

                    $timeout(function () {
                        $('.sub-task-area-popup').removeClass('on');
                        $(event.target.children).addClass('on');
                    }, 100);
                });
            }
        }
    }

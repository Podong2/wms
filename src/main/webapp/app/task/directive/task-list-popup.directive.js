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

                element.on('click', function (event) {
                    var top = event.target.offsetTop - event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.scrollTop;
                    position.css('top', top+ 'px');
                    $('.sub-task-area-popup').removeClass('on');
                    $(event.target.children).addClass('on');
                });
            }
        }
    }

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('taskListPopup',  taskListPopup);
taskListPopup.$inject=[];
function taskListPopup() {
        return {
            restrict: 'A',
            scope : {
                type : '=type'
            },
            link: function (scope, element, attr) {


                element.on('click', function (event) {
                    $('.sub-task-area-popup').removeClass('on');
                    $(event.target.children).addClass('on');
                });
            }
        }
    }

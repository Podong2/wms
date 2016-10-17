/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
.directive('projectDynamicHeight', projectDynamicHeight);

    function projectDynamicHeight() {
        return {
            restrict: 'A',
            scope : {
                projectInfoViewYn : '=projectInfoViewYn'
            },
            template: '',
            link: function (scope, tElement, tAttrs) {
                var minusHeight = 0;
                tElement.on('click', function () {

                    scope.projectInfoViewYn = !scope.projectInfoViewYn;
                    if(scope.projectInfoViewYn) minusHeight = 431;
                    else minusHeight = 229;
                    $(".project-task-list-area").css("height", (window.innerHeight - minusHeight) + "px");

                }).resize();
            }
        }
    }

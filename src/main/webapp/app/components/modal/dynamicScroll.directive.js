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
.directive('dynamicScroll', dynamicScroll)
.directive('dynamicViewScroll', dynamicViewScroll);

    function dynamicScroll() {
        return {
            restrict: 'A',
            template: '',
            link: function (scope, tElement, tAttrs) {
                tElement.css("max-height", (window.innerHeight - 250) + "px");
            }
        }
    }

    function dynamicViewScroll() {
        return {
            restrict: 'A',
            template: '',
            link: function (scope, tElement, tAttrs) {
                $(window).resize(function () {
                    $(".modal-body").css("max-height", (window.innerHeight - 250) + "px");
                }).resize();
            }
        }
    }

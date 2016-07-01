/**
 * Created by 와이즈스톤 on 2016-06-22.
 */
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
    .directive('pickerToggle', pickerToggle);
pickerToggle.$inject=['$timeout'];
        function pickerToggle($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $('body').click(function (e) {
                    if ($('.sectionDatePicker').toggleClass("on")) {
                        if (!$('#sectionDatePicker').has(e.target).length) {
                            $('.sectionDatePicker').removeClass("on");
                        }
                    }
                });
                element.on('click', function(_this) {
                    $timeout(function () {
                        $(".startDate").focus();
                    }, 400);
                });
            }
        }
    }

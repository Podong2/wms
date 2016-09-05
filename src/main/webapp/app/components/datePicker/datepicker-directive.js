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
    .directive('pickerToggle', pickerToggle)
    .directive('repeatPickerToggle', repeatPickerToggle)
    .directive('repeatPickerAddToggle', repeatPickerAddToggle);
pickerToggle.$inject=['$timeout'];
repeatPickerToggle.$inject=['$timeout', '$rootScope'];
repeatPickerAddToggle.$inject=['$timeout', '$rootScope'];
        function pickerToggle($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $('body').click(function (e) {
                    if ($('.editSection').addClass("on")) {
                        if (!$('#editSection').has(e.target).length) {
                            $('.editSection').removeClass("on");
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
    function repeatPickerToggle($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var displayYn = true;
                element.on('click', function (_this) {
                    displayYn = true;
                    $timeout(function () {
                        $(".startDate").focus();
                    }, 400);
                });
                $('body').click(function (e) {
                    if ($('.repeat-edit-section').addClass("on")) {
                        if (!$('#repeatEditSection').has(e.target).length) {
                            $('.repeat-edit-section').removeClass("on");
                        }else if(displayYn){
                            $('.repeat-edit-section').addClass("on");
                        }else if(!displayYn){
                            $('.repeat-edit-section').removeClass("on");
                        }
                    }
                });
                $rootScope.$on('repeatClose', function () {
                    $('.repeat-edit-section').removeClass("on");
                    displayYn = false;
                });
            }
        }
    }
    function repeatPickerAddToggle($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var displayYn = true;
                element.on('click', function (_this) {
                    displayYn = true;
                    $timeout(function () {
                        $(".startDate").focus();
                    }, 400);
                });
                $('body').click(function (e) {
                    if ($('.repeat-add-section').addClass("on")) {
                        if (!$('#repeatAddSection').has(e.target).length) {
                            $('.repeat-add-section').removeClass("on");
                        }else if(displayYn){
                            $('.repeat-add-section').addClass("on");
                        }else if(!displayYn){
                            $('.repeat-add-section').removeClass("on");
                        }
                    }
                });
                $rootScope.$on('repeatClose', function () {
                    $('.repeat-add-section').removeClass("on");
                    displayYn = false;
                });

            }
        }
    }

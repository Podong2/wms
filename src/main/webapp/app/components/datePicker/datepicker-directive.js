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
    .directive('repeatPickerAddToggle', repeatPickerAddToggle)
    .directive('subTaskPickerToggle', subTaskPickerToggle);
pickerToggle.$inject=['$timeout'];
repeatPickerToggle.$inject=['$timeout', '$rootScope'];
repeatPickerAddToggle.$inject=['$timeout', '$rootScope'];
subTaskPickerToggle.$inject=['$timeout', '$rootScope'];
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

/**
 * 반복설정 일정 설정 수정
 * @param $timeout
 * @param $rootScope
 * @returns {{restrict: string, link: link}}
 */
function repeatPickerToggle($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var $element = element;
                var displayYn = true;
                element.on('click', function (_this) {
                    displayYn = true;
                    $timeout(function () {
                        $(".startDate").focus();
                        $($element.parent().find('.repeat-edit-section')).addClass("on")
                    }, 100);

                });
                $('body').click(function (e) {
                        if (!$($element.parent()).has(e.target).length) {
                            if(e.target.getAttribute('class') != null && e.target.getAttribute('class').split(" ").indexOf("btn") == -1){
                                $('.repeat-edit-section').removeClass("on");
                            }
                        }else if(displayYn){
                            $($element.parent().find('.repeat-edit-section')).addClass("on");
                        }else if(!displayYn){
                            $('.repeat-edit-section').removeClass("on");
                        }
                });
                $rootScope.$on('repeatClose', function () {
                    $('.repeat-edit-section').removeClass("on");
                    displayYn = false;
                });
            }
        }
    }

/**
 * 반복 작업 일정설정 등록 팝업
 * @param $timeout
 * @param $rootScope
 * @returns {{restrict: string, link: link}}
 */
function repeatPickerAddToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var displayYn = true;
            element.on('click', function (_this) {
                displayYn = true;
                $timeout(function () {
                    $(".startDate").focus();
                    $('.repeat-add-section').addClass("on")
                }, 100);
            });
            $('body').click(function (e) {
                    if (!$('#repeatAddSection').has(e.target).length) {
                        if(e.target.getAttribute('class') != null && e.target.getAttribute('class').split(" ").indexOf("btn") == -1){
                            $('.repeat-add-section').removeClass("on");
                        }
                    }else if(displayYn){
                        $('.repeat-add-section').addClass("on");
                    }else if(!displayYn){
                        $('.repeat-add-section').removeClass("on");
                    }
            });
            $rootScope.$on('repeatClose', function () {
                $('.repeat-add-section').removeClass("on");
                displayYn = false;
            });

        }
    }
}

/**
 * 하위 작업 일정 설정 picker
 * @param $timeout
 * @param $rootScope
 * @returns {{restrict: string, link: link}}
 */
function subTaskPickerToggle($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var openYn = false;
                var elementTarget = '';
                element.on('click', function (_this) {
                    openYn = true;
                    elementTarget = _this.target.parentElement.parentElement.parentElement;
                    $('.subTask-edit-section').removeClass("on");
                    $(_this.target.parentElement.parentElement.nextElementSibling).addClass("on");
                    $(_this.target.parentElement.lastElementChild).addClass("on");
                    $timeout(function () {
                        $(".startDate").focus();
                    }, 400);
                });
                //$('body').click(function (e) {
                //    if(elementTarget != ''){
                //        if (!$(elementTarget).has(e.target).length) {
                //            $('.subTask-edit-section').removeClass("on");
                //            elementTarget = '';
                //        }
                //    }
                //});
                $rootScope.$on('subTaskClose', function () {
                    $('.subTask-edit-section').removeClass("on");
                    openYn = false;
                });

            }
        }
    }

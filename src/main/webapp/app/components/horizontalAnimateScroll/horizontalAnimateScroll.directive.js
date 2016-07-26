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
    .directive('scrollRight', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function() {
                    $(".IssueGallery").animate({left:"50"}, 1);
                });
            }
        }
    })
    .directive('scrollLeft', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function() {
                    $(".IssueGallery").animate({left:"+=50"}, 1);
                });
            }
        }
    })
    .directive('slideScrollRight', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function() {
                    $(".slideMenu").animate({left:"50"}, 1);
                });
            }
        }
    })
    .directive('slideScrollLeft', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function() {
                    $(".slideMenu").animate({left:"+=50"}, 1);
                });
            }
        }
    });

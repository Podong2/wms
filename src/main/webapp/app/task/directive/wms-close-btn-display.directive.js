/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsCloseBtnDisplay',  wmsCloseBtnDisplay);
wmsCloseBtnDisplay.$inject=['$timeout']
function wmsCloseBtnDisplay($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                element.on('mouseover', function (event) {
                    $(this).find('.close-btn').css("display", 'block');
                    $(this).find('.close-btn').addClass("on")
                });
                element.on('mouseout', function (event) {
                    $(this).find('.close-btn').css("display", 'none');
                    $(this).find('.close-btn').removeClass("on")
                });
            }
        }
    }

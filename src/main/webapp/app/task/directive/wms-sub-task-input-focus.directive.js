/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsSubTaskInputFocus',  wmsSubTaskInputFocus);
wmsSubTaskInputFocus.$inject=['$timeout']
function wmsSubTaskInputFocus($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                element.on('click', function (event) {
                    $timeout(function(){
                        $('.subTask-input').focus();
                    }, 200)

                });
            }
        }
    }

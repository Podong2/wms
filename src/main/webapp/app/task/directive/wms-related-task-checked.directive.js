/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsRelatedTaskChecked',  wmsRelatedTaskChecked);
wmsRelatedTaskChecked.$inject=['$timeout']
function wmsRelatedTaskChecked($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                element.on('change', function (event) {
                    $(this).closest('.related-task-item-list').toggleClass("related-task-highlight", this.checked);
                });
            }
        }
    }

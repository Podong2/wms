/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsAddFileElement', wmsAddFileElement);
wmsAddFileElement.$inject=['$log', '$compile'];
function wmsAddFileElement($log, $compile) {
        return {
            restrict: 'E',
            replace: false,
            controller : ['$scope', function ($scope) {
                $("#input-5").fileinput({
                    showCaption: false, showUpload: false, uploadUrl:"1", uploadAsync: false
                });

            }],
            compile: function (element, attrs) {
                        var template = '<input id="input-5" name="input5[]" type="file" multiple class="file-loading" get-files file-type="comment">';
                        element.append(template);

            }
        }
    }

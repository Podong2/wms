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
            scope : {
                commentFiles : '=commentFiles'
            },
            controller : ['$scope', '$cookies', '$log', function ($scope, $cookies, $log) {

                $scope.getToken = function() {
                    return $cookies.get("CSRF-TOKEN");
                };
                $scope.getToken()

                $("#input-5").fileinput({
                    uploadUrl : '/tasks/uploadFile',
                    task : '',
                    type : 'task-history',
                    token : $scope.getToken(),
                    showCaption: false,
                    showUpload: true,
                    showClose: true,
                    showRemove: false,
                    uploadAsync: false,
                    overwriteInitial: false,
                    initialPreviewAsData: true, // defaults markup
                    initialPreviewFileType: 'image', // image is the default and can be overridden in config below
                    uploadExtraData: function (previewId, index) {
                        var obj = {};
                        $('.file-form').find('input').each(function() {
                            var id = $(this).attr('id'), val = $(this).val();
                            obj[id] = val;
                        });
                        return obj;
                    }
                }).on('filesorted', function(e, params) {
                    console.log('File sorted params', params);
                }).on('fileuploaded', function(e, params) {
                    console.log('File uploaded params', params);
                }).on('getFileupload', function(e, params) {
                    angular.forEach(params, function(value){
                        $scope.commentFiles.push(value)
                    });
                    $scope.$apply();
                    $log.debug("파일 목록 : ", $scope.commentFiles);
                }).on('filedeleted', function(event, key) {
                    console.log('Key = ' + key);
                });

            }],
            compile: function (element, attrs) {
                        var template = '<input id="input-5" name="input5[]" type="file" multiple class="file-loading" get-files file-type="comment">';
                        element.append(template);

            }
        }
    }

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsProjectFileDownload', wmsProjectFileDownload);
wmsProjectFileDownload.$inject=['$log', '$compile', '$rootScope'];
function wmsProjectFileDownload($log, $compile, $rootScope) {
        return {
            scope : {
                downloadImages : '=downloadImages',
                downloadEvent : '&downloadEvent'
            },
            controller : ['$scope', function ($scope) {

            }],
            link: function (scope, element, attrs) {
                element.on('click', function(){
                    var selectedImages = $(".image-list-area.on img");
                    var projectFileDeleteTargets = [];
                    angular.forEach(selectedImages, function(value, index){
                        var img = value;
                        var attachedFileId = img.getAttribute("id");
                        projectFileDeleteTargets.push(attachedFileId);
                        attachedFileId ='';
                    });
                    scope.downloadImages = projectFileDeleteTargets;
                    scope.$apply();
                    scope.downloadEvent()('img');
                    $(".image-list-area.on").removeClass('on');
                    $log.debug("selectedImages : ", selectedImages)
                });

            }
        }
    }

/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsProjectFileRemove', wmsProjectFileRemove);
wmsProjectFileRemove.$inject=['$log', '$compile', '$rootScope'];
function wmsProjectFileRemove($log, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope : {
                removeImages : '=removeImages',
                removeEvent : '&removeEvent'
            },
            controller : ['$scope', function ($scope) {

            }],
            link: function (scope, element, attrs) {
                element.on('click', function(){
                    var selectedImages = $(".image-list-area.on img");
                    var projectFileDeleteTargets = [];
                    var data = {
                        id : '',
                        entityId : '',
                        entityName : ''
                    };
                    angular.forEach(selectedImages, function(value, index){
                        var img = value;
                        data.attachedFileId = img.getAttribute("id");
                        data.entityId = img.getAttribute("entityId");
                        data.entityName = img.getAttribute("entityName");
                        projectFileDeleteTargets.push(data);
                        data = {
                            id : '',
                            entityId : '',
                            entityName : ''
                        };
                    });
                    scope.removeImages = projectFileDeleteTargets;
                    scope.$apply();
                    scope.removeEvent()('img');
                    $(".image-list-area.on").removeClass('on');
                    $log.debug("selectedImages : ", selectedImages)
                });

            }
        }
    }

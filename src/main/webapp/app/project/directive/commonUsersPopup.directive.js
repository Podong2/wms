/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('commonUsersPopup', commonUsersPopup);
commonUsersPopup.$inject=['$log', '$compile', '$rootScope'];
function commonUsersPopup($log, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope : {
                users : '=users',
                type : '@'
            },
            templateUrl :'app/project/html/modal/commonUserListPopup.html',
            controller : ['$scope', function ($scope) {
                $scope.memberSearchYn = false;
                $scope.vm = {
                    memberFilter : ''
                }


                $scope.commonPopupClose = function(){
                    $rootScope.$broadcast("commonPopupClose");
                }

                $scope.profileClose = function(){
                    $rootScope.$broadcast("profileClose")
                }
                $scope.commonInfoAdd = function(user){
                    $scope.userInfo = user;
                }

            }],
            link: function (scope, element, attrs) {
                element.on('click', function(){
                    //scope.users = attrs.users;
                    $log.debug("scope.users : ", scope.users)
                })
            }
        }
    }

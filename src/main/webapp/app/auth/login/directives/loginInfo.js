"use strict";

angular.module('wmsApp').directive('loginInfo', function(){

    return {
        restrict: 'A',
        templateUrl: 'app/auth/login/directives/login-info.tpl.html',
        link: function(scope, element){
            scope.user = {
                picture : "content/images/logo-jhipster.png",
                username : "John Doe"
            }
        }
    }
});

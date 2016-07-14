"use strict";

angular.module('wmsApp').directive('languageSelector', languageSelector);
languageSelector.$inject=[];
    function languageSelector(){
    return {
        restrict: "EA",
        replace: true,
        templateUrl: "app/layout/language/language-selector.tpl.html",
        scope: true
    }
}

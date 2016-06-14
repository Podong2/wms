/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('inputCheck', inputCheck);

    function inputCheck () {
        var directive = {
            restrict: 'A',
            scope: "=data",
            link: linkFunc
        };

        return directive;

        function linkFunc (scope, element, attrs) {
            var checkIcon;
            var checkClass;
                //var checkType = tAttrs['checkType'];

            scope.$watch(function() {

                //if (checkType == "success") {
                //    checkIcon = "glyphicon-ok";
                //    checkClass = "has-success";
                //}
                element.attr("class", checkClass);
                element.append("<span class='glyphicon " + checkIcon + " form-control-feedback' aria-hidden='true'></span>");
            });


//<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
//<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>
//<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
        }
    }
})();

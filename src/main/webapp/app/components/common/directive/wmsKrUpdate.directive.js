/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .directive('wmsKrUpdate', wmsKrUpdate);
wmsKrUpdate.$inject=[];
function wmsKrUpdate() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                var blank_pattern = /^\s+|\s+$/g;

                element.keyup(function (event) {
                    if (event.keyCode !== 40) {
                        if (element.val().length > 0) {
                            if (element.val().replace(blank_pattern, '') == "") {
                                element.val("");
                                return false;
                            }
                        }
                        ngModel.$setViewValue(element.val());
                        scope.$apply();
                    }


                });

                element.blur(function (event) {
                    if (event.keyCode !== 40) {
                        if (element.val().length > 0) {
                            if (element.val().replace(blank_pattern, '') == "") {
                                element.val("");
                                return false;
                            }
                        }

                        ngModel.$setViewValue(element.val());
                        scope.$apply();
                    }
                });

                element.keydown(function (event) {
                    if (event.keyCode !== 40) {
                        if (element.val().length > 0) {
                            if (element.val().replace(blank_pattern, '') == "") {
                                element.val("");
                                return false;
                            }
                        }
                        ngModel.$setViewValue(element.val());
                        scope.$apply();
                    }


                });
            }
        }
    }

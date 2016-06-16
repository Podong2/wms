(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('menuToggle', menuToggle)
        .directive('depthToggle', depthToggle);

    function menuToggle () {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc (scope, element) {
            element.on('click', function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled-2");
                $(".content-wrapper").toggleClass("toggled-3");
                $(".side-body").toggleClass("toggled-3");
                $('#menu ul').hide();
            });
        }
    }
    function depthToggle () {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc (scope, element) {
            element.on('click', function(e) {
                var checkElement = $(this).next();
                if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                    return false;
                }
                if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                    $('#menu ul:visible').slideUp('normal');
                    checkElement.slideDown('normal');
                    return false;
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('menuToggle', menuToggle)
        .directive('depthToggle', depthToggle);
    menuToggle.$inject=['$log'];


    function menuToggle ($log) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc (scope, element, attrs) {
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

        function linkFunc (scope, element, attrs) {
            element.on('click', function(e) {
                var menuType = attrs.menutype;
                if(menuType == 'users'){
                    $(".side-contents .users").addClass("on");
                    $(".side-icon .users").addClass("on");
                    $(".side-contents .test").removeClass("on");
                    $(".side-icon .test").removeClass("on");
                }else if(menuType == 'test'){
                    $(".side-contents .test").addClass("on");
                    $(".side-icon .test").addClass("on");
                    $(".side-contents .users").removeClass("on");
                    $(".side-icon .users").removeClass("on");
                }

                $("#wrapper").removeClass("toggled-2");
                $(".content-wrapper").addClass("toggled-3");
                $(".side-body").addClass("toggled-3");
                $('#menu ul').hide();

/*                var checkElement = $(this).next();
                if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                    return false;
                }
                if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                    $('#menu ul:visible').slideUp('normal');
                    checkElement.slideDown('normal');
                    return false;
                }*/
            });
        }
    }
})();

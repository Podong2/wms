(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('menuToggle', menuToggle);

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
                $('#menu ul').hide();
            });
        }
    }
})();

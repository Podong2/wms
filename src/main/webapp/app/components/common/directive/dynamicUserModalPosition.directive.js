/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
(function(){
    /**
     * Created by Jeong on 2016-03-21.
     */
    'use strict';

    angular.module('wmsApp')
        .directive('dynamicUserModalPosition', dynamicUserModalPosition);

    function dynamicUserModalPosition() {
        return {
            restrict: 'A',
            template: '',
            link: function (scope, tElement, tAttrs) {
                var obj = tElement.offset();
                var parent = tElement.parent();

                tElement.on('click', function(event){
                    var obj = tElement.offset();
                    console.log("left: " + obj.left + "px, top: " + obj.top + "px");
                });
            }
        }
    }

})();


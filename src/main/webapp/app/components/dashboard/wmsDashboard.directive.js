/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
'use strict';

angular.module('wmsApp')
    .directive('dashboard', dashboard);
dashboard.$inject=['$compile']
function dashboard($compile) {

    return {
        restrict: 'E',
        scope: {
            adfModel : '=',
            maximizable : '@',
            structure : '@',
            enableConfirmDelete : '@',
            eeditable : '@',
            collapsible : '@',
            name : '@'
        },
        replace: false,
        controller : ['$scope', function($scope) {
        }],
        link: function (scope, element, attrs) {
            var template = '<adf-dashboard name="'+ scope.name +'" collapsible="'+ scope.collapsible +'" editable="'+ scope.eeditable +'" structure="'+ scope.structure +'" ' +
                'adf-model="adfModel" maximizable="'+ scope.maximizable +'" enable-confirm-delete="'+ scope.enableConfirmDelete +'"/>';
            var linkFn = $compile(template);
            var content = linkFn(scope);
            element.append(content);
        }
        }
    }

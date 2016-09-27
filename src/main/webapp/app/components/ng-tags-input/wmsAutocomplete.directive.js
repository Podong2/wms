/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
'use strict';

angular.module('wmsApp')
    .directive('autocomplete', autocomplete);
autocomplete.$inject=['$document', '$log', '$compile', 'findUser', '$q']
function autocomplete($document, $log, $compile, findUser, $q) {

    return {
        restrict: 'E',
        scope: {
            source : '&',
            tags : '=',
            displayProperty : '@',
            multiple : '@',
            maxResultsToShow : '@',
            placeholder : '@',
            tagType: '@',
            templateUrl: '@',
            projectYn : '@',
            modifyYn : '@'
        },
        replace: false,
        templateUrl : 'app/components/ng-tags-input/tagsInput.html',
        controller : ['$scope', function($scope) {
        }],
        link: function (scope, element, attrs) {
            scope.loadData = function(name) {
                return scope.source()(name);
            };
        }
        }
    }

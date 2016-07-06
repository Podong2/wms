/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
'use strict';

angular.module('wmsApp')
    .directive('autocomplete', autocomplete);
autocomplete.$inject=['$document', '$log', '$compile', 'findUser']
function autocomplete($document, $log, $compile, findUser) {

    return {
        restrict: 'E',
        required: "ngModel",
        scope: {
            source : '&',
            ngModel : '=',
            displayproperty : '=',
            multiple : '=',
            maxresultstoshow : '='
        },
        replace: false,
        templateUrl : 'app/components/ng-tags-input/tagsInput.html',
        controller: ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {
            //$scope.test = function (value) {
            //    return [{name : "test"}];
            //}
        }],
        link: function (scope, element, attrs) {
            scope.tagList=[];
            scope.test = function (value) {
                scope.$apply(function(){
                    scope.source(value).then(function (response) {
                        scope.tagList = response;
                    });
                });
            }

            //scope.model = 'tags'
            //scope.displayproperty = 'name'
            //scope.multiple = 'true'
            //scope.maxresultstoshow = '20'
            //scope.model = attrs['ngModel'];
            //scope.displayproperty = attrs['displayproperty'];
            //scope.multiple = attrs['multiple'];
            //scope.maxresultstoshow = attrs['maxresultstoshow'];
            //var template = '<tags-input ng-model="'+ scope.model +'" display-property="'+ scope.displayproperty +'" multiple="'+ scope.multiple +'">' +
            //                '<auto-complete source="test" multiple="'+ scope.multiple +'" max-results-to-show="'+ scope.maxresultstoshow +'"></auto-complete>' +
            //            '</tags-input>';
            //var linkFn = $compile(template);
            //var content = linkFn(scope);
            //element.append(content);

            //scope.source().then(function (response) {
            //    scope.tagList = response;
            //});
        }
    }
}

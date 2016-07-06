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
            maxResultsToShow : '@'
        },
        replace: false,
        templateUrl : 'app/components/ng-tags-input/tagsInput.html',
        controller : ['$scope', function($scope) {
            $scope.loadData = function(name) {
                var deferred = $q.defer();
                findUser.findByName(name).then(function(result){
                    deferred.resolve(result);
                }); //user search
                return deferred.promise;
            };
        }],
        link: function (scope, element, attrs) {
        }
    }
}

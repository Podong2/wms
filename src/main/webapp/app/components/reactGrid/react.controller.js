
(function() {
    'use strict';


    angular
        .module('wmsApp')
        .controller('reactController', reactController);

    reactController.$inject = ['$scope'];

    function reactController($scope) {
        $scope.person = { fname: 'Clark', lname: 'Kent' };

        $scope.framework = 'ReactJs';
        $scope.data = [];
        // Fill the data map with random data

        $scope.clickHandler = function () {
            console.log("in AngularJS");
        }
        $scope.refresh = function () {
            for (var i = 0; i < 1500; ++i) {
                $scope.data[i] = {};
                for (var j = 0; j < 5; ++j) {
                    $scope.data[i][j] = Math.random();
                }
            }
        }
        $scope.refresh()
}
})();


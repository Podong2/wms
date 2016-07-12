/**
 * Created by 와이즈스톤 on 2016-07-12.
 */
(function(){

    'use strict';

    'use strict';

    angular
        .module('wmsApp')
        .controller('summerController', summerController);

    summerController.$inject = ['$scope', 'dataService'];

    function summerController ($scope, dataService) {

        $scope.dataService = dataService;

        $scope.text = "Hello World";

        $scope.init = function() {
            //console.log('Summernote is launched');
        };
        $scope.enter = function() {
            //console.log('Enter/Return key pressed');
        };
        $scope.focus = function(e) {
            //console.log('Editable area is focused');
        };
        $scope.blur = function(e) {
            //console.log('Editable area loses focus');
        };
        $scope.paste = function(e) {
            //console.log('Called event paste');
        };
        $scope.change = function(contents) {
            //console.log('contents are changed:', contents, $scope.editable);

        };
        $scope.keyup = function(e) {
            //console.log('Key is released:', e.keyCode);
        };
        $scope.keydown = function(e) {
            //console.log('Key is pressed:', e.keyCode);
        };
        $scope.imageUpload = function(files) {
            console.log('image upload:', files);
            console.log('image upload\'s editable:', $scope.editable);
            $scope.editor.summernote("editor.insertImage", window.location.origin + "/api/attachedFile/" + 5);

        }


    }

})();

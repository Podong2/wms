/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("uploadCtrl", uploadCtrl);
uploadCtrl.$inject=['$scope', '$upload', '$log', '$filter', 'TaskEdit', '$cookies'];
        function uploadCtrl($scope, $upload, $log, $filter, TaskEdit, $cookies) {

        $scope.clearComment = clearComment;
        $scope.imageUpload = imageUpload;

        $scope.editor = "";

        function clearComment () {
            $scope.editor.summernote("code", "");
        }

        var isEmpty = function (value, trim) {
            return value === undefined || value === null || value.length === 0 || (trim && $.trim(value) === '');
        };

        //  에디터에서 파일 드래그로 업로드
        function imageUpload (files) {
            var listFiles = [];
            angular.forEach(files, function (file, index) {
                //if (!angular.isDefined(file.name)) {
                //    var fileType = file.type.split("/");
                //    var imageType = "";
                //
                //    if (fileType[0] == "image") {
                //        imageType = "." + fileType[1];
                //    }
                //
                //    file.name = new Date().getTime() + imageType;
                //}

                listFiles.push(file);
            });


            $log.debug("파일 유형 확인 : " , listFiles);

            TaskEdit.fileUpload({
                method: "POST",
                file: listFiles,
                fileFormDataName: "file"
            }).then(function (response) {
                $log.debug(response);
                angular.forEach(response.data, function (fileInfo, index) {
                    $scope.editor.summernote("editor.insertImage", window.location.origin + "/api/attachedFile/" + fileInfo.id);
                });
            });
        }
    }

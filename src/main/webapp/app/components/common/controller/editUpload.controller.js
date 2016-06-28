/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("uploadCtrl", uploadCtrl);
uploadCtrl.$inject=['$scope', '$upload', '$log', '$filter'];
        function uploadCtrl($scope, $upload, $log, $filter) {

        $scope.clearComment = clearComment;
        $scope.imageUpload = imageUpload;

        $scope.editor = "";

        function clearComment () {
            $scope.editor.summernote("code", "");
        };

        //  에디터에서 파일 드래그로 업로드
        function imageUpload (files) {
            var listFiles = new Array();
            angular.forEach(files, function (file, index) {
                if (!angular.isDefined(file.name)) {
                    var fileType = file.type.split("/");
                    var imageType = "";

                    if (fileType[0] == "image") {
                        imageType = "." + fileType[1];
                    }

                    file.name = new Date().getTime() + imageType;
                }

                listFiles.push(file);
            });

            $log.debug("파일 유형 확인 : " , listFiles);

            //Issue.uploadFile({
            //    method: "POST",
            //    file: listFiles,
            //    fileFormDataName: "file"
            //}).then(function (response) {
            //    if (response.data.message.status == "success") {
            //        angular.forEach(response.data.attachedFiles, function (fileInfo, index) {
            //            $scope.editor.summernote("editor.insertImage", uiConstant.urlType.HTTP + window.location.host + "/its/" + fileInfo.path);
            //        });
            //    }
            //    else {
            //        $scope.errorMessage = response.data.message.message;
            //    }
            //});
        }
    }

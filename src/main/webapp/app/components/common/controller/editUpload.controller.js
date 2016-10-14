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
            // hsy 파일 업로드 수정
            var formData = new FormData();
            $.each(listFiles, function (key, data) {
                if (!isEmpty(listFiles[key])) {
                    formData.append("file", data, listFiles[key]);
                }
            });

            $.ajax({
                headers: {
                    Accept: "application/json; text/plain; */*"
                    ,"X-CSRF-TOKEN": $cookies.get("CSRF-TOKEN")
                },
                url: 'api/attachedFile',
                processData: false,
                contentType: false,
                data: formData,
                type: 'POST',
                success: function(response){
                        $log.debug(response);
                        angular.forEach(response, function (fileInfo, index) {
                            $scope.editor.summernote("editor.insertImage", window.location.origin + "/api/attachedFile/" + fileInfo.id);
                        });
                },
                error: function(){

                }
            });

            //TaskEdit.fileUpload({
            //    method: "POST",
            //    files: formData,
            //    fileFormDataName: "file"
            //}).then(function (response) {
            //    $log.debug(response);
            //    //angular.forEach(response.data.attachedFiles, function (fileInfo, index) {
            //    //    $scope.editor.summernote("editor.insertImage", window.location.origin + "/attachedFile" + fileInfo.path);
            //    //});
            //});
        }
    }

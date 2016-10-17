/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectFileCtrl", projectFileCtrl);
projectFileCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', '$rootScope', '$state', '$stateParams', 'toastr',  'Principal', 'ProjectAttachedList', 'tableService', 'ProjectEdit', '$cookies'];
        function projectFileCtrl($scope, Code, $log, AlertService, $rootScope, $state, $stateParams, toastr,  Principal, ProjectAttachedList, tableService, ProjectEdit, $cookies) {
            var vm = this;

            vm.getCheckedData = getCheckedData;
            vm.filesRemove = filesRemove;
            vm.downloadFiles = downloadFiles;
            vm.userInfo = Principal.getIdentity();
            vm.projectAttachedList = [];
            vm.project = [];
            vm.fileList = [];
            vm.files = [];
            vm.filesCopy = [];
            vm.imageList = [];
            vm.wmsTableData = [];
            vm.images = [];
            vm.removeFile = {
                entityName : '',
                entityId : '',
                attachedFileId : ''
            };
            vm.projectInfo = '';
            var projectInfo = localStorage.getItem("projectInfo");
            if (angular.isDefined(projectInfo) && projectInfo != null) {
                projectInfo = JSON.parse(projectInfo);
                vm.projectInfo = projectInfo.project;
            }

            $scope.getToken = function() {
                return $cookies.get("CSRF-TOKEN");
            };
            $scope.getToken()

            $("#input-3").fileinput({
                uploadUrl : '/tasks/uploadFile',
                task : vm.task,
                type : 'task-add',
                token : $scope.getToken(),
                showCaption: false,
                showUpload: true,
                showRemove: false,
                uploadAsync: false,
                overwriteInitial: false,
                initialPreviewAsData: true, // defaults markup
                initialPreviewFileType: 'image', // image is the default and can be overridden in config below
                uploadExtraData: function (previewId, index) {
                    var obj = {};
                    $('.file-form').find('input').each(function() {
                        var id = $(this).attr('id'), val = $(this).val();
                        obj[id] = val;
                    });
                    return obj;
                }
            }).on('filesorted', function(e, params) {
                console.log('File sorted params', params);
            }).on('fileuploaded', function(e, params) {
                console.log('File uploaded params', params);
            }).on('getFileupload', function(e, params) {
                //angular.forEach(params, function(value){
                //    $scope.files.push(value)
                //});
                //$scope.$apply();
                //$log.debug("파일 목록 : ", $scope.files);
                //projectFIleUpload();
            });

            vm.tabDisplay = tabDisplay;

            vm.tabArea = [
                { status: false },  // 이미지
                { status:  true },  // 파일
            ];

            $scope.files = [];
            // 파일 목록 라이브러리에서 가져오기
            $scope.$on('setTaskAddFiles', function (event, args) {
                //$scope.files = [];
                angular.forEach(args, function(value){
                    $scope.files.push(value)
                });
                $scope.$apply();
                $log.debug("업로드 파일 목록 : ", $scope.files);
                projectFIleUpload();
            });
            $scope.$on('project-file-reload', function (event, args) {
                vm.responseData=[];
                vm.projectAttachedList = [];
                vm.imageList =[];
                vm.fileList =[];
                getFileList();
            });

            function projectFIleUpload(){
                ProjectEdit.createProjectFiles({
                    method : "POST",
                    file : $scope.files,
                    //	data 속성으로 별도의 데이터 전송
                    fields : {projectId : $stateParams.id},
                    fileFormDataName : "file"
                }).then(function (response) {
                    $scope.files = [];
                    toastr.success('프로젝트 파일 생성 완료', '프로젝트 파일 생성 완료');
                    getFileList();
                });

            }

            //  탭메뉴 영역 표시 여부 지정
            function tabDisplay (number, type) {
                angular.forEach(vm.tabArea, function (tab, index) {
                    if (number == index) {
                        tab.status = true;
                    }
                    else {
                        tab.status = false;
                    }
                });
                //getList(type);
                vm.listType = type;
            }

            // 프로젝트 파일 목록 불러오기
            function getFileList(){
                ProjectAttachedList.query({id : $stateParams.id}, onProjectSuccess, onProjectError);
            }
            getFileList();
            function onProjectSuccess (result) {
                vm.projectAttachedList = [];
                vm.projectAttachedList = result;
                vm.imageList =[];
                vm.fileList =[];
                vm.responseData = [];
                vm.images = [];
                angular.forEach(result, function(value, index){
                    vm.projectAttachedList[index].name = value.attachedFile.name;
                    vm.projectAttachedList[index].id = value.attachedFile.id;
                    vm.projectAttachedList[index].size = byteCalculation(value.attachedFile.size);
                    vm.projectAttachedList[index].contentType = value.attachedFile.contentType;
                    vm.projectAttachedList[index].lastModifiedDate = value.attachedFile.lastModifiedDate;
                });

                // 이미지와 파일 나누기
                angular.forEach(vm.projectAttachedList, function(value, index){
                    var contentType = value.contentType.split('/');
                    if(contentType[0] == 'image'){
                        vm.imageList.push(value)
                    }else{
                        vm.fileList.push(value)
                    }
                });
                vm.responseData = _.clone(vm.fileList);
                $log.debug("프로젝트 파일 목록 : ", vm.fileList);
                $log.debug("프로젝트 이미지 목록 : ", vm.imageList);


                // ng-gallery 주입
                angular.forEach(vm.imageList, function(val, idx){
                        vm.image = {
                            thumb: window.location.origin + "/api/attachedFile/" + val.id,
                            img: window.location.origin + "/api/attachedFile/" + val.id,
                            description: val.name,
                            size : val.size,
                            id : val.id,
                            entityName: val.locationType,
                            entityId: val.locationId
                        };
                        vm.images.push(vm.image);
                });
            }
            function onProjectError (result) {
                toastr.error('프로젝트 목록 불러오기 실패', '프로젝트 목록 불러오기 실패');
            }

            //byte를 용량 계산해서 반환
            function byteCalculation(bytes) {
                var bytes = parseInt(bytes);
                var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
                var e = Math.floor(Math.log(bytes)/Math.log(1024));

                if(e == "-Infinity") return "0 "+s[0];
                else
                    return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
            }

            // 파일 단일 삭제
            function deleteAttachedFile(){
                ProjectEdit.deleteAttachedFile(vm.removeFile).then(function(result){
                    getFileList();
                });
            }


            function getData () {
                return vm.fileList;
            };
            //선택된 데이터 가져오기
            function getCheckedData (type) {
                var checkData = [];
                var fileDatas = {
                    entityName : '',
                    entityId : '',
                    attachedFileId : ''
                }
                angular.forEach(getData(), function (value, index) {
                    if (value.checked) {
                        if(type == 'remove'){
                            fileDatas.entityName= value.locationType;
                            fileDatas.entityId= value.locationId;
                            fileDatas.attachedFileId= value.id;
                            checkData.push(fileDatas);
                            fileDatas = { entityName : '', entityId : '', attachedFileId : '' }
                        }else{
                            checkData.push(value.id);
                        }

                    }
                });

                return checkData;
            }
            $scope.checkedData = [];
            vm.projectFileDeleteTargets = [];
            /* 프로젝트 파일 다중 삭제 */
            function filesRemove(type){
                if(type == 'img') {
                    $scope.checkedData = vm.removeImages;
                }else{
                    $scope.checkedData = getCheckedData('remove');
                }

                //vm.task.removeTargetFiles = $scope.checkedData.join(",");
                $log.debug("파일 삭제 목록 : ", $scope.checkedData);
                ProjectEdit.deleteAttachedFile($scope.checkedData).then(function(result){
                    getFileList();
                });
            }

            /* 프로젝트 파일 다중 다운로드 */
            function downloadFiles(type){
                if(type == 'img') {
                    $scope.checkedData = vm.downloadImages;
                }else{
                    $scope.checkedData = getCheckedData('download');
                }

                vm.project.downloadFiles = $scope.checkedData.join(",");
                $log.debug("파일 삭제 id 목록 : ", vm.project.removeTargetFiles);
                var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
                    iframe.remove();
                }).attr("src", "/api/attachedFile?targetIds=" + vm.project.downloadFiles + "&name=project");
            }

            vm.removeImages = [];
            vm.downloadImages = [];


            vm.tableConfigs = [];
            vm.tableConfigs.push(tableService.getConfig("", "checked")
                .setHWidth("width-30-p")
                .setDAlign("text-center")
                .setHAlign("text-center")
                .setDType("check"));
            vm.tableConfigs.push(tableService.getConfig("이름", "name")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_name"));
            vm.tableConfigs.push(tableService.getConfig("파일 크기", "size")
                .setHWidth("width-200-p")
                .setDAlign("text-center"));
            vm.tableConfigs.push(tableService.getConfig("최종 수정", "lastModifiedDate")
                .setHWidth("width-200-p")
                .setDAlign("text-center"));
            vm.tableConfigs.push(tableService.getConfig("위치", "location")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_location"));
            vm.tableConfigs.push(tableService.getConfig("버전", "")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_version"));
            vm.tableConfigs.push(tableService.getConfig("다운로드", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_download"));
            vm.tableConfigs.push(tableService.getConfig("삭제", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_remove"));


        }

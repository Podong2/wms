/**
 * Created by Jeong on 2016-03-16.
 */
(function() {
'use strict';

angular.module('wmsApp')
    .controller("projectFileCtrl", projectFileCtrl);
projectFileCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', '$rootScope', '$state', '$stateParams', 'toastr',  'Principal', 'ProjectAttachedList', 'tableService', 'ProjectEdit'];
        function projectFileCtrl($scope, Code, $log, AlertService, $rootScope, $state, $stateParams, toastr,  Principal, ProjectAttachedList, tableService, ProjectEdit) {
            var vm = this;
            vm.userInfo = Principal.getIdentity();
            vm.projectAttachedList = [];
            vm.fileList = [];
            vm.imageList = [];
            vm.wmsTableData = [];
            vm.images = [];
            vm.removeFile = {
                entityName : '',
                entityId : '',
                attachedFileId : ''
            };
            $scope.test= '12312313'
            vm.tabDisplay = tabDisplay;

            vm.tabArea = [
                { status: false },  // 이미지
                { status:  true },  // 파일
            ];



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

            ProjectAttachedList.query({id : $stateParams.id}, onProjectSuccess, onProjectError);
            function onProjectSuccess (result) {
                vm.projectAttachedList = result;
                angular.forEach(result, function(value, index){
                    vm.projectAttachedList[index].name = value.attachedFile.name;
                    vm.projectAttachedList[index].id = value.attachedFile.id;
                    vm.projectAttachedList[index].size = byteCalculation(value.attachedFile.size);
                    vm.projectAttachedList[index].contentType = value.attachedFile.contentType;
                });
                angular.forEach(vm.projectAttachedList, function(value, index){
                    var contentType = value.contentType.split('/');
                    if(contentType[0] == 'image'){
                        vm.imageList.push(value)
                    }else{
                        vm.fileList.push(value)
                    }
                });
                vm.responseData = vm.fileList;
                $log.debug("프로젝트 파일 목록 : ", vm.fileList);
                $log.debug("프로젝트 이미지 목록 : ", vm.imageList);

                angular.forEach(vm.imageList, function(val, idx){
                        vm.image = {
                            thumb: window.location.origin + "/api/attachedFile/" + val.id,
                            img: window.location.origin + "/api/attachedFile/" + val.id,
                            description: val.name,
                            size : val.size,
                            id : val.id
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

            // 첨부 파일 다운로드 (커스텀 디렉티브에 존재)
            //function fileDownLoad(key){
            //    $log.debug("다운로드")
            //    var iframe = $("<iframe/>").hide().appendTo("body").load(function() {
            //        iframe.remove();
            //    }).attr("src", "/api/attachedFile/" + key);
            //}

            function deleteAttachedFile(){
                ProjectEdit.deleteAttachedFile(vm.removeFile).then(function(result){

                });
            }


            vm.tableConfigs = [];
            vm.tableConfigs.push(tableService.getConfig("", "checked")
                .setHWidth("width-30-p")
                .setDAlign("text-center")
                .setHAlign("text-center")
                .setDType("check"));
            vm.tableConfigs.push(tableService.getConfig("이름", "name")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDColor('field1_color')
                .setDIcon('icon')
                .setDType("renderer")
                .setDRenderer("file_name"));
            vm.tableConfigs.push(tableService.getConfig("파일 크기", "size")
                .setHWidth("width-200-p")
                .setDAlign("text-center"));
            vm.tableConfigs.push(tableService.getConfig("최종 수정", "location")
                .setHWidth("width-200-p")
                .setDAlign("text-center"));
            vm.tableConfigs.push(tableService.getConfig("위치", "location")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_location"));
            vm.tableConfigs.push(tableService.getConfig("버전", "")
                .setHWidth("width-200-p")
                .setDAlign("text-center"));
            vm.tableConfigs.push(tableService.getConfig("다운로드", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_download"));
            vm.tableConfigs.push(tableService.getConfig("업로드", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_upload"));
            vm.tableConfigs.push(tableService.getConfig("삭제", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("file_remove"));


        }
})();
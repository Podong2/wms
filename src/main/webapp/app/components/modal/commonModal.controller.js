/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("commonModalCtrl", commonModalCtrl);

    commonModalCtrl.$inject =['$scope', '$uibModalInstance', 'viewMessage', 'viewTitle', 'viewTypeClass', 'callBack', 'callBackParameter'];

        function commonModalCtrl($scope, $uibModalInstance, viewMessage, viewTitle, viewTypeClass, callBack, callBackParameter) {

        $scope.cancel = cancel;
        $scope.ok = ok;

        $scope.viewMessage = viewMessage;
        $scope.viewTitle = viewTitle;
        //	경고창 표시 class 지정
        $scope.viewTypeClass = "alert_box";

        function ok () {
            if (callBack != null) {
                callBack(callBackParameter);
            }
            $uibModalInstance.close();
        };

        function cancel () {
            $uibModalInstance.dismiss('cancel');
        };

        if (viewTypeClass != null) {
            $scope.viewTypeClass = viewTypeClass;
        }
    };

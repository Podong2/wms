/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('ModalService', ModalService);

    ModalService.$inject = ['$uibModal'];

    function ModalService ($uibModal) {
        var service = {
            open: open,
            openModal : openModal
        };
        var modalInstance = null;
        var resetModal = function () {
            modalInstance = null;
        };

        return service;

        function open (viewTitle, viewMessage, url, controller, callBack, callBackParameter, viewTypeClass) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/modal/templates/' + url,
                controller: controller,
                controllerAs: 'vm',
                size: "lg",
                resolve: {
                    viewTitle : function () {
                        return viewTitle;
                    },
                    viewMessage : function () {
                        return viewMessage;
                    },
                    viewTypeClass : function () {
                        return viewTypeClass;
                    },
                    callBack : function () {
                        return callBack;
                    },
                    callBackParameter : function () {
                        return callBackParameter;
                    },
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }
        function openModal(parameter) {
            modalInstance = $uibModal.open({
                templateUrl: 'app/components/modal/templates/' + parameter.url,
                controller: parameter.ctrl,
                controllerAs: 'vm',
                size: parameter.size,
                backdrop : "static",
                resolve: {
                    parameter : function () {
                        return parameter;
                    }
                }
            });

        }
    }
})();

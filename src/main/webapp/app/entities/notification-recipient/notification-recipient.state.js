(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('notification-recipient', {
            parent: 'entity',
            url: '/notification-recipient',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.notificationRecipient.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/notification-recipient/notification-recipients.html',
                    controller: 'NotificationRecipientController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('notificationRecipient');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('notification-recipient-detail', {
            parent: 'entity',
            url: '/notification-recipient/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.notificationRecipient.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/notification-recipient/notification-recipient-detail.html',
                    controller: 'NotificationRecipientDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('notificationRecipient');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'NotificationRecipient', function($stateParams, NotificationRecipient) {
                    return NotificationRecipient.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('notification-recipient.new', {
            parent: 'notification-recipient',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/notification-recipient/notification-recipient-dialog.html',
                    controller: 'NotificationRecipientDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                readYn: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('notification-recipient', null, { reload: true });
                }, function() {
                    $state.go('notification-recipient');
                });
            }]
        })
        .state('notification-recipient.edit', {
            parent: 'notification-recipient',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/notification-recipient/notification-recipient-dialog.html',
                    controller: 'NotificationRecipientDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['NotificationRecipient', function(NotificationRecipient) {
                            return NotificationRecipient.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('notification-recipient', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('notification-recipient.delete', {
            parent: 'notification-recipient',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/notification-recipient/notification-recipient-delete-dialog.html',
                    controller: 'NotificationRecipientDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['NotificationRecipient', function(NotificationRecipient) {
                            return NotificationRecipient.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('notification-recipient', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();

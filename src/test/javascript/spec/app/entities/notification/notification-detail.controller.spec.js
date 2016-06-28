'use strict';

describe('Controller Tests', function() {

    describe('Notification Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockNotification, MockNotificationRecipient;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockNotification = jasmine.createSpy('MockNotification');
            MockNotificationRecipient = jasmine.createSpy('MockNotificationRecipient');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Notification': MockNotification,
                'NotificationRecipient': MockNotificationRecipient
            };
            createController = function() {
                $injector.get('$controller')("NotificationDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:notificationUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

'use strict';

describe('Controller Tests', function() {

    describe('NotificationRecipient Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockNotificationRecipient, MockNotification;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockNotificationRecipient = jasmine.createSpy('MockNotificationRecipient');
            MockNotification = jasmine.createSpy('MockNotification');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'NotificationRecipient': MockNotificationRecipient,
                'Notification': MockNotification
            };
            createController = function() {
                $injector.get('$controller')("NotificationRecipientDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:notificationRecipientUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

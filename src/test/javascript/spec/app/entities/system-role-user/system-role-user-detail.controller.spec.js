'use strict';

describe('Controller Tests', function() {

    describe('SystemRoleUser Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockSystemRoleUser, MockSystemRole;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockSystemRoleUser = jasmine.createSpy('MockSystemRoleUser');
            MockSystemRole = jasmine.createSpy('MockSystemRole');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'SystemRoleUser': MockSystemRoleUser,
                'SystemRole': MockSystemRole
            };
            createController = function() {
                $injector.get('$controller')("SystemRoleUserDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:systemRoleUserUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

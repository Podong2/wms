'use strict';

describe('Controller Tests', function() {

    describe('SystemRolePermission Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockSystemRolePermission, MockSystemRole, MockPermission;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockSystemRolePermission = jasmine.createSpy('MockSystemRolePermission');
            MockSystemRole = jasmine.createSpy('MockSystemRole');
            MockPermission = jasmine.createSpy('MockPermission');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'SystemRolePermission': MockSystemRolePermission,
                'SystemRole': MockSystemRole,
                'Permission': MockPermission
            };
            createController = function() {
                $injector.get('$controller')("SystemRolePermissionDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:systemRolePermissionUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

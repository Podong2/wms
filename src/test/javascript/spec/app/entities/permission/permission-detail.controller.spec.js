'use strict';

describe('Controller Tests', function() {

    describe('Permission Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPermission, MockPermissionCategory;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPermission = jasmine.createSpy('MockPermission');
            MockPermissionCategory = jasmine.createSpy('MockPermissionCategory');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Permission': MockPermission,
                'PermissionCategory': MockPermissionCategory
            };
            createController = function() {
                $injector.get('$controller')("PermissionDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:permissionUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

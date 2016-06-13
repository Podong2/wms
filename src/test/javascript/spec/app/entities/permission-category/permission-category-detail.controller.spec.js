'use strict';

describe('Controller Tests', function() {

    describe('PermissionCategory Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPermissionCategory;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPermissionCategory = jasmine.createSpy('MockPermissionCategory');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'PermissionCategory': MockPermissionCategory
            };
            createController = function() {
                $injector.get('$controller')("PermissionCategoryDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:permissionCategoryUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

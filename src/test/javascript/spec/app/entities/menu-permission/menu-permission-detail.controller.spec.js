'use strict';

describe('Controller Tests', function() {

    describe('MenuPermission Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockMenuPermission, MockMenu, MockPermission;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockMenuPermission = jasmine.createSpy('MockMenuPermission');
            MockMenu = jasmine.createSpy('MockMenu');
            MockPermission = jasmine.createSpy('MockPermission');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'MenuPermission': MockMenuPermission,
                'Menu': MockMenu,
                'Permission': MockPermission
            };
            createController = function() {
                $injector.get('$controller')("MenuPermissionDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:menuPermissionUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

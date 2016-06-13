'use strict';

describe('Controller Tests', function() {

    describe('SystemRole Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockSystemRole;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockSystemRole = jasmine.createSpy('MockSystemRole');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'SystemRole': MockSystemRole
            };
            createController = function() {
                $injector.get('$controller')("SystemRoleDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:systemRoleUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

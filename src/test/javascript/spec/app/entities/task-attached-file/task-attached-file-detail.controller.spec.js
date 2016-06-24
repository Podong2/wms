'use strict';

describe('Controller Tests', function() {

    describe('TaskAttachedFile Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockTaskAttachedFile, MockTask;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockTaskAttachedFile = jasmine.createSpy('MockTaskAttachedFile');
            MockTask = jasmine.createSpy('MockTask');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'TaskAttachedFile': MockTaskAttachedFile,
                'Task': MockTask
            };
            createController = function() {
                $injector.get('$controller')("TaskAttachedFileDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'wmsApp:taskAttachedFileUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});

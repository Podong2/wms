(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('UserManagementDetailController', UserManagementDetailController);

    UserManagementDetailController.$inject = ['$stateParams', 'User', '$log'];

    function UserManagementDetailController ($stateParams, User, $log) {
        var vm = this;

        vm.load = load;
        vm.user = {};

        vm.load($stateParams.login);

        function load (login) {
            User.get({login: login}, function(result) {
                $log.debug("user : ", result);
                vm.user = result;
            });
        }
    }
})();

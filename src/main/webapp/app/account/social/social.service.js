(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('SocialService', SocialService);

    function SocialService () {
        var socialService = {
            getProviderSetting: getProviderSetting,
            getProviderURL: getProviderURL,
            getCSRF: getCSRF
        };

        return socialService;

        function getProviderSetting (provider) {
            switch(provider) {
            case 'google': return 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
            case 'facebook': return 'public_profile,email';
            case 'twitter': return '';
                // jhipster-needle-add-social-button
            default: return 'Provider setting not defined';
            }
        }

        function getProviderURL (provider) {
            return 'signin/' + provider;
        }

        function getCSRF () {
            /* globals document */
            var name = 'CSRF-TOKEN=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) !== -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        }
    }
})();

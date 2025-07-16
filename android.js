(function() {
    'use strict';

    function setAndroidMobileConfigIfAvailable() {
        try {
            if (typeof window.handleMobileConfig === 'function' && !window.handleMobileConfigSet) {
                window.handleMobileConfig({ isMobileApp: true, platform: 'android' });
                window.handleMobileConfigSet = true;
                window.androidPlatform = true;
            }
        } catch (err) {
        }
    }

    function runAllOverrides() {
        try {
            setAndroidMobileConfigIfAvailable();
        } catch (e) {
        }
    }

    function onLoadHandler() {
        try {
            runAllOverrides();
        } catch (e) {}

        try {
            window.addEventListener('load', function() {
                try {
                    runAllOverrides();
                } catch (e) {}
            });
        } catch (e) {}

        try {
            document.addEventListener('dragstart', function(e) {
                try {
                    e.preventDefault();
                } catch (err) {}
            });
        } catch (e) {}
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(onLoadHandler, 0);
    } else {
        window.addEventListener('DOMContentLoaded', onLoadHandler);
    }

})(); 

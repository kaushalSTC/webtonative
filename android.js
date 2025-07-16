(function() {
    'use strict';

    const SECRET = 'Wt0U10qzMTW72eJG2b7XL6dqYXrZbwg694hHmfPZ0DPjPmiqqC0t64aygaUvb';

    function setAndroidMobileConfigIfAvailable(retries = 20) {
        try {
            if (typeof window.handleMobileConfig === 'function' && !window.handleMobileConfigSet) {
                const result = window.handleMobileConfig({ isMobileApp: true, platform: 'android', secret: SECRET });
                if (result) {
                    window.handleMobileConfigSet = true;
                    window.androidPlatform = true;
                } else if (retries > 0) {
                    setTimeout(function() {
                        setAndroidMobileConfigIfAvailable(retries - 1);
                    }, 200);
                }
            } else if (retries > 0 && !window.handleMobileConfigSet) {
                setTimeout(function() {
                    setAndroidMobileConfigIfAvailable(retries - 1);
                }, 200);
            }
        } catch (err) {}
    }

    function runAllOverrides() {
        try {
            setAndroidMobileConfigIfAvailable();
        } catch (e) {}
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

    if (document.readyState === 'complete') {
        setTimeout(onLoadHandler, 0);
    } else {
        window.addEventListener('load', onLoadHandler);
    }

})(); 

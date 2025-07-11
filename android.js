(function() {
    'use strict';

    function showDebugBanner(msg) {
        try {
            var banner = document.getElementById('android-debug-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'android-debug-banner';
                banner.style.position = 'fixed';
                banner.style.bottom = '0';
                banner.style.left = '0';
                banner.style.width = '100%';
                banner.style.background = 'rgba(0,0,0,0.8)';
                banner.style.color = '#fff';
                banner.style.zIndex = '9999';
                banner.style.padding = '8px';
                banner.style.fontSize = '14px';
                banner.style.textAlign = 'center';
                document.body.appendChild(banner);
            }
            banner.textContent = msg;
        } catch (e) {}
    }

    try {
        showDebugBanner('Android override script is running');
    } catch (e) {}

    function setAndroidMobileConfigIfAvailable() {
        try {
            if (typeof window.handleMobileConfig === 'function' && !window.handleMobileConfigSet) {
                window.handleMobileConfig({ isMobileApp: true, platform: 'android' });
                window.handleMobileConfigSet = true;
                showDebugBanner('handleMobileConfig called for Android');
            } else if (typeof window.handleMobileConfig !== 'function') {
                showDebugBanner('handleMobileConfig is NOT available');
            }
        } catch (err) {
            showDebugBanner('Error in setAndroidMobileConfigIfAvailable: ' + err);
        }
    }

    async function runAllOverrides() {
        try {
            setAndroidMobileConfigIfAvailable();
        } catch (e) {
            showDebugBanner('Error in runAllOverrides: ' + e);
        }
    }

    try {
        runAllOverrides();
    } catch (e) {
        showDebugBanner('Error running initial overrides: ' + e);
    }

    try {
        var observer = new MutationObserver(function(mutations) {
            try {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        runAllOverrides();
                    }
                });
            } catch (e) {
                showDebugBanner('Error in MutationObserver: ' + e);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {
        showDebugBanner('Error setting up MutationObserver: ' + e);
    }

    try {
        window.addEventListener('load', function() {
            try {
                runAllOverrides();
            } catch (e) {
                showDebugBanner('Error in window load event: ' + e);
            }
        });
    } catch (e) {
        showDebugBanner('Error adding window load event: ' + e);
    }

    try {
        document.addEventListener('dragstart', function(e) {
            try {
                e.preventDefault();
            } catch (err) {}
        });
    } catch (e) {
        showDebugBanner('Error adding dragstart event: ' + e);
    }

})(); 

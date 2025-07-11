(function() {
    'use strict';

    function showDebugBanner(msg) {
        try {
            var banner = document.getElementById('android-debug-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'android-debug-banner';
                banner.style.position = 'fixed';
                banner.style.top = '50%';
                banner.style.left = '50%';
                banner.style.transform = 'translate(-50%, -50%)';
                banner.style.background = 'rgba(0,0,0,0.85)';
                banner.style.color = '#fff';
                banner.style.zIndex = '9999';
                banner.style.padding = '16px 24px';
                banner.style.fontSize = '16px';
                banner.style.textAlign = 'center';
                banner.style.borderRadius = '12px';
                banner.style.maxWidth = '90vw';
                banner.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
                document.body.appendChild(banner);
            }
            banner.textContent = msg;
        } catch (e) {}
    }

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

    function runAllOverrides() {
        try {
            setAndroidMobileConfigIfAvailable();
        } catch (e) {
            showDebugBanner('Error in runAllOverrides: ' + e);
        }
    }

    try {
        showDebugBanner('Android override script is running');
        runAllOverrides();
    } catch (e) {
        showDebugBanner('Error running initial overrides: ' + e);
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

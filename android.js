(function() {
    'use strict';

    function loadWebToNative() {
        return new Promise((resolve, reject) => {
            try {
                if (typeof WTN !== 'undefined') {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/webtonative@1.0.71/webtonative.min.js';
                script.onload = () => {
                    setTimeout(() => {
                        if (typeof WTN !== 'undefined') {
                            resolve();
                        } else {
                            reject(new Error('WebToNative failed to load'));
                        }
                    }, 100);
                };
                script.onerror = () => {
                    reject(new Error('Failed to load WebToNative script'));
                };
                document.head.appendChild(script);
            } catch (loadError) {
                reject(loadError);
            }
        });
    }

    async function interceptLocationButtons() {
        try {
            const locationButton = document.querySelector('.currentLocation-access');
            if (locationButton) {
                try {
                    const parentButton = locationButton.closest('button');
                    if (parentButton) {
                        if (!parentButton.hasAttribute('data-location-intercepted')) {
                            try {
                                parentButton.setAttribute('data-location-intercepted', 'true');
                                parentButton.addEventListener('click', handleLocationButtonClick, true);
                            } catch (listenerError) {}
                        }
                    } else {}
                } catch (buttonError) {}
            }
        } catch (interceptError) {}
    }

    async function handleLocationButtonClick(event) {
        try {
            try {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            } catch (eventError) {}
            try {
                if (typeof window.getIsLoading === 'function' && window.getIsLoading()) {
                    return;
                }
            } catch (loadingCheckError) {}
            try {
                if (typeof window.setLocationError === 'function') {
                    window.setLocationError(null);
                }
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(true);
                }
            } catch (loadingSetError) {}
            try {
                await checkGPSStatus();
            } catch (gpsError) {
                throw gpsError;
            }
        } catch (error) {
            try {
                if (typeof window.setLocationError === 'function') {
                    window.setLocationError('Error in location button: ' + error.message);
                } else {}
            } catch (errorSetError) {}
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        }
    }

    function showPosition(position) {
        try {
            if (!position || !position.coords) {
                try {
                    if (typeof window.setLocationLoading === 'function') {
                        window.setLocationLoading(false);
                    }
                } catch (loadingResetError) {}
                return;
            }
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            if (lat === null || lat === undefined || lon === null || lon === undefined) {
                try {
                    if (typeof window.setLocationLoading === 'function') {
                        window.setLocationLoading(false);
                    }
                } catch (loadingResetError) {}
                return;
            }
            try {
                if (typeof window.setLocationData === 'function') {
                    window.setLocationData({
                        lat: lat,
                        lng: lon
                    });
                } else {}
            } catch (dataSetError) {
                try {
                    if (typeof window.setLocationLoading === 'function') {
                        window.setLocationLoading(false);
                    }
                } catch (loadingResetError) {}
            }
        } catch (positionError) {
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        }
    }

    function showError(error) {
        try {
            if (!error) {
                try {
                    if (typeof window.setLocationLoading === 'function') {
                        window.setLocationLoading(false);
                    }
                } catch (loadingResetError) {}
                return;
            }
            let errorMessage = '';
            try {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions in settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location unavailable. Please check GPS settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timeout. Please try again.';
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = 'An unknown error occurred while retrieving location.';
                        break;
                    default:
                        errorMessage = `An unexpected error occurred: ${error.message || 'Unknown error'}`;
                        break;
                }
            } catch (switchError) {
                errorMessage = 'Error processing location error: ' + switchError.message;
            }
            try {
                if (typeof window.setLocationError === 'function') {
                    window.setLocationError(errorMessage);
                } else {}
            } catch (errorSetError) {}
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        } catch (showErrorError) {
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        }
    }

    async function checkGPSStatus() {
        try {
            try {
                await loadWebToNative();
            } catch (loadError) {
                await fallbackToStandardGeolocation();
                return;
            }
            if (typeof WTN !== 'undefined') {
                if (WTN.isDeviceGPSEnabled) {
                    try {
                        await checkGPSWithTimeout();
                    } catch (gpsTimeoutError) {
                        await fallbackToStandardGeolocation();
                    }
                } else {
                    await fallbackToStandardGeolocation();
                }
            } else {
                await fallbackToStandardGeolocation();
            }
        } catch (gpsCheckError) {
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
            await fallbackToStandardGeolocation();
        }
    }

    function requestLocation() {
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                if (typeof window.setLocationError === 'function') {
                    window.setLocationError('Geolocation is not supported by this browser.');
                } else {}
                try {
                    if (typeof window.setLocationLoading === 'function') {
                        window.setLocationLoading(false);
                    }
                } catch (loadingResetError) {}
            }
        } catch (locationError) {
            if (typeof window.setLocationError === 'function') {
                window.setLocationError(`Error requesting location: ${locationError.message}`);
            } else {}
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        }
    }

    async function fallbackToStandardGeolocation() {
        try {
            requestLocation();
        } catch (fallbackError) {
            if (typeof window.setLocationError === 'function') {
                window.setLocationError(`Error in fallback geolocation: ${fallbackError.message}`);
            } else {}
            try {
                if (typeof window.setLocationLoading === 'function') {
                    window.setLocationLoading(false);
                }
            } catch (loadingResetError) {}
        }
    }

    async function checkGPSWithTimeout() {
        return new Promise((resolve, reject) => {
            let callbackExecuted = false;
            let timeoutId;
            try {
                timeoutId = setTimeout(() => {
                    if (!callbackExecuted) {
                        callbackExecuted = true;
                        reject(new Error('GPS status callback timeout'));
                    }
                }, 5000);
                WTN.isDeviceGPSEnabled({
                    callback: function(data) {
                        if (callbackExecuted) return;
                        callbackExecuted = true;
                        clearTimeout(timeoutId);
                        try {
                            if (data && typeof data === 'object') {
                                if (data.value !== undefined) {
                                    if (data.value === true) {
                                        requestLocation();
                                        resolve();
                                    } else {
                                        if (typeof window.setLocationError === 'function') {
                                            window.setLocationError('Device GPS is disabled. Please enable location services in your device settings.');
                                        } else {}
                                        try {
                                            if (typeof window.setLocationLoading === 'function') {
                                                window.setLocationLoading(false);
                                            }
                                        } catch (loadingResetError) {}
                                        resolve();
                                    }
                                } else {
                                    fallbackToStandardGeolocation();
                                    resolve();
                                }
                            } else {
                                fallbackToStandardGeolocation();
                                resolve();
                            }
                        } catch (callbackError) {
                            fallbackToStandardGeolocation();
                            resolve();
                        }
                    }
                });
            } catch (wtnCallError) {
                if (!callbackExecuted) {
                    callbackExecuted = true;
                    clearTimeout(timeoutId);
                    reject(wtnCallError);
                }
            }
        });
    }

    function removeFooterChildren() {
        const footerWrapper = document.querySelector('.main-footer-wrapper');
        if (footerWrapper) {
            while (footerWrapper.firstChild) {
                footerWrapper.removeChild(footerWrapper.firstChild);
            }
        }
    }

    async function toggleFooterDisplay() {
        const footerWrapper = document.querySelector('.main-footer-wrapper');
        if (footerWrapper) {
            const currentUrl = window.location.href.toLowerCase();
            if (currentUrl.includes('personal-details')) {
                footerWrapper.style.display = 'block';
                footerWrapper.style.height = '20vh';
                removeFooterChildren();
            } else {
                footerWrapper.style.display = 'none';
            }
        }
    }

    async function makeEmailClickable() {
        if (!window.location.href.toLowerCase().includes('contactus')) return;
        const emailElements = document.querySelectorAll('.email-access');
        if (emailElements.length > 0) {
            emailElements.forEach(emailElement => {
                if (!emailElement) return;
                const emailText = emailElement.textContent.trim();
                if (!emailText) return;
                if (emailElement.tagName === 'A') {
                    return;
                }
                let currentElement = emailElement;
                while (currentElement.parentElement) {
                    if (currentElement.parentElement.tagName === 'A') {
                        return;
                    }
                    currentElement = currentElement.parentElement;
                }
                const existingClasses = Array.from(emailElement.classList);
                const mailtoLink = document.createElement('a');
                mailtoLink.setAttribute('href', `mailto:${emailText}`);
                mailtoLink.setAttribute('rel', 'noopener noreferrer');
                mailtoLink.setAttribute('target', '_blank');
                mailtoLink.textContent = emailText;
                mailtoLink.style.textDecoration = 'none';
                mailtoLink.style.cursor = 'pointer';
                mailtoLink.style.webkitTouchCallout = 'default';
                mailtoLink.style.webkitUserSelect = 'auto';
                mailtoLink.style.userSelect = 'auto';
                existingClasses.forEach(className => {
                    if (className !== 'email-access') {
                        mailtoLink.classList.add(className);
                    }
                });
                emailElement.parentNode.replaceChild(mailtoLink, emailElement);
            });
        } else {
            const paragraphs = document.querySelectorAll('p');
            const targetEmail = 'connect@picklebay.com';
            paragraphs.forEach(paragraph => {
                if (paragraph.textContent.trim().toLowerCase() === targetEmail.toLowerCase()) {
                    const parent = paragraph.parentElement;
                    if (parent) {
                        parent.removeChild(paragraph);
                        const mailtoLink = document.createElement('a');
                        mailtoLink.setAttribute('href', `mailto:${targetEmail}`);
                        mailtoLink.setAttribute('rel', 'noopener noreferrer');
                        mailtoLink.setAttribute('target', '_blank');
                        mailtoLink.textContent = targetEmail;
                        mailtoLink.style.textDecoration = 'none';
                        mailtoLink.style.cursor = 'pointer';
                        mailtoLink.style.webkitTouchCallout = 'default';
                        mailtoLink.style.webkitUserSelect = 'auto';
                        mailtoLink.style.userSelect = 'auto';
                        mailtoLink.classList.add('font-general', 'font-medium', 'text-sm', 'text-244cb4');
                        parent.appendChild(mailtoLink);
                    }
                }
            });
        }
    }

    async function addMarginToAlsoHappeningContainer() {
        const alsoHappeningContainer = document.querySelector('.also-happening-container');
        if (alsoHappeningContainer) {
            alsoHappeningContainer.style.marginBottom = '10vh';
        }
    }

    function processInputForAutofill(inputType, input) {
        if (inputType === 'tel' || inputType === 'number') {
            if (inputType === 'tel') {
                input.type = 'number';
            }
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            if (!input.hasAttribute('data-clipboard-disabled')) {
                input.setAttribute('data-clipboard-disabled', 'true');
                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                    return false;
                });
                input.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                });
            }
        }
    }

    async function disableInputAutofill() {
        if (!window.location.href.toLowerCase().includes('login')) return;
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            processInputForAutofill(input.type, input);
        });
    }

    async function removeCommunityHeader() {
        if (!window.location.href.toLowerCase().includes('community.picklebay.com')) return;
        const headers = document.querySelectorAll('body > header.header');
        headers.forEach(header => {
            if (header.id !== 'mainHeader') {
                header.remove();
            }
        });
    }

    async function updateNavigationContainerLayout() {
        try {
            const navContainer = document.querySelector('.navigation-container');
            if (navContainer) {
                const parent = navContainer.parentElement;
                if (parent) {
                    parent.className = '';
                    parent.classList.add(
                        'fixed',
                        'bottom-0',
                        'left-0',
                        'w-full',
                        'z-50',
                        'bg-white',
                        'border-t',
                        'border-f2f2f2'
                    );
                    parent.style.borderTopLeftRadius = '1rem';
                    parent.style.borderTopRightRadius = '1rem';
                }
                navContainer.className = '';
                navContainer.classList.add(
                    'navigation-container',
                    'flex',
                    'items-center',
                    'justify-between',
                    'gap-3',
                    'px-4',
                    'py-2',
                    'bg-white',
                    'w-full'
                );
                navContainer.style.borderTopLeftRadius = '1rem';
                navContainer.style.borderTopRightRadius = '1rem';
            }
        } catch (e) {}
    }

    async function replaceNewsAndUpdatesLinksWithDivs() {
        try {
            if (typeof WTN === 'undefined' || typeof WTN.openUrlInBrowser !== 'function') {
                return;
            }
            const links = document.querySelectorAll('.news-and-updates a');
            let counter = 0;
            links.forEach(link => {
                try {
                    if (counter === 0) {
                        counter++;
                    }
                    const url = link.href;
                    const div = document.createElement('div');
                    for (const attr of link.attributes) {
                        if (attr.name !== 'href') {
                            div.setAttribute(attr.name, attr.value);
                        }
                    }
                    while (link.firstChild) {
                        div.appendChild(link.firstChild);
                    }
                    div.onclick = function(e) {
                        try {
                            e.preventDefault();
                            WTN.openUrlInBrowser(url);
                        } catch (clickErr) {}
                    };
                    link.parentNode.replaceChild(div, link);
                } catch (linkErr) {}
            });
        } catch (err) {}
    }

    async function replaceInstagramLinkWithDiv() {
        try {
            if (
                !window.location.href.toLowerCase().includes('tournaments') ||
                typeof WTN === 'undefined' ||
                typeof WTN.openUrlInBrowser !== 'function'
            ) {
                return;
            }
            const instaLink = Array.from(document.querySelectorAll('a'))
                .find(a => a.textContent.trim().toLowerCase() === 'visit instagram');
            if (!instaLink) return;

            const url = instaLink.href;
            const div = document.createElement('div');
            for (const attr of instaLink.attributes) {
                if (attr.name !== 'href') {
                    div.setAttribute(attr.name, attr.value);
                }
            }
            while (instaLink.firstChild) {
                div.appendChild(instaLink.firstChild);
            }
            div.onclick = function(e) {
                try {
                    e.preventDefault();
                    WTN.openUrlInBrowser(url);
                } catch (clickErr) {}
            };
            instaLink.parentNode.replaceChild(div, instaLink);
        } catch (err) {}
    }

    async function applyVenueButtonOverridesAndroid() {
        if (!window.location.href.toLowerCase().includes('venues')) return;
        try {
            const mapBtn = document.querySelector('.venue-map-btn[data-google-map-url]');
            if (mapBtn) {
                const url = mapBtn.getAttribute('data-google-map-url');
                if (url && typeof WTN !== 'undefined' && typeof WTN.openUrlInBrowser === 'function') {
                    mapBtn.onclick = null;
                    mapBtn.removeAttribute('onclick');
                    mapBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        WTN.openUrlInBrowser(url);
                    }, true);
                }
            }
        } catch (e) {}
        try {
            const infoBtn = document.querySelector('.venue-info-btn[data-venue-url]');
            if (infoBtn) {
                const url = infoBtn.getAttribute('data-venue-url');
                if (url && typeof WTN !== 'undefined' && typeof WTN.openUrlInBrowser === 'function') {
                    infoBtn.onclick = null;
                    infoBtn.removeAttribute('onclick');
                    infoBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        WTN.openUrlInBrowser(url);
                    }, true);
                }
            }
        } catch (e) {}
    }

    function addMarginToTournamentChild() {
        try {
            if (!window.location.href.toLowerCase().includes('tournaments')) return;

            const tabs = ["Schedule", "Results", "Standings"];
            const buttons = Array.from(document.querySelectorAll("button"));

            for (let btn of buttons) {
                const text = btn.textContent.trim();
                if (tabs.includes(text)) {
                    const tabsWrapper = btn.parentElement;
                    if (tabsWrapper && tabsWrapper.parentElement) {
                        const parent = tabsWrapper.parentElement;
                        const childDivs = parent.querySelectorAll(":scope > div");
                        if (childDivs.length > 1) {
                            const firstChildAfterTabs = childDivs[1];
                            firstChildAfterTabs.style.marginBottom = "100px";
                        }
                    }
                    break;
                }
            }
        } catch (e) {}
    }

    function setMobilePlatformConfigIfAvailable(platform, retries = 20) {
        try {
            if (window.handleMobileConfigSet) return;
            if (typeof window.handleMobileConfig === 'function') {
                const result = window.handleMobileConfig(platform);
                if (result) {
                    window.handleMobileConfigSet = true;
                    window.mobilePlatform = platform;
                    return;
                }
            }
            if (retries > 0) {
                setTimeout(() => setMobilePlatformConfigIfAvailable(platform, retries - 1), 200);
            }
        } catch (err) {}
    }

    async function runAllOverrides() {
        await setMobilePlatformConfigIfAvailable('android', 20);
        await loadWebToNative();
        await updateNavigationContainerLayout();
        await replaceNewsAndUpdatesLinksWithDivs();
        await toggleFooterDisplay();
        await makeEmailClickable();
        await addMarginToAlsoHappeningContainer();
        await disableInputAutofill();
        await removeCommunityHeader();
        await interceptLocationButtons();
        await replaceInstagramLinkWithDiv();
        await applyVenueButtonOverridesAndroid();
        await addMarginToTournamentChild();
    }

    runAllOverrides();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                runAllOverrides();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        runAllOverrides();
    });

    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

})();
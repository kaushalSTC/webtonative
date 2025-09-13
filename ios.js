(function() {
    'use strict';

    function adjustGenderSelectHeightIOS() {
        const nameInput = document.querySelector('input[name="name"]');
        const genderSelect = document.querySelector('select[name="gender"]');
        if (nameInput && genderSelect) {
            const nameHeight = window.getComputedStyle(nameInput).height;
            genderSelect.style.height = nameHeight;
        }
    }

    function fixNavigationContainerBorderIOS() {
        if (isNavBorderFixed) return;
        const navigationContainer = document.querySelector('.navigation-container');
        if (navigationContainer) {
            navigationContainer.style.borderBottom = '1px solid rgb(0, 0, 0)';
        }
        isNavBorderFixed = true;
    }

    function overrideExploreNowLinkIOS() {
        try {
            if (!window.location.href.toLowerCase().includes('community')) return;
            const links = document.querySelectorAll('a');
            for (let link of links) {
                if (link.innerText.trim() === 'Explore Now') {
                    link.onclick = function(e) {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                    };
                    break;
                }
            }
        } catch (error) {}
    }

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


    let isFooterDisplayToggled = false;
    let isEmailClickable = false;
    let isNavBorderFixed = false;
    let isAlsoHappeningMarginAdded = false;
    let isInputAutofillDisabled = false;
    let isCommunityHeaderRemoved = false;
    let isLocationButtonsIntercepted = false;

    async function updateNavigationContainerLayout() {
        const navContainer = document.querySelector('.navigation-container');
        if (!navContainer) return;
        const parent = navContainer.parentElement;
        const safeAreaPadding = window.innerHeight * 0.018;
        if (parent) {
            parent.className = '';
            parent.classList.add(
                'fixed', 'bottom-0', 'left-0', 'w-full', 'z-50', 'bg-white', 'border-t', 'border-f2f2f2'
            );
            parent.style.borderTopLeftRadius = '1rem';
            parent.style.borderTopRightRadius = '1rem';
            parent.style.paddingBottom = `${safeAreaPadding}px`;
        }
        navContainer.className = '';
        navContainer.classList.add(
            'navigation-container', 'flex', 'items-center', 'justify-between', 'gap-3',
            'px-4', 'py-2', 'bg-white', 'w-full'
        );
        navContainer.style.borderTopLeftRadius = '1rem';
        navContainer.style.borderTopRightRadius = '1rem';
        navContainer.querySelectorAll('span.bg-56b918').forEach(span => {
            span.style.bottom = `${safeAreaPadding}px`;
        });
    }

    async function toggleFooterDisplay() {
        if (isFooterDisplayToggled) return;
        const footerWrapper = document.querySelector('.main-footer-wrapper');
        if (footerWrapper) {
            const currentUrl = window.location.href.toLowerCase();
            if (currentUrl.includes('personal-details')) {
                footerWrapper.style.display = 'block';
                footerWrapper.style.height = '20vh';
                removeFooterChildren();
                adjustGenderSelectHeightIOS();
            } else {
                footerWrapper.style.display = 'none';
            }
        }
        isFooterDisplayToggled = true;
    }

    async function makeEmailClickable() {
        if (isEmailClickable) return;
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
        }
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
        isEmailClickable = true;
    }

    async function addMarginToAlsoHappeningContainer() {
        if (isAlsoHappeningMarginAdded) return;
        const alsoHappeningContainer = document.querySelector('.also-happening-container');
        if (alsoHappeningContainer) {
            alsoHappeningContainer.style.marginBottom = '10vh';
        }
        isAlsoHappeningMarginAdded = true;
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
        if (isInputAutofillDisabled) return;
        if (!window.location.href.toLowerCase().includes('login')) return;
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            processInputForAutofill(input.type, input);
        });
        isInputAutofillDisabled = true;
    }

    async function removeCommunityHeader() {
        if (isCommunityHeaderRemoved) return;
        if (!window.location.href.toLowerCase().includes('community.picklebay.com')) return;
        const headers = document.querySelectorAll('body > header.header');
        headers.forEach(header => {
            if (header.id !== 'mainHeader') {
                header.remove();
            }
        });
        isCommunityHeaderRemoved = true;
    }

    async function interceptLocationButtons() {
        if (isLocationButtonsIntercepted) return;
        const locationButton = document.querySelector('.currentLocation-access');
        if (locationButton) {
            const parentButton = locationButton.closest('button');
            if (parentButton) {
                if (!parentButton.hasAttribute('data-location-intercepted')) {
                    parentButton.setAttribute('data-location-intercepted', 'true');
                    parentButton.addEventListener('click', handleLocationButtonClick, true);
                }
            }
        }
        isLocationButtonsIntercepted = true;
    }

    function removeFooterChildren() {
        const footerWrapper = document.querySelector('.main-footer-wrapper');
        if (footerWrapper) {
            while (footerWrapper.firstChild) {
                footerWrapper.removeChild(footerWrapper.firstChild);
            }
        }
    }

    function appendLoadInParamToLinks() {
        const links = document.querySelectorAll('.news-and-updates a');
        links.forEach((link) => {
            try {
                const url = new URL(link.href, window.location.origin);
                url.searchParams.set('loadIn', 'defaultBrowser');
                link.href = url.toString();
            } catch (e) {}
        });
    }

    async function appendLoadInParamToInstagramLinkIOS() {
        if (!window.location.href.toLowerCase().includes('tournaments')) return;
        const instaLink = Array.from(document.querySelectorAll('a'))
            .find(a => a.textContent.trim().toLowerCase() === 'visit instagram');
        if (instaLink) {
            try {
                const url = new URL(instaLink.href, window.location.origin);
                url.searchParams.set('loadIn', 'defaultBrowser');
                instaLink.href = url.toString();
            } catch (e) {}
        }
    }

    async function matchTourismFormInputHeightsIOS() {
        if (!window.location.href.toLowerCase().includes('picklebay-retreats')) return;
        const firstNameInput = document.querySelector('[name="firstName"]');
        if (!firstNameInput) return;
        const firstNameHeight = window.getComputedStyle(firstNameInput).height;
        const genderSelect = document.querySelector('[name="gender"]');
        const dobInput = document.querySelector('[name="dateOfBirth"]');
        if (genderSelect) genderSelect.style.height = firstNameHeight;
        if (dobInput) dobInput.style.height = firstNameHeight;
    }

    function applyVenueButtonOverridesIOS() {
        if (!window.location.href.toLowerCase().includes('venues')) return;
        try {
            const mapBtn = document.querySelector('.venue-map-btn[data-google-map-url]');
            if (mapBtn) {
                const url = mapBtn.getAttribute('data-google-map-url');
                if (url) {
                    const newBtn = mapBtn.cloneNode(true);
                    const a = document.createElement('a');
                    let href = url;
                    try {
                        const u = new URL(url, window.location.origin);
                        u.searchParams.set('loadIn', 'defaultBrowser');
                        href = u.toString();
                    } catch (e) {}
                    a.setAttribute('href', href);
                    a.setAttribute('target', '_blank');
                    a.className = newBtn.className;
                    while (newBtn.firstChild) {
                        a.appendChild(newBtn.firstChild);
                    }
                    Array.from(newBtn.attributes).forEach(attr => {
                        if (!['class', 'onclick', 'onmouseover', 'onmouseout', 'data-google-map-url'].includes(attr.name)) {
                            a.setAttribute(attr.name, attr.value);
                        }
                    });
                    mapBtn.parentNode.replaceChild(a, mapBtn);
                }
            }
        } catch (e) {}
        try {
            const infoBtn = document.querySelector('.venue-info-btn[data-venue-url]');
            if (infoBtn) {
                const url = infoBtn.getAttribute('data-venue-url');
                if (url) {
                    const newBtn = infoBtn.cloneNode(true);
                    const a = document.createElement('a');
                    let href = url;
                    try {
                        const u = new URL(url, window.location.origin);
                        u.searchParams.set('loadIn', 'defaultBrowser');
                        href = u.toString();
                    } catch (e) {}
                    a.setAttribute('href', href);
                    a.setAttribute('target', '_blank');
                    a.className = newBtn.className;
                    while (newBtn.firstChild) {
                        a.appendChild(newBtn.firstChild);
                    }
                    Array.from(newBtn.attributes).forEach(attr => {
                        if (!['class', 'onclick', 'onmouseover', 'onmouseout', 'data-venue-url'].includes(attr.name)) {
                            a.setAttribute(attr.name, attr.value);
                        }
                    });
                    infoBtn.parentNode.replaceChild(a, infoBtn);
                }
            }
        } catch (e) {}
    }

    

    async function runAllOverrides() {
        await loadWebToNative();
        await updateNavigationContainerLayout();
        await toggleFooterDisplay();
        await makeEmailClickable();
        await fixNavigationContainerBorderIOS();
        await addMarginToAlsoHappeningContainer();
        await disableInputAutofill();
        await removeCommunityHeader();
        await interceptLocationButtons();
        await overrideExploreNowLinkIOS();
        await appendLoadInParamToLinks();
        await matchTourismFormInputHeightsIOS();
        await appendLoadInParamToInstagramLinkIOS();
        applyVenueButtonOverridesIOS();
        await addMarginToTournamentChild()
    }

    runAllOverrides();

    const observer = new MutationObserver(mutations => {
        isFooterDisplayToggled = false;
        isEmailClickable = false;
        isNavBorderFixed = false;
        isAlsoHappeningMarginAdded = false;
        isInputAutofillDisabled = false;
        isCommunityHeaderRemoved = false;
        isLocationButtonsIntercepted = false;
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
        isFooterDisplayToggled = false;
        isEmailClickable = false;
        isNavBorderFixed = false;
        isAlsoHappeningMarginAdded = false;
        isInputAutofillDisabled = false;
        isCommunityHeaderRemoved = false;
        isLocationButtonsIntercepted = false;
        runAllOverrides();
    });

    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

})();
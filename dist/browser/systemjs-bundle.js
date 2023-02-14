System.register("lib", [], function (exports_1, context_1) {
    "use strict";
    var bodyDatasetName, elementDatasetName, lockStyle, scrollYContentLockStyle, removeAllScrollLocks, removeScrollLock, lockBodyScroll, getLockContentScrollResizeObserver, lockContentScrollElement, unlockBodyScroll, lockScrollElement, unlockScrollElement, addDynamicStyleOverride, addDynamicStyleOverrideToRemove, addStyleOverride, removeStyleOverride, registerLockIdOnBody, unregisterLockIdOnBody, registerLockIdOnElement, getElementLockId, getAllLockedElements, hasActiveScrollLocks, unregisterLockIdOnElement, getBody, getHtml, getElement, preventTouchmoveHandler, getChildNodesHeight, isIOS;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            bodyDatasetName = "tsslock";
            elementDatasetName = "tsslockid";
            lockStyle = ";overscroll-behavior:none!important;-webkit-overflow-scrolling: auto!important;overflow:hidden!important;";
            scrollYContentLockStyle = ";overflow-y:unset!important;";
            exports_1("removeAllScrollLocks", removeAllScrollLocks = (observer) => {
                getAllLockedElements().forEach((element) => {
                    if (!(element instanceof HTMLElement)) {
                        console.warn("removing scroll lock for Elment", element, "is not possible, as it is not a HTMLElement");
                        return;
                    }
                    removeScrollLock(element, observer);
                });
                unlockBodyScroll();
            });
            exports_1("removeScrollLock", removeScrollLock = (element, observer) => {
                unregisterLockIdOnBody(element);
                unlockScrollElement(element);
                if (observer) {
                    observer.disconnect();
                }
                if (!hasActiveScrollLocks()) {
                    unlockBodyScroll();
                }
            });
            exports_1("lockBodyScroll", lockBodyScroll = () => {
                const html = getHtml();
                const body = getBody();
                addStyleOverride(html, lockStyle);
                addStyleOverride(body, lockStyle, addDynamicStyleOverride());
            });
            exports_1("getLockContentScrollResizeObserver", getLockContentScrollResizeObserver = () => {
                if (!document) {
                    return null;
                }
                return new ResizeObserver((entries) => {
                    var _a;
                    if (entries) {
                        const scrollContentElement = (_a = entries[0]) === null || _a === void 0 ? void 0 : _a.target.parentElement;
                        if (scrollContentElement && scrollContentElement.parentElement) {
                            unlockScrollElement(scrollContentElement);
                            lockContentScrollElement(scrollContentElement.parentElement, scrollContentElement);
                        }
                    }
                });
            });
            exports_1("lockContentScrollElement", lockContentScrollElement = (containerElement, scrollContentElement) => {
                const containerHeight = containerElement.getBoundingClientRect().height;
                const contentHeight = scrollContentElement.getBoundingClientRect().height;
                const contentChildrenHeight = getChildNodesHeight(scrollContentElement.children);
                if (containerHeight >= contentHeight &&
                    containerHeight >= contentChildrenHeight) {
                    lockScrollElement(scrollContentElement);
                }
            });
            unlockBodyScroll = () => {
                const html = getHtml();
                const body = getBody();
                removeStyleOverride(html, lockStyle);
                removeStyleOverride(body, addDynamicStyleOverrideToRemove(body, lockStyle), true);
            };
            lockScrollElement = (element) => {
                addStyleOverride(element, scrollYContentLockStyle);
                if (isIOS) {
                    element.addEventListener("touchmove", preventTouchmoveHandler);
                }
            };
            unlockScrollElement = (element) => {
                removeStyleOverride(element, scrollYContentLockStyle);
                unregisterLockIdOnElement(element);
                if (isIOS) {
                    element.removeEventListener("touchmove", preventTouchmoveHandler);
                }
            };
            addDynamicStyleOverride = () => {
                if (window.scrollY > 0) {
                    return `position:fixed;top:-${window.scrollY}px;`;
                }
                return `position:fixed;top:0px;`;
            };
            addDynamicStyleOverrideToRemove = (element, styleOverride) => {
                return `${styleOverride}position:fixed;top:${element.style.top};`;
            };
            addStyleOverride = (element, styleOverride, dynamicStyleOverride = '') => {
                const currentStyle = element.getAttribute("style");
                if (currentStyle === "" || currentStyle === null) {
                    element.setAttribute("style", `${styleOverride}${dynamicStyleOverride}`);
                    return;
                }
                if (currentStyle.indexOf(styleOverride) > -1) {
                    return;
                }
                element.setAttribute("style", `${currentStyle}${styleOverride}${dynamicStyleOverride}`);
            };
            removeStyleOverride = (element, styleOverride, restoreScrollPosition = false) => {
                const currentStyle = element.getAttribute("style");
                if (currentStyle == null) {
                    return;
                }
                const scrollPosition = Number(element.style.top.replace('px', '')) * -1;
                const newStyle = currentStyle.replace(new RegExp(styleOverride + "$"), "");
                if (newStyle === "") {
                    element.removeAttribute("style");
                }
                else {
                    element.setAttribute("style", newStyle);
                }
                if (restoreScrollPosition) {
                    window.scrollTo(0, scrollPosition);
                }
            };
            exports_1("registerLockIdOnBody", registerLockIdOnBody = (id) => {
                const body = getBody();
                if (!body.dataset[bodyDatasetName]) {
                    body.dataset[bodyDatasetName] = id;
                    return;
                }
                if (body.dataset[bodyDatasetName].indexOf(id) > -1) {
                    return;
                }
                body.dataset[bodyDatasetName] += `,${id}`;
            });
            unregisterLockIdOnBody = (element) => {
                const body = getBody();
                if (!body.dataset[bodyDatasetName]) {
                    return;
                }
                if (body.dataset[bodyDatasetName].indexOf(",") === -1) {
                    body.removeAttribute(`data-${bodyDatasetName}`);
                    return;
                }
                const id = getElementLockId(element);
                body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(`,${id}`, "");
                return;
            };
            exports_1("registerLockIdOnElement", registerLockIdOnElement = (element, id) => {
                return (element.dataset[elementDatasetName] = id);
            });
            getElementLockId = (element) => {
                return element.dataset[elementDatasetName];
            };
            getAllLockedElements = () => document.querySelectorAll(`[data-${elementDatasetName}]`);
            hasActiveScrollLocks = () => {
                return getAllLockedElements().length > 0;
            };
            unregisterLockIdOnElement = (element) => {
                return element.removeAttribute(`data-${elementDatasetName}`);
            };
            getBody = () => {
                return getElement('body');
            };
            getHtml = () => {
                return getElement('html');
            };
            getElement = (selector) => {
                const element = document.querySelector(selector);
                if (!(element instanceof HTMLElement)) {
                    throw `could not locate ${selector} in DOM`;
                }
                return element;
            };
            preventTouchmoveHandler = (e) => {
                try {
                    e.preventDefault();
                }
                catch (e) { }
            };
            getChildNodesHeight = (children) => {
                let height = 0;
                for (const child of children) {
                    height = height + child.getBoundingClientRect().height;
                }
                return height;
            };
            isIOS = typeof window !== "undefined" &&
                ((navigator.userAgent.indexOf("Mac") > -1 && "ontouchend" in document) ||
                    (() => {
                        let isIOSDevice = false;
                        ["iPad", "iPhone", "iPod"].forEach((device) => {
                            if (navigator.platform.indexOf(device) > -1) {
                                isIOSDevice = true;
                            }
                        });
                        return isIOSDevice;
                    })());
        }
    };
});
System.register("index", ["lib"], function (exports_2, context_2) {
    "use strict";
    var lib_1;
    var __moduleName = context_2 && context_2.id;
    function useBodyScrollLock(id, containerElement, scrollContentElement) {
        lib_1.registerLockIdOnBody(id);
        lib_1.registerLockIdOnElement(containerElement, id);
        lib_1.lockBodyScroll();
        const observer = lib_1.getLockContentScrollResizeObserver();
        if (scrollContentElement && observer) {
            lib_1.lockContentScrollElement(containerElement, scrollContentElement);
            Array.from(scrollContentElement.children).forEach((child) => {
                observer.observe(child);
            });
        }
        return {
            removeScrollLock: () => lib_1.removeScrollLock(containerElement, observer),
            removeAllScrollLocks: () => lib_1.removeAllScrollLocks(observer),
        };
    }
    exports_2("default", useBodyScrollLock);
    exports_2("useBodyScrollLock", useBodyScrollLock);
    return {
        setters: [
            function (lib_1_1) {
                lib_1 = lib_1_1;
            }
        ],
        execute: function () {
            exports_2("lockBodyScroll", lib_1.lockBodyScroll);
            exports_2("removeAllScrollLocks", lib_1.removeAllScrollLocks);
            exports_2("removeScrollLock", lib_1.removeScrollLock);
        }
    };
});
//# sourceMappingURL=systemjs-bundle.js.map
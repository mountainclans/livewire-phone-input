// LaravelTelInput
(function () {

    'use strict';

    const laravelTelInputConfig = {
        "allowDropdown": true,
        "autoHideDialCode": true,
        "autoPlaceholder": "polite",
        "customContainer": "",
        "customPlaceholder": null,
        "dropdownContainer": null,
        "excludeCountries": [],
        "formatOnDisplay": true,
        "geoIpLookup": "ipinfo",
        "initialCountry": "ES",
        "localizedCountries": [],
        "nationalMode": true,
        "onlyCountries": [],
        "placeholderNumberType": "MOBILE",
        "preferredCountries": ["ES", "DE", "RU", "US", "GB"],
        "separateDialCode": false,
        "utilsScript": "./utils.js"
    }

    function setCookie(
        cookieName,
        cookieValue,
        expiryDays = 90,
        path = '/',
        domain = null
    ) {
        let cookieString = `${cookieName}=${cookieValue};`
        if (expiryDays) {
            const d = new Date();
            d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
            cookieString += `expires=${d.toUTCString()};`
        }
        if (path) {
            cookieString += `path=${path};`
        }
        if (domain) {
            cookieString += `domain=${domain};`
        }
        document.cookie = cookieString;
    }

    function getCookie(cookieName) {
        let name = cookieName + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function removeCookie(cookieName, path = null, domain = null) {
        let cookieString = `${cookieName}=;`
        const d = new Date();
        d.setTime(d.getTime() - (30 * 24 * 60 * 60 * 1000));
        cookieString += `expires=${d.toUTCString()};`
        if (path) {
            cookieString += `path=${path};`
        }
        if (domain) {
            cookieString += `domain=${domain};`
        }
        document.cookie = cookieString;
    }

    // Хранилище для инстансов, чтобы избежать дублирования
    const telInputInstances = new WeakMap();

    // init a tell input
    function initTelInput(telInput, options = {}) {
        // Проверяем, не был ли уже инициализирован этот input
        if (telInputInstances.has(telInput)) {
            return; // Пропускаем уже инициализированные
        }

        // tel input country cookie
        const IntlTelInputSelectedCountryCookie = `IntlTelInputSelectedCountry_${telInput.dataset.phoneInputId}`;

        // allow each input to have its own initialCountry and geoIpLookup
        window.intlTelInputGlobals.autoCountry = getCookie(IntlTelInputSelectedCountryCookie) || window.intlTelInputGlobals.autoCountry;

        // fix autofill bugs on page refresh in Firefox
        let form = telInput.closest('form');
        if (form) {
            form.setAttribute('autocomplete', 'off');
        }

        // geoIpLookup option
        if (options.geoIpLookup == null) {
            delete options.geoIpLookup;
        } else if (options.geoIpLookup === 'ipinfo') {
            options.geoIpLookup = function (success, failure) {
                let country = getCookie(IntlTelInputSelectedCountryCookie);
                if (country) {
                    success(country);
                } else {
                    fetch('https://ipinfo.io/json')
                        .then(res => res.json())
                        .then(data => data)
                        .then((data) => {
                            let country = data.country?.toUpperCase();
                            success(country);
                            setCookie(IntlTelInputSelectedCountryCookie, country);
                        })
                        .catch(error => success('US'));
                }
            }
        } else if (typeof window[options.geoIpLookup] === 'function') {
            options.geoIpLookup = window[options.geoIpLookup];
        } else {
            if (typeof options.geoIpLookup !== 'function') {
                throw new TypeError(
                    `Laravel-Tel-Input: Undefined function '${options.geoIpLookup}' specified in tel-input.options.geoIpLookup.`
                );
            }
            delete options.geoIpLookup;
        }

        // customPlaceholder option
        if (options.customPlaceholder == null) {
            delete options.customPlaceholder;
        } else if (typeof window[options.customPlaceholder] === 'function') {
            options.customPlaceholder = window[options.customPlaceholder];
        } else {
            if (typeof options.customPlaceholder !== 'function') {
                throw new TypeError(
                    `Laravel-Tel-Input: Undefined function '${options.customPlaceholder}' specified in tel-input.options.customPlaceholder.`
                );
            }
            delete options.customPlaceholder;
        }

        // utilsScript option
        if (options.utilsScript) {
            options.utilsScript = options.utilsScript.charAt(0) == '/' ? options.utilsScript : '/' + options.utilsScript;
        }

        // init the tel input
        const itiPhone = window.intlTelInput(telInput, options);

        // Сохраняем инстанс, чтобы не создавать дубликаты
        telInputInstances.set(telInput, itiPhone);

        // countrychange event function
        const countryChangeEventFunc = function () {
            let countryData = itiPhone.getSelectedCountryData();
            if (countryData.iso2) {
                setCookie(IntlTelInputSelectedCountryCookie, countryData.iso2?.toUpperCase());

                if (this.dataset.phoneCountryInput && countryData.iso2) {
                    const phoneCountryInput = document.querySelector(this.dataset.phoneCountryInput);
                    if (phoneCountryInput) {
                        let oldValue = phoneCountryInput.value?.trim();
                        phoneCountryInput.value = countryData.iso2?.toUpperCase();
                        if (phoneCountryInput.value !== oldValue || phoneCountryInput.value != '') {
                            phoneCountryInput.dispatchEvent(new KeyboardEvent('change'));
                        }
                    }
                }
                if (this.dataset.phoneDialCodeInput && countryData.dialCode) {
                    const phoneDialCodeInput = document.querySelector(this.dataset.phoneDialCodeInput);
                    if (phoneDialCodeInput) {
                        let oldValue = phoneDialCodeInput.value;
                        phoneDialCodeInput.value = countryData.dialCode;
                        if (phoneDialCodeInput.value !== oldValue || phoneDialCodeInput.value != '') {
                            phoneDialCodeInput.dispatchEvent(new KeyboardEvent('change'));
                        }
                    }
                }
                telInput.dispatchEvent(new KeyboardEvent('change'));
            }
        }

        // tel input change event function
        const telInputChangeEventFunc = function () {
            if (this.dataset.phoneInput) {
                const phoneInput = document.querySelector(this.dataset.phoneInput);
                if (phoneInput) {
                    let oldValue = phoneInput.value?.trim();
                    phoneInput.value = itiPhone.getNumber();

                    if (phoneInput.value !== oldValue && (itiPhone.isValidNumber() === true || itiPhone.isValidNumber() === null)) {
                        phoneInput.dispatchEvent(new KeyboardEvent('change'));
                        phoneInput.dispatchEvent(new KeyboardEvent('input'));
                        phoneInput.dispatchEvent(new CustomEvent('telchange', {
                            detail: {
                                valid: true,
                                validNumber: phoneInput.value,
                                number: itiPhone.getNumber(),
                                country: itiPhone.getSelectedCountryData().iso2?.toUpperCase(),
                                countryName: itiPhone.getSelectedCountryData().name,
                                dialCode: itiPhone.getSelectedCountryData().dialCode
                            }
                        }));
                    } else {
                        if (itiPhone.isValidNumber() === false) {
                            phoneInput.dispatchEvent(new KeyboardEvent('change'));
                            phoneInput.dispatchEvent(new KeyboardEvent('input'));
                            phoneInput.dispatchEvent(new CustomEvent('telchange', {
                                detail: {
                                    valid: false,
                                    validNumber: phoneInput.value,
                                    number: itiPhone.getNumber(),
                                    country: itiPhone.getSelectedCountryData().iso2?.toUpperCase(),
                                    countryName: itiPhone.getSelectedCountryData().name,
                                    dialCode: itiPhone.getSelectedCountryData().dialCode
                                }
                            }));
                        }
                    }
                }
            }
        }

        telInput.removeEventListener('countrychange', countryChangeEventFunc);
        telInput.addEventListener('countrychange', countryChangeEventFunc);
        telInput.removeEventListener('change', telInputChangeEventFunc);
        telInput.addEventListener('change', telInputChangeEventFunc);

        if (telInput.dataset.phoneInput) {
            const phoneInput = document.querySelector(telInput.dataset.phoneInput);
            if (phoneInput) {
                let oldValue = phoneInput.value?.trim();
                if (oldValue != '' && oldValue.charAt(0) != '+' && oldValue.charAt(0) != '0') {
                    oldValue = `+${oldValue}`;
                }
                const changeHandler = function () {
                    let newValue = this.value?.trim();
                    if (newValue != oldValue && newValue != '') {
                        itiPhone.setNumber(newValue);
                    }
                }
                phoneInput.removeEventListener('change', changeHandler);
                phoneInput.addEventListener('change', changeHandler);
            }
        }

        if (telInput.dataset.phoneCountryInput) {
            const phoneCountryInput = document.querySelector(telInput.dataset.phoneCountryInput);
            if (phoneCountryInput) {
                const changeHandler = function () {
                    itiPhone.setCountry(this.value?.trim());
                    phoneCountryInput.dispatchEvent(new Event("input"))
                }
                phoneCountryInput.removeEventListener('change', changeHandler);
                phoneCountryInput.addEventListener('change', changeHandler);
            }
        }

        telInput.dispatchEvent(new KeyboardEvent('countrychange'));

        document.addEventListener("turbolinks:load", function () {
            if (telInput) {
                telInput.dispatchEvent(new KeyboardEvent('countrychange'));
            }
        });

        document.addEventListener("turbo:load", function () {
            if (telInput) {
                telInput.dispatchEvent(new KeyboardEvent('countrychange'));
            }
        });
    }

    function renderTelInput() {
        if (typeof window.intlTelInput !== 'function') {
            throw new TypeError(
                'Laravel-Tel-Input: requires International Telephone Input (https://github.com/jackocnr/intl-tel-input). Please install with NPM or include the CDN.'
            );
        }

        const telInputconfig = laravelTelInputConfig;
        const telInputs = document.querySelectorAll(".iti--laravel-tel-input");

        if (telInputs.length > 0) {
            for (let i = 0; i < telInputs.length; i++) {
                initTelInput(telInputs[i], telInputconfig);
            }
        }
    }

    // ИСПРАВЛЕНИЕ: Все слушатели должны быть на верхнем уровне

    // Первая инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderTelInput);
    } else {
        // DOM уже загружен
        renderTelInput();
    }

    // Livewire navigation
    document.addEventListener("livewire:navigated", function () {
        setTimeout(function () {
            renderTelInput();
        }, 5);
    });

    // Пользовательское событие для повторного рендеринга
    document.addEventListener("telDOMChanged", function () {
        setTimeout(function () {
            renderTelInput();
        }, 5);
    });

    // Livewire hook для новых компонентов
    if (window.Livewire) {
        window.Livewire.hook('component.initialized', component => {
            setTimeout(function () {
                renderTelInput();
            }, 5);
        });
    }

})();

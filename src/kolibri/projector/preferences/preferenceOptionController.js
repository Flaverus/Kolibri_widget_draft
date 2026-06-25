import {
    PROPERTY,
    MEDIA_QUERY,
    VALUE
} from "../../presentationModel.js";

import { PreferenceOptionModel } from "./preferenceOptionModel.js";

export { PreferenceOptionController };

/**
 * PreferenceOptionControllerType coordinates changes between the preference view,
 * the underlying presentation model, local storage, and the document root styling.
 *
 * @typedef PreferenceOptionControllerType
 * @property { (newValue: String) => void } setValue - Sets a new value for the preference, updates local storage, and applies CSS custom property changes (supporting view transitions).
 * @property { () => String } getValue - Gets the current selected preference value (e.g., 'system', 'true', 'false').
 * @property { (callback: (value: String) => void) => void } onValueChanged - Registers a callback to react to incoming preference value changes.
 * @property { () => String } getProperty - Gets the target CSS Custom Property name (unique identifier).
 * @property { () => String } getMediaQuery - Gets the associated responsive media query string.
 */

/**
 * Constructor for a PreferenceOptionControllerType.
 * It initializes the preference state from local storage or sets it to default,
 * and binds listeners to synchronize changes with document-level styles.
 *
 * @constructor
 * @param { !String } property - The target CSS Custom Property name (e.g., '--color-scheme').
 * @param { String } [mediaQuery] - Optional native media query string to evaluate system/OS settings.
 * @returns { PreferenceOptionControllerType }
 * @example
 * const contrastController = PreferenceOptionController('--prefers-contrast', '(prefers-contrast: more)');
 */

const PreferenceOptionController = (property, mediaQuery) => {
    const root                  = document.documentElement;
    const savedPropertyValue    = localStorage.getItem(property) || undefined; //If no value is present in the local storage use undefined to take the default value from within the preferenceOptionModel
    const preferenceOptionModel = PreferenceOptionModel({
        property,
        mediaQuery,
        value: savedPropertyValue
    });

    const controller = {
        setValue: newValue => {
            localStorage.setItem(preferenceOptionModel.getPreferenceObs(PROPERTY).getValue(), newValue);
            preferenceOptionModel.getPreferenceObs(VALUE).setValue(newValue);

            const appliedValue = (newValue === 'system' && mediaQuery !== '')
                               ? window.matchMedia(mediaQuery).matches
                               : newValue;

            const isPreloading      = document.body.classList.contains('preload');
            const isReducedMotionOn = root.style.getPropertyValue('--prefers-reduced-motion') === 'true' && property !== '--prefers-reduced-motion';

            if (isPreloading || !isReducedMotionOn) {
                root.style.setProperty(property, appliedValue);
            } else {
                document.startViewTransition(() => {
                    root.style.setProperty(property, appliedValue);
                });
            }
        },
        getValue:       preferenceOptionModel.getPreferenceObs(VALUE).getValue,
        onValueChanged: preferenceOptionModel.getPreferenceObs(VALUE).onChange,
        getProperty:    preferenceOptionModel.getPreferenceObs(PROPERTY).getValue,
        getMediaQuery:  preferenceOptionModel.getPreferenceObs(MEDIA_QUERY).getValue,
    };

    controller.setValue(controller.getValue());

    return controller;
};

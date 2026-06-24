import {
    PROPERTY,
    MEDIA_QUERY,
    VALUE
} from "../../presentationModel.js";

import { PreferenceOptionModel } from "./preferenceOptionModel.js";

export { PreferenceOptionController };

const PreferenceOptionController = (property, mediaQuery) => {
    const root                  = document.documentElement;
    const savedPropertyValue    = localStorage.getItem(property) || undefined; //If no value is present in the local storage use undefined to take the default value from within the preferenceOptionModel
    const preferenceOptionModel = PreferenceOptionModel({
        property,
        mediaQuery,
        value: savedPropertyValue
    });

    return {
        setValue: newValue => {
            localStorage.setItem(preferenceOptionModel.getPreferenceObs(PROPERTY).getValue(), newValue);
            preferenceOptionModel.getPreferenceObs(VALUE).setValue(newValue);

            const appliedValue = (newValue === 'system' && mediaQueryString !== '')
                               ? window.matchMedia(mediaQueryString).matches
                               : newValue;

            // Special case for reduced motion where a transition is triggered but not on initial page load
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
    }
};


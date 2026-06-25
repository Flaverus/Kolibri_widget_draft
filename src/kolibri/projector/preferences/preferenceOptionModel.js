import {
    Attribute,
    PROPERTY,
    MEDIA_QUERY,
    VALUE
} from "../../presentationModel.js";

export { PreferenceOptionModel }

/**
 * PreferenceOptionModelType abstracts a single preference configuration option
 * (e.g., a theme selector, font scale, or contrast preference).
 * It maps a user's selection value directly to a target CSS Custom Property
 * and handles optional responsive media query contexts.
 *
 * @typedef PreferenceOptionModelType
 * @template T
 * @property { () => String } getQualifier - a function that returns the unique qualifier (the CSS custom property name) for this preference.
 * @property { (obsType: ObservableTypeString) => IObservable<T> } getPreferenceObs - a function that returns the observable stored under the given observable string. Throws an error if the observable does not exist.
 */

/**
 * Constructor for a PreferenceOptionModelType.
 *
 * @constructor
 * @param { Object } config - The configuration object for the preference option.
 * @param { !String } config.property - The target CSS Custom Property name (e.g., '--color-scheme'). Serves as the unique qualifier.
 * @param { String } [config.mediaQuery] - Optional native media query string to be able to check OS and browser settings from the user.
 * @returns { PreferenceOptionModelType }
 * @example
 * const contrastModel = PreferenceOptionModel({ property: '--prefers-contrast', mediaQuery: '(prefers-contrast: more)' });
 */

const PreferenceOptionModel = ({property, mediaQuery, value = 'system'}) => {
    const preferenceAttr = Attribute(value, property);

    preferenceAttr.getObs(PROPERTY, property);
    preferenceAttr.getObs(MEDIA_QUERY, mediaQuery);

    return {
        getQualifier:     () => preferenceAttr.getQualifier(),
        getPreferenceObs: obsType => {
                              if (!preferenceAttr.hasObs(obsType)) {
                                  throw new Error(obsType + ' is not defined for preferenceOptionModel.')
                              }
                              return preferenceAttr.getObs(obsType)
                          },
    };
};

import { PreferenceOptionController } from "../../kolibri/preferences/preferenceOptionController.js";
import { projectWidget } from "../../kolibri/preferences/preferencesWidgetProjector.js";

// Objects for all settings and their values
const preferencesBlueprint = [
    {
        property: '--prefers-reduced-motion',
        mediaQuery: '(prefers-reduced-motion: reduce)',
        label: 'Reduced Motion',
        choices: [
            { value: 'system', label: 'Use system settings' },
            { value: 'true',   label: 'Reduced motion on' },
            { value: 'false',  label: 'Reduced motion off' }
        ]
    },
    {
        property: '--prefers-contrast',
        mediaQuery: '(prefers-contrast: more)',
        label: 'High Contrast',
        choices: [
            { value: 'system', label: 'Use system settings' },
            { value: 'true',   label: 'High contrast on' },
            { value: 'false',  label: 'High contrast off' }
        ]
    },
    {
        property: '--prefers-dark-theme',
        mediaQuery: '(prefers-color-scheme: dark)',
        label: 'Colorscheme',
        choices: [
            { value: 'system', label: 'Use system settings' },
            { value: 'false',  label: 'Light colorscheme' },
            { value: 'true',   label: 'Dark colorscheme' }
        ]
    },
    {
        property: '--prefers-colorblind-mode',
        mediaQuery: '',
        label: 'Colorblindness',
        choices: [
            { value: 'system',       label: 'No colorblindness' },
            { value: 'protanopia',   label: 'Protanopia' },
            { value: 'deuteranopia', label: 'Deuteranopia' },
            { value: 'tritanopia',   label: 'Tritanopia' }
        ]
    }
];

// Create option controllers based on your configuration map
const controllers = preferencesBlueprint.map(config =>
    PreferenceOptionController(config.property, config.mediaQuery)
);

// Mount the entire component onto the document
const [preferencesWidgetDOM] = projectWidget(controllers, preferencesBlueprint);
document.body.append(preferencesWidgetDOM);

// Signal components initial page load is over so contrast transition is now allowed when values change
document.body.classList.remove('preload');

import { dom } from "../../util/dom.js";

export { projectPreferenceOption };

/**
 * Projector that handles the available options for an accessibility setting.
 * @param { PreferenceOptionControllerType } optionController - Controller for a single option of the setting
 * @param { String } titleLabel - Text used for the summary label (e.g., "Reduced Motion")
 * @param { Array<{value: string, label: string}> } choices - Config array mapping radiobutton input field definitions
 * @returns [HTMLDetailsElement]
 * const [optionNode] = projectPreferenceOption(
 *     PreferenceOptionController('--prefers-contrast', '(prefers-contrast: more)'),
 *     label: "Colorscheme",
 *     choices: [
 *         { value: "system", label: "Use system settings" },
 *         { value: "false",  label: "Light colorscheme" },
 *         { value: "true",   label: "Dark colorscheme" }
 *     ]
 * );
 */
const projectPreferenceOption = (optionController, titleLabel, choices) => {
    const [detailsElement] = dom(`
        <details>
            <summary>${titleLabel}</summary>
            <fieldset>
                <legend class="visually-hidden">${titleLabel} Settings</legend>
            </fieldset>
        </details>
    `);

    const fieldset = detailsElement.querySelector('fieldset');
    const optionGroupName = optionController.getProperty().replaceAll('-', ''); // Unique group name based on the CSS variable string

    choices.forEach(choice => {
        const [optionElement] = dom(`
            <div class="option">
                <input type="radio" name="${optionGroupName}" id="${optionGroupName}-${choice.value}" value="${choice.value}">
                <label for="${optionGroupName}-${choice.value}">${choice.label}</label>
            </div>
        `);
        fieldset.append(optionElement);
    });

    const radios = fieldset.querySelectorAll('input[type="radio"]');

    // Sync UI interactions directly to the option controller
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                optionController.setValue(radio.value);
            }
        });
    });

    // React to incoming model value changes of the selected option
    optionController.onValueChanged(currentModelValue => {
        radios.forEach(radio => {
            radio.checked = (radio.value === currentModelValue);
        });
    });

    // Set the initial state selection check matching the controller status on page load
    const activeValue = optionController.getValue();
    radios.forEach(radio => {
        radio.checked = (radio.value === activeValue);
    });

    return [detailsElement];
};

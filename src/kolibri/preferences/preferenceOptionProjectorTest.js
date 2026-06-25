import { TestSuite }                  from "../util/test.js";
import { PreferenceOptionController } from "./preferenceOptionController.js";
import { projectPreferenceOption }    from "./preferenceOptionProjector.js";

const preferenceOptionProjectorSuite = TestSuite("projector/preferences/preferenceOptionProjector");

/**
 * Ensures that the preference view components are built properly and
 * view changes synchronize cleanly to the controller state.
 */
preferenceOptionProjectorSuite.add('binding', assert => {
    localStorage.removeItem('--color-scheme');
    const controller = PreferenceOptionController('--color-scheme', '(prefers-color-scheme: dark)');
    const choices    = [
        { value: 'system', label: 'Auto' },
        { value: 'dark',   label: 'Dark' }
    ];

    const [detailsElement] = projectPreferenceOption(controller, 'Theme', choices);

    // Validate structural details mapping
    const summary = detailsElement.querySelector('summary');
    assert.is(summary.textContent, 'Theme');

    const radios = detailsElement.querySelectorAll('input[type="radio"]');
    assert.is(radios.length, 2);

    const systemRadio = detailsElement.querySelector('input[value="system"]');
    const darkRadio   = detailsElement.querySelector('input[value="dark"]');

    // Confirm initial state bindings match model default
    assert.is(systemRadio.checked, true);
    assert.is(darkRadio.checked,   false);

    // Simulate user selecting a different theme radio choice
    darkRadio.checked = true;
    darkRadio.dispatchEvent(new Event('change'));
    assert.is(controller.getValue(), 'dark');

    // Modify via controller and verify UI reactions
    controller.setValue('system');
    assert.is(systemRadio.checked, true);
    assert.is(darkRadio.checked,   false);
});

preferenceOptionProjectorSuite.run();

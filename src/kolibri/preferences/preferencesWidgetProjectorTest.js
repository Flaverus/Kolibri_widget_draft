import { TestSuite }                  from "../util/test.js";
import { PreferenceOptionController } from "./preferenceOptionController.js";
import { projectWidget }              from "./preferencesWidgetProjector.js";

const preferencesWidgetProjectorSuite = TestSuite("projector/preferences/preferencesWidgetProjector");

preferencesWidgetProjectorSuite.add('widget-composition', assert => {
    localStorage.removeItem('--color-scheme');
    localStorage.removeItem('--contrast');

    const controllers = [
        PreferenceOptionController('--color-scheme', '(prefers-color-scheme: dark)'),
        PreferenceOptionController('--contrast',     '(prefers-contrast: more)')
    ];
    const configs = [
        { label: 'Theme',    choices: [{ value: 'system', label: 'Auto' }, { value: 'dark', label: 'Dark' }] },
        { label: 'Contrast', choices: [{ value: 'system', label: 'Auto' }, { value: 'true', label: 'High' }] }
    ];

    const [widgetElement] = projectWidget(controllers, configs);

    // Make sure panel structure container exists
    const contentPanel = widgetElement.querySelector('#widget-content-panel');
    assert.isTrue(contentPanel !== null);

    // Verify sub-projector option nodes were correctly appended to the main element
    const embeddedDetails = contentPanel.querySelectorAll('details');
    assert.is(embeddedDetails.length, 2);

    assert.is(embeddedDetails[0].querySelector('summary').textContent, 'Theme');
    assert.is(embeddedDetails[1].querySelector('summary').textContent, 'Contrast');
});

preferencesWidgetProjectorSuite.run();

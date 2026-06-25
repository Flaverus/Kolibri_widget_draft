import { TestSuite }                  from "../util/test.js";
import { PreferenceOptionController } from "./preferenceOptionController.js";

const preferenceOptionControllerSuite = TestSuite("projector/preferences/preferenceOptionController");

preferenceOptionControllerSuite.add('full', assert => {
    // Clear out local storage ahead of testing to ensure clean default fallbacks
    localStorage.removeItem('--contrast');

    const controller = PreferenceOptionController('--contrast', '(prefers-contrast: more)');

    assert.is(controller.getProperty(),   '--contrast');
    assert.is(controller.getMediaQuery(), '(prefers-contrast: more)');
    assert.is(controller.getValue(),      'system'); // default initial value from model context

    let found = false;
    controller.onValueChanged(() => found = true);
    assert.is(found, true); // Callback is executed immediately upon registration

    found = false;
    controller.setValue('true');
    assert.is(found, true);
    assert.is(controller.getValue(), 'true');
    assert.is(localStorage.getItem('--contrast'), 'true');
});

preferenceOptionControllerSuite.run();

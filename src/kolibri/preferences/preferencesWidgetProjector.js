/**
 * @module projector/preferences/preferencesWidgetProjector
 *
 * Following the projector pattern, this module exports the main projection function
 * {@link projectWidget} that composes all preference configurations into a singular floating panel.
 */

import { dom }                     from "../util/dom.js";
import { projectPreferenceOption } from "./preferenceOptionProjector.js";

export { projectWidget };

/**
 * Projects the main preferences widget and composes all preference option projectors into a floating panel.
 * It iterates over a collection of option controllers to append sub-projected DOM elements.
 *
 * @param { Array<PreferenceOptionControllerType> } optionControllers - List of options to display
 * @param { Array<{label: string, choices: Array<{value: string, label: string}>}> } layoutConfigs - Explicit display label mappings matching each controller index
 * @returns { [HTMLAsideElement] }
 * @example
 * const controllers = [
       PreferenceOptionController('--color-scheme', '(prefers-color-scheme: dark)'),
       PreferenceOptionController('--prefers-contrast', '(prefers-contrast: more)')
   ];
   const configs = [
       { label: 'Theme', choices: [{ value: 'system', label: 'Auto' }, { value: 'dark', label: 'Dark' }] },
       { label: 'Contrast', choices: [{ value: 'system', label: 'Auto' }, { value: 'true', label: 'High' }] }
   ];
   const [widgetNode] = projectWidget(controllers, configs);
   document.body.append(widgetNode);
 */

const projectWidget = (optionControllers, layoutConfigs) => {
    const [widgetElement] = dom(`
        <aside id="preferences-widget" class="floating-box">
            <button id="widget-toggle" class="toggle" aria-expanded="false" aria-controls="widget-content-panel">
                <div class="widget-heading">
                    <h3>Site Preferences</h3>
                    <span class="close" aria-hidden="true">&#x2715;</span>
                </div>
                <svg id="accessibilityIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" aria-hidden="true" width="24" height="24">
                    <path fill="currentColor" d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/>
                </svg>
            </button>
            <div id="widget-content-panel" class="widget-content"></div>
        </aside>
    `);

    document.head.innerHTML += projectorStyle;

    const contentPanel     = widgetElement.querySelector('#widget-content-panel');
    const toggleButton     = widgetElement.querySelector('#widget-toggle');

    const toggleWidgetState = (forceClose = false) => {
        const isWidgetOpen =  widgetElement.classList.contains('open')

        if(forceClose || isWidgetOpen) {
            widgetElement.classList.remove('open');
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            widgetElement.classList.add('open');
            toggleButton.setAttribute('aria-expanded', 'true');
        }
    }

    // Toggle the widgets open state when the toggle button is clicked
    toggleButton.addEventListener('click', () => {
        toggleWidgetState();
    });

    // Close widget if clicked outside
    document.addEventListener('click', (e) => {
        if (!widgetElement.contains(e.target)) {
            toggleWidgetState(true);
        }
    });

    // Close widget with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            toggleWidgetState(true);
        }
    });

    // Loop through option controllers and append options with the preference option projector.
    optionControllers.forEach((controller, index) => {
        const layoutConfig = layoutConfigs[index];

        const [optionNode] = projectPreferenceOption(
            controller,
            layoutConfig.label,
            layoutConfig.choices
        );

        contentPanel.append(optionNode);
    });

    return [widgetElement];
};

// Widget projector specific styles
const projectorStyle = `
<style>
    .floating-box {
        position: fixed;
        bottom: 1.25rem;
        left: 1.25rem;
        z-index: var(--z-index-front);
        color: var(--text-color);
        background: var(--content-bg);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        max-height: 80vh;
    }

    .floating-box h3 {
        display: block;
    }

    .floating-box svg {
        display: none;
    }

    .toggle {
        width: 100%;
        background-color: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .close {
        display: none;
        font-size: 1.2rem;
    }

    .floating-box.open .close {
        display: inline;
    }

    .floating-box.open .widget-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    @media(max-width: 800px) {
        .floating-box h3 {
            display: none;
        }

        .floating-box svg {
            display: block;
            width: 48px;
            height: 48px;
        }

        .floating-box.open h3 {
            display: block;
        }

        .floating-box.open svg {
            display: none;
        }
    }

    .floating-box.open .widget-content {
        display: block;
        max-height: 50vh;
        max-width: 80vw;
        overflow: auto;
    }

    .widget-content {
        display: none;
    }

    .widget-content summary {
        margin: 6px;
        cursor: pointer;
    }

    .widget-content .option {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        margin: 6px 6px 6px 22px;
    }

    .option label, .option input {
        cursor: pointer;
        margin: 0;
    }

    @container style(--prefers-contrast: true) {
        .floating-box {
            outline: 2px solid var(--border-color);
            border: 1px solid var(--content-bg);
        }
    }
</style>
`;

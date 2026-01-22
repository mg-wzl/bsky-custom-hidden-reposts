import { KEY_ENABLED, KEY_IGNORED_TABS, LOG_PREFIX } from './constants.js';
import { startObservingDocument, stopObservingDocument } from './observer.js';
import { getSettings } from './getSettings.js';

async function start() {
  const settings = await getSettings();
  const ignoredFeedNames = Array.isArray(settings.ignoredTabs) ? settings.ignoredTabs : [];
  if (settings.enabled) {
    startObservingDocument(ignoredFeedNames);
  }
}

function stop() {
  stopObservingDocument();
}

/** Look for changes in settings */
chrome.storage.sync.onChanged.addListener(async (changes) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case KEY_ENABLED:
        if (newValue === false) {
          console.log(LOG_PREFIX, 'Turned off');
          stop();
        } else {
          console.log(LOG_PREFIX, 'Turned on');
          start();
        }
        break;
      case KEY_IGNORED_TABS:
        console.log(LOG_PREFIX, 'ignored tabs changed:', { newValue, oldValue });
        stop();
        start();
        break;
    }
  }
});

(async () => {
  console.log(LOG_PREFIX, 'Script started!');
  start();
})();

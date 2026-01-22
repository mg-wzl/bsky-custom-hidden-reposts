import { KEY_ENABLED, KEY_IGNORED_TABS, LOG_PREFIX } from "./constants.js";
import { setIgnoredFeedNames, startObservingDocument, stopObservingDocument } from "./content.js";
import { getSettings } from "./getSettings.js";

/** Look for changes in settings */
chrome.storage.sync.onChanged.addListener((changes) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case KEY_ENABLED:
        if (newValue === false) {
          console.log(LOG_PREFIX, 'Turned off');
          stopObservingDocument();
        } else {
          console.log(LOG_PREFIX, 'Turned on');
          startObservingDocument();
        }
        break;
      case KEY_IGNORED_TABS:
        console.log({ newValue, oldValue });
        if (Array.isArray(newValue)) {
          setIgnoredFeedNames(newValue);
        }
        break;
    }
  }
});

(async () => {
  console.log(LOG_PREFIX, 'Script started!');
  
  let initialSettings = await getSettings();
  console.log(LOG_PREFIX, 'settings:', initialSettings);
  if (initialSettings.enabled) {
    startObservingDocument();
  }
  if (Array.isArray(initialSettings.ignoredTabs)) {
    setIgnoredFeedNames(initialSettings.ignoredTabs);
  }
})();
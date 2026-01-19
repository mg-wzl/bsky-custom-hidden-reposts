import { DEFAULT_SETTINGS, KEY_ENABLED, LOG_PREFIX } from '../scripts/constants.js';
import { getSettings } from '../scripts/getSettings.js';

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log(LOG_PREFIX, 'onInstalled: ', details);
  console.log('Check that settings are initiated, updated if needed.');
  const settings = await getSettings();
  if (settings[KEY_ENABLED] === undefined) {
    // initialize settings
    chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
});

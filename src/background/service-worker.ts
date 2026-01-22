import { DEFAULT_SETTINGS, KEY_ENABLED, LOG_PREFIX } from '../scripts/constants.js';
import { getSettings } from '../scripts/getSettings.js';

// Triggered when the extension is installed or updated
chrome.runtime.onInstalled.addListener(async (details) => {
  // Check that settings are initialized
  const settings = await getSettings();
  if (settings[KEY_ENABLED] === undefined) {
    // initialize settings
    chrome.storage.local.set(DEFAULT_SETTINGS);
  }
});

import type { ExtensionSettings } from './constants.js';

export async function getSettings(): Promise<ExtensionSettings> {
  const promise = new Promise<ExtensionSettings>((resolve, reject) => {
    try {
      chrome.storage.sync.get(null, (items) => {
        resolve(items as ExtensionSettings);
      });
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

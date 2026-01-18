type ExtensionSettings = {
  enabled: boolean;
};

export async function getSettings(): Promise<ExtensionSettings> {
  const promise = new Promise<ExtensionSettings>((resolve, reject) => {
    try {
      chrome.storage.sync.get(null, (items) => {
        const settindsResult: ExtensionSettings = {
          enabled: items['enabled'] !== undefined ? !!items['enabled'] : true,
        };
        resolve(settindsResult);
      });
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

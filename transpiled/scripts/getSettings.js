export async function getSettings() {
    const promise = new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, (items) => {
                const settindsResult = {
                    enabled: items['enabled'] !== undefined ? !!items['enabled'] : true,
                };
                resolve(settindsResult);
            });
        }
        catch (e) {
            reject(e);
        }
    });
    return promise;
}

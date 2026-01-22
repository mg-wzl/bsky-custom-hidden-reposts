export async function getSettings() {
    const promise = new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(null, (items) => {
                resolve(items);
            });
        }
        catch (e) {
            reject(e);
        }
    });
    return promise;
}

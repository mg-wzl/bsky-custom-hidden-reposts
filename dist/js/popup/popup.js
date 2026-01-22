import { KEY_ENABLED, KEY_IGNORED_TABS } from '../scripts/constants.js';
// enabled checkbox
const isEnabledCheckbox = document.getElementById('isEnabledCheckbox');
isEnabledCheckbox?.addEventListener('click', onEnabledCheckboxClicked);
function onEnabledCheckboxClicked() {
    setIsExtensionEnabled(this.checked);
}
// whole container
const container = document.getElementById('container');
function setIsExtensionEnabled(isEnabled) {
    if (isEnabled) {
        container?.classList.remove('disabled');
    }
    else {
        container?.classList.add('disabled');
    }
    chrome.action.setIcon({
        path: isEnabled ? '/icons/icon-48.png' : '/icons/icon-disabled-48.png',
    });
    chrome.storage.sync.set({ [KEY_ENABLED]: isEnabled }).then(() => {
        console.log('Value is set', isEnabled);
    });
}
// show reposts text area
const ignoredTabsInput = document.getElementById('ignoredTabsInput');
ignoredTabsInput?.addEventListener('blur', (e) => {
    console.log('blur', e);
    const ignoredTabsText = ignoredTabsInput?.value?.split('\n') ?? [];
    chrome.storage.sync.set({ [KEY_IGNORED_TABS]: ignoredTabsText });
});
chrome.storage.sync.get(null, (items) => {
    console.log({ items });
    // initialize checkbox
    const isEnabled = Boolean(items[KEY_ENABLED] !== undefined ? items[KEY_ENABLED] : true);
    if (isEnabledCheckbox) {
        isEnabledCheckbox.checked = isEnabled;
        setIsExtensionEnabled(isEnabled);
    }
    // initialize textarea
    const ignoredTabs = (items[KEY_IGNORED_TABS] ?? []);
    if (ignoredTabs.length && ignoredTabsInput) {
        ignoredTabsInput.value = ignoredTabs.join('\n');
    }
});
// show version
const versionElement = document.getElementById('version');
if (versionElement) {
    const manifestData = chrome.runtime.getManifest();
    versionElement.textContent = `v${manifestData.version}`;
}

import { KEY_ENABLED, KEY_IGNORED_TABS, type ExtensionSettings } from '../scripts/constants.js';

// enabled checkbox
const isEnabledCheckbox: HTMLInputElement | null = document.getElementById(
  'isEnabledCheckbox',
) as HTMLInputElement | null;
isEnabledCheckbox?.addEventListener('click', onEnabledCheckboxClicked);

function onEnabledCheckboxClicked(this: HTMLInputElement) {
  setIsExtensionEnabled(this.checked);
}

// whole container
const container = document.getElementById('container');
function setIsExtensionEnabled(isEnabled: boolean) {
  if (isEnabled) {
    container?.classList.remove('disabled');
  } else {
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
const ignoredTabsInput: HTMLInputElement | null = document.getElementById(
  'ignoredTabsInput',
) as HTMLInputElement | null;
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
  const ignoredTabs = (items[KEY_IGNORED_TABS] ?? []) as string[];
  if (ignoredTabs.length && ignoredTabsInput) {
    ignoredTabsInput.value = ignoredTabs.join('\n');
  }
});

// show version
const versionElement = document.getElementById('version') as HTMLSpanElement;

if (versionElement) {
  const manifestData = chrome.runtime.getManifest();
  versionElement.textContent = `v${manifestData.version}`;
}

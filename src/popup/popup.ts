import { KEY_ENABLED } from '../scripts/constants.js';

const isEnabledCheckbox: HTMLInputElement | null = document.getElementById(
  'isEnabledCheckbox',
) as HTMLInputElement | null;
const container = document.getElementById('container');
console.log({ container });
isEnabledCheckbox?.addEventListener('click', onEnabledCheckboxClicked);

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

function onEnabledCheckboxClicked(this: HTMLInputElement) {
  setIsExtensionEnabled(this.checked);
}

chrome.storage.sync.get({ [KEY_ENABLED]: true }, (items) => {
  console.log({ items });
  const isEnabled = Boolean(items[KEY_ENABLED] !== undefined ? items[KEY_ENABLED] : true);
  if (isEnabledCheckbox) {
    isEnabledCheckbox.checked = isEnabled;
    setIsExtensionEnabled(isEnabled);
  }
});

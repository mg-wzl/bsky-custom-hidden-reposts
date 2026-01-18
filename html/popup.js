const KEY_ENABLED = 'enabled';

const isEnabledCheckbox = document.getElementById('isEnabledCheckbox');
isEnabledCheckbox.addEventListener('click', onEnabledCheckboxClicked);

function setIsExtensionEnabled(isEnabled) {
  chrome.action.setIcon({
    path: isEnabled ? '/icons/icon-48.png' : '/icons/icon-disabled-48.png',
  });
  chrome.storage.sync.set({ [KEY_ENABLED]: isEnabled }).then(() => {
    console.log('Value is set', isEnabled);
  });
}

function onEnabledCheckboxClicked() {
  setIsExtensionEnabled(this.checked);
}

chrome.storage.sync.get({ [KEY_ENABLED]: true }, (items) => {
  console.log({ items });
  isEnabledCheckbox.checked =
    items[KEY_ENABLED] !== undefined ? items[KEY_ENABLED] : true;
});

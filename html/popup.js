const KEY_ENABLED = 'enabled';

const isEnabledCheckbox = document.getElementById('isEnabledCheckbox');
const container = document.getElementById('container');
console.log({ container });
isEnabledCheckbox.addEventListener('click', onEnabledCheckboxClicked);

function setIsExtensionEnabled(isEnabled) {
  if (isEnabled) {
    container.classList.remove('disabled');
  } else {
    container.classList.add('disabled');
  }
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
  const isEnabled =
    items[KEY_ENABLED] !== undefined ? items[KEY_ENABLED] : true;
  isEnabledCheckbox.checked = isEnabled;
  setIsExtensionEnabled(isEnabled);
});

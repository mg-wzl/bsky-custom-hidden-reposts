const KEY_ENABLED = 'enabled';

const isEnabledCheckbox = document.getElementById('isEnabledCheckbox');
isEnabledCheckbox.addEventListener('click', onEnabledCheckboxClicked);

function setIsExtensionEnabled(isEnabled) {
  chrome.storage.sync.set({ [KEY_ENABLED]: isEnabled }).then(() => {
    console.log('Value is set', isEnabled);
  });
}

// unused for now
function sendMessageToAllTabs() {
  chrome.tabs.query({ url: '*://bsky.app/*' }, (tabs) => {
    console.log('Send to tabs:', tabs);
    for (const tab of tabs) {
      console.log('send to ', tab.id);
      chrome.tabs.sendMessage(
        tab.id,
        `WZLBskyHideReposts.${this.checked ? 'enabled' : 'disabled'}`,
      );
    }
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

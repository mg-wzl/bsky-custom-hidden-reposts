function isCheckboxClicked() {
  console.log(this.checked);
  chrome.tabs.query({ url: "*://bsky.app/*" }, (tabs) => {
    console.log('Send to tabs:', tabs);
    for (const tab of tabs) {
      console.log('send to ', tab.id);
      chrome.tabs.sendMessage(tab.id, `WZLBskyHideReposts.extTurned${this.checked ? 'On' : 'Off'}`);
    }
  });
}

document.getElementById("isTurnedOn").addEventListener("click", isCheckboxClicked);
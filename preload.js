(async () => {
  const src = chrome.runtime.getURL("js/scripts/main.js");
  const contentMain = await import(src);
})();
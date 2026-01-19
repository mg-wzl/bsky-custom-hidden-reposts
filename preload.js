(async () => {
  const src = chrome.runtime.getURL("js/scripts/content.js");
  const contentMain = await import(src);
})();
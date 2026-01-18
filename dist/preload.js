(async () => {
  const src = chrome.runtime.getURL("scripts/content.js");
  const contentMain = await import(src);
})();
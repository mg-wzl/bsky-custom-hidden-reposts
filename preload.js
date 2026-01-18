(async () => {
  const src = chrome.runtime.getURL("transpiled/scripts/content.js");
  const contentMain = await import(src);
})();
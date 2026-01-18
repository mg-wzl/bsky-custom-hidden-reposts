const tabXpath =
  '//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family") and contains(@style, "color: rgb(255, 255, 255)")]';

const tabListXpath = '//*[@role="tablist"]';

const getElement = (xpath) => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
};

const tabObservers = [];

function addTabObserver(tabNode) {
  const tabName = tabNode.textContent;
  const observer = new MutationObserver((mutations) => {
    console.log(`Changes in ${tabName}`);
    if (element) {
      console.log('Visible tabs:', getVisibleActiveTabs());
    }
  });
  tabContainer = getElement()
  tabObservers.push({ tabName, node: tabNode, observer });
  observer.observe(tabNode, {
    childList: true,
    subtree: true,
  });
}

function removeTabObserver(tabName) {
  const observerIndex = tabObservers.findIndex((v) => (v.tabName = tabName));
  if (observerIndex !== -1) {
    const observer = tabObservers[observerIndex];
    tabObservers.splice(observerIndex, 1);
    observer?.disconnect();
  }
}

function getVisibleActiveTabs() {
  const iterator = document.evaluate(
    tabXpath,
    document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null,
  );
  const result = [];
  try {
    let thisNode = iterator.iterateNext();

    while (thisNode) {
      if (thisNode.checkVisibility) {
        result.push(thisNode);
      }
      thisNode = iterator.iterateNext();
    }
  } catch (e) {
    console.error(`Error: Document tree modified during iteration ${e}`);
  }
  return result;
}

function observeTabLists(onElementFound) {
  const observer = new MutationObserver((mutations) => {
    console.log({ mutations });
    const element = getElement(tabListXpath);
    if (element) {
      const visibleTabs = getVisibleActiveTabs();
      const visibleTabNames = visibleTabs.map((tab) => tab.textContent);
      const tabsToRemove = tabObservers.filter(
        (observer) => !visibleTabNames.includes(observer.tabName),
      );
      const tabsToAdd = visibleTabs.filter(
        (tab) => !tabObservers.some((obs) => obs.tabName === tab.textContent),
      );
      console.log({
        visibleTabs: visibleTabs.map((t) => t.textContent),
        tabsToRemove: tabsToRemove.map((obs) => obs.tabName),
        tabsToAdd: tabsToAdd.map((t) => t.textContent),
      });
      tabsToRemove.every((observer) => {
        removeTabObserver(observer);
      });
      tabsToAdd.every((tab) => {
        addTabObserver(tab);
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

console.log('Script started!');
observeTabLists();

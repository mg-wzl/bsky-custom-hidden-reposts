const tabXpath =
  '//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family")]';

const feedContainerXpath =
  '//div[contains(@data-testid,"FeedPage-feed-flatlist")]';

const activeTabColor = 'rgb(255, 255, 255)';

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

const getOrderedElements = (xpath, includeHidden) => {
  const iterator = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null,
  );
  const result = [];
  try {
    let thisNode = iterator.iterateNext();

    while (thisNode) {
      if (includeHidden || thisNode.checkVisibility()) {
        result.push(thisNode);
      }
      thisNode = iterator.iterateNext();
    }
  } catch (e) {
    console.error(`Error: Document tree modified during iteration ${e}`);
  }
  return result;
};

let observedTab = null;

function addTabObserver(index, tabName, containerNode) {
  console.log({index, tabName, containerNode});
  const observer = new MutationObserver((mutations) => {
    console.log(`Changes in ${observedTab.tabName}`);
  });
  observedTab = { index, tabName, containerNode, observer };
  observer.observe(containerNode, {
    childList: true,
    subtree: true,
  });
}

function removeTabObserver() {
  if (observedTab) {
    observedTab.observer?.disconnect();
    observedTab = null;
    console.log({observedTab});
  }
}

function getVisibleTabs() {
  const tabNodes = getOrderedElements(tabXpath);
  return tabNodes.map((node) => {
    const style = node.style;
    return {
      tabNode: node,
      isActive: style?.getPropertyValue('color') === activeTabColor,
    };
  });
}

function getActiveFeedContainer(index) {
  const feedNodes = getOrderedElements(feedContainerXpath, true);
  console.log({feedNodes});
  if (index <= feedNodes.length) {
    return feedNodes[index];
  }
}

function observeTabLists() {
  const observer = new MutationObserver((mutations) => {
    const element = getElement(tabListXpath);
    if (element) {
      const activeTabs = getVisibleTabs();
      const activeIndex = activeTabs.findIndex((tab) => tab.isActive);
      if (activeIndex !== -1) {
        const activeFeedContainerNode = getActiveFeedContainer(activeIndex);
        if (observedTab?.containerNode !== activeFeedContainerNode) {
          removeTabObserver();
          addTabObserver(
            activeIndex,
            activeTabs[activeIndex].tabNode.textContent,
            activeFeedContainerNode,
          );
        }
      }
      console.log('activeTabs', activeTabs);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

console.log('Script started!');
observeTabLists();

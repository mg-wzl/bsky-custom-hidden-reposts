const LOG_PREFIX = 'WZL_';

const tabXpath =
  '//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family")]';

const feedContainerXpath =
  '//div[contains(@data-testid,"FeedPage-feed-flatlist")]';

const mainPageFeedsWithReposts = ['Following'];

const activeTabColor = 'rgb(255, 255, 255)';

const tabListXpath = '//*[@role="tablist"]';

const getElement = (xpath: string) => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
};

const getOrderedElements = (xpath: string, includeHidden: boolean = false) => {
  const iterator = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null,
  );
  const result = [];
  try {
    let thisNode = iterator.iterateNext() as HTMLElement;

    while (thisNode) {
      if (includeHidden || thisNode.checkVisibility()) {
        result.push(thisNode);
      }
      thisNode = iterator.iterateNext() as HTMLElement;
    }
  } catch (e) {
    console.error(
      LOG_PREFIX,
      `Error: Document tree modified during iteration ${e}`,
    );
  }
  return result;
};

function getReposts(node: HTMLElement) {
  const posts = node.querySelectorAll('div[data-testid*="feedItem"]');
  const reposts: Node[] = [];
  posts?.forEach((postNode) => {
    const repostHeader = postNode.querySelector('a[aria-label*="Reposted by"]');
    if (repostHeader) {
      reposts.push(postNode as HTMLElement);
    }
  });
  return reposts;
}

type ObservedTab = {
  index: number;
  tabName: string;
  containerNode: Node;
  observer: MutationObserver | null;
};

let observedTab: ObservedTab | null = null;

function addTabObserver(index: number, tabName: string, containerNode: Node) {
  let observer = null;
  if (!mainPageFeedsWithReposts.includes(tabName ?? '')) {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const totalReposts = [];
        mutation.addedNodes?.forEach((addedNode) => {
          const reposts = getReposts(addedNode as HTMLElement);
          if (reposts.length > 0) {
            reposts?.forEach((r) => r.parentNode?.removeChild(r));
            totalReposts.push(...reposts);
          }
        });
      });
    });
    observer.observe(containerNode, {
      childList: true,
      subtree: true,
    });
  }
  observedTab = { index, tabName, containerNode, observer };
}

function removeTabObserver() {
  if (observedTab) {
    observedTab.observer?.disconnect();
    observedTab = null;
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

function getActiveFeedContainer(index: number) {
  const feedNodes = getOrderedElements(feedContainerXpath, true);
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
      if (activeIndex !== -1 && activeTabs[activeIndex]) {
        const activeFeedContainerNode = getActiveFeedContainer(activeIndex);
        if (activeFeedContainerNode && observedTab?.containerNode !== activeFeedContainerNode) {
          removeTabObserver();
          addTabObserver(
            activeIndex,
            activeTabs[activeIndex].tabNode.textContent,
            activeFeedContainerNode,
          );
          console.log(LOG_PREFIX, 'activeTab:', observedTab?.tabName);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

console.log(LOG_PREFIX, 'Script started!');

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'WZLBskyHideReposts.extTurnedOn') {
    console.log(LOG_PREFIX, 'Turned on');
  }
  if (message === 'WZLBskyHideReposts.extTurnedOff') {
    console.log(LOG_PREFIX, 'Turned off');
  }
});

observeTabLists();

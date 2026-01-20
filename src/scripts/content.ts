import { KEY_ENABLED, KEY_IGNORED_TABS, LOG_PREFIX } from './constants.js';
import { getSettings } from './getSettings.js';

const tabXpath =
  '//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family")]';

const feedContainerXpath = '//div[contains(@data-testid,"FeedPage-feed-flatlist")]/div[last()]/div';

const ignoredTabs: string[] = [];

const activeTabColor = 'rgb(255, 255, 255)';

const tabListXpath = '//*[@role="tablist"]';

/* this div is added at the end of the feed to trigger
   pagination if there's too few posts on the screen */
const EXTRA_HEIGHT_DIV = createExtaHeightDiv();

window.addEventListener('resize', (e) => {
  EXTRA_HEIGHT_DIV.style.height = window.innerHeight + 'px';
});

function createExtaHeightDiv() {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = window.innerHeight + 'px';
  div.classList.add('wzl-extra-height');
  div.style.background = 'transparent';
  return div;
}

const getElement = (xpath: string) => {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
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
    console.error(LOG_PREFIX, `Error: Document tree modified during iteration ${e}`);
  }
  return result;
};

function getReposts(node: HTMLElement) {
  const posts = node.querySelectorAll('div[data-testid*="feedItem"]');
  const reposts: Node[] = [];
  posts?.forEach((postNode) => {
    // to avoid parsing by link text, relying on the page sctructure. Prone to breaking :(
    const repostHeader = postNode.querySelector(
      'div[data-testid*="feedItem"] a[href^="/profile/"] > svg + div > div > div',
    );
    if (repostHeader && !!repostHeader.textContent) {
      reposts.push(postNode as HTMLElement);
    }
  });
  return { posts, reposts };
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
  console.log({
    tabName,
    ignoredTabs,
    included: ignoredTabs.includes(tabName?.toLocaleLowerCase() ?? ''),
  });
  if (!ignoredTabs.includes(tabName?.toLocaleLowerCase() ?? '')) {
    observer = new MutationObserver((mutations) => {
      const totalReposts = [];
      const totalPosts = [];
      mutations.forEach((mutation) => {
        mutation.addedNodes?.forEach((addedNode) => {
          const { posts, reposts } = getReposts(addedNode as HTMLElement);
          if (posts.length > 0) {
            totalPosts.push(...posts);
          }
          if (reposts.length > 0) {
            reposts?.forEach((r) => r.parentNode?.removeChild(r));
            totalReposts.push(...reposts);
          }
        });
      });
      if (totalPosts.length > 0 && totalPosts.length - totalReposts.length < 10) {
        console.log(LOG_PREFIX, 'reposts hidden:', totalReposts?.length);
        EXTRA_HEIGHT_DIV.parentElement?.removeChild(EXTRA_HEIGHT_DIV);
        containerNode.appendChild(EXTRA_HEIGHT_DIV);
      }
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

let tabsListObserver: MutationObserver | null = null;

function observeTabLists() {
  if (tabsListObserver) {
    throw Error('Tabs observer already exists, cannot create a new one');
  }
  tabsListObserver = new MutationObserver((mutations) => {
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

  tabsListObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopObservingChanges() {
  tabsListObserver?.disconnect();
  tabsListObserver = null;
  removeTabObserver();
}

console.log(LOG_PREFIX, 'Script started!');

chrome.storage.sync.onChanged.addListener((changes) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case KEY_ENABLED:
        if (newValue === false) {
          console.log(LOG_PREFIX, 'Turned off');
          stopObservingChanges();
        } else {
          console.log(LOG_PREFIX, 'Turned on');
          observeTabLists();
        }
        break;
      case KEY_IGNORED_TABS:
        console.log({ newValue, oldValue });
        if (Array.isArray(newValue)) {
          ignoredTabs.splice(0, ignoredTabs.length);
          ignoredTabs.push(...newValue.map((v) => v.toLocaleLowerCase()));
        }
        break;
    }
  }
});

(async () => {
  let initialSettings = await getSettings();
  console.log(LOG_PREFIX, 'settings:', initialSettings);
  if (initialSettings.enabled) {
    observeTabLists();
  }
  if (Array.isArray(initialSettings.ignoredTabs)) {
    ignoredTabs.push(...initialSettings.ignoredTabs?.map((v) => v.toLocaleLowerCase()));
  }
})();

import { LOG_PREFIX } from './constants.js';
import { EXTRA_HEIGHT_DIV, removeExtraHeight } from './extraHeight.js';
import {
  findFeedContainerByIndex,
  findVisibleTabs,
  findTabsRow,
  findPostsAndReposts,
} from './parser.js';

/** Feeds which will not be hiding reposts */
const ignoredFeedNames: string[] = [];

export function setIgnoredFeedNames(newValue: string[]) {
  if (ignoredFeedNames.length > 0) {
    ignoredFeedNames.splice(0, ignoredFeedNames.length);
  }
  ignoredFeedNames.push(...newValue.map((v) => v.toLocaleLowerCase()));
}

// ############## Feed observer ####################
type ObservedFeed = {
  index: number;
  tabName: string;
  containerNode: Node;
  observer: MutationObserver | null;
};

let activeFeed: ObservedFeed | null = null;

/** Monitors changes in the feed element, and removes reposts from it. */
function addActiveFeedObserver(index: number, feedName: string, containerNode: Node) {
  let observer = null;
  const isIgnored = ignoredFeedNames.includes(feedName?.toLocaleLowerCase() ?? '');
  console.log(LOG_PREFIX, 'active feed changed', {
    feedName,
    isIgnored,
    ignoredFeedNames,
  });
  if (!isIgnored) {
    observer = new MutationObserver((mutations) => {
      const totalReposts = [];
      const totalPosts = [];
      mutations.forEach((mutation) => {
        mutation.addedNodes?.forEach((addedNode) => {
          const { posts, reposts } = findPostsAndReposts(addedNode as HTMLElement);
          if (posts.length > 0) {
            totalPosts.push(...posts);
          }
          if (reposts.length > 0) {
            reposts?.forEach((r) => r.parentNode?.removeChild(r));
            totalReposts.push(...reposts);
          }
        });
      });
      if (totalPosts.length > 0 && totalReposts.length > 0) {
        console.log(LOG_PREFIX, 'reposts hidden:', totalReposts?.length);
        if (totalPosts.length - totalReposts.length < 10) {
          // If less then 10 posts were left untouched, reattach an extra height element to the end of the feed container.
          // This is used to avoid stuck pagination
          removeExtraHeight();
          containerNode.appendChild(EXTRA_HEIGHT_DIV);
        }
      }
    });
    observer.observe(containerNode, {
      childList: true,
      subtree: true,
    });
  }
  activeFeed = { index, tabName: feedName, containerNode, observer };
}

function removeActiveFeedObserver() {
  if (activeFeed) {
    activeFeed.observer?.disconnect();
    activeFeed = null;
    removeExtraHeight();
  }
}

// ############## Tabs observer ####################
let tabsObserver: MutationObserver | null = null;

/**
 * Observes the document to detect when the active tab changes.
 * Creates an observer for the currently selected feed.
 */
export function startObservingDocument() {
  if (tabsObserver) {
    throw Error('Tabs observer already exists, cannot create a new one');
  }
  tabsObserver = new MutationObserver((mutations) => {
    // find the row of tabs. If it exists - tabs exist
    const tabsRow = findTabsRow();
    if (tabsRow) {
      const visibleTabs = findVisibleTabs();
      const activeIndex = visibleTabs.findIndex((tab) => tab.isActive);
      if (activeIndex !== -1 && visibleTabs[activeIndex]) {
        const activeFeedContainerNode = findFeedContainerByIndex(activeIndex);
        if (activeFeedContainerNode && activeFeed?.containerNode !== activeFeedContainerNode) {
          removeActiveFeedObserver();
          addActiveFeedObserver(
            activeIndex,
            visibleTabs[activeIndex].tabNode.textContent,
            activeFeedContainerNode,
          );
          console.log(LOG_PREFIX, 'activeTab:', activeFeed?.tabName);
        }
      }
    }
  });

  tabsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopObservingDocument() {
  tabsObserver?.disconnect();
  tabsObserver = null;
  removeActiveFeedObserver();
}

import { findElementByXPath, findOrderedElementsByXPath } from './xpath.js';

/**
 * Returns repost header if it exists. To avoid parsing by link text, relies on the page sctructure here. Prone to breaking :(
 * */
export function findRepostHeader(parent: Element) {
  return parent.querySelector(
    'div[data-testid*="feedItem"] a[href^="/profile/"] > svg + div > div > div',
  );
}

/**
 * Returns all posts found in parent
 */
export function findAllPosts(parent: Element) {
  return parent.querySelectorAll('div[data-testid*="feedItem"]');
}

export function findPostsAndReposts(node: HTMLElement) {
  const posts = findAllPosts(node);
  const reposts: Node[] = [];
  posts?.forEach((postNode) => {
    const repostHeader = findRepostHeader(postNode);
    if (repostHeader && !!repostHeader.textContent) {
      reposts.push(postNode as HTMLElement);
    }
  });
  return { posts, reposts };
}

/**
 * @returns Element containing the row of tabs
 */
export function findTabsRow() {
  return findElementByXPath('//*[@role="tablist"]');
}

/**
 * Finds visible tab buttons, detects the active one by text color
 * */
export function findVisibleTabs() {
  const tabXpath =
    '//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family")]';
  const activeTabColor = 'rgb(255, 255, 255)';

  const tabNodes = findOrderedElementsByXPath(tabXpath);
  return tabNodes.map((node) => {
    const style = node.style;
    return {
      tabNode: node,
      isActive: style?.getPropertyValue('color') === activeTabColor,
    };
  });
}

export function findFeedContainerByIndex(index: number) {
  const feedContainerXpath =
    '//div[contains(@data-testid,"FeedPage-feed-flatlist")]/div[last()]/div';

  const feedNodes = findOrderedElementsByXPath(feedContainerXpath, true);
  if (index <= feedNodes.length) {
    return feedNodes[index];
  }
}

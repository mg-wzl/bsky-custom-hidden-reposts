export const LOG_PREFIX = '[bsky_hide_reposts]';

export const KEY_ENABLED = 'enabled';
export const KEY_IGNORED_TABS = 'ignoredTabs';

export type ExtensionSettings = {
  enabled: boolean;
  ignoredTabs: string[];
};

export const DEFAULT_SETTINGS: ExtensionSettings = {
  [KEY_ENABLED]: true,
  [KEY_IGNORED_TABS]: ['Following', 'List with reposts'],
};

# XPaths to certain elements

## div with whole bsky post
//div[contains(@data-testid,"feedItem")]

## link to the reposter's profile
//div[contains(@data-testid,"feedItem")]//a[contains(@aria-label, "Reposted by")]

Link is in href:
href="/profile/accname.bsky.social"

Get this username to hide their reposts


## Feed tabs
//div[contains(@data-testid, "homeScreenFeedTabs-selector-")]//div[contains(@data-testid, "homeScreenFeedTabs-")]

// finds the underline of the selected tab
//div[contains(@data-testid, "homeScreenFeedTabs-selector-")]//div[contains(@data-testid, "homeScreenFeedTabs-")]//div[@style!=""]

// tab with white text
//div[contains(@data-testid, "homeScreenFeedTabs-selector-")]//div[contains(@data-testid, "homeScreenFeedTabs-") and contains(@style, "color: rgb(255, 255, 255)")]

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


## This way also covers feeds, not just homescreen

Note than when the user switches to a different feed, old tab elements stay in the tree! (must be a bug)
So check for visibility

Feed Tabs:
//*[@role="tablist"]//*[contains(@data-testid,"-selector-")]//*[contains(@style, "font-family")]

Selected tab will have (use OR with these conditions to better cover potential changes):
- contains(@style, "color: rgb(255, 255, 255)")
- has an underline element child: div[@style!=""]


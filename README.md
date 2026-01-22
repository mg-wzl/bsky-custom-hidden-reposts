# bsky-custom-hidden-reposts

## Chrome extension for hiding reposts on Bluesky

When enabled, hides reposts from the feeds on the Home page of Bluesky.

You can specify which feeds need to show reposts (by default, it's "Following").

*This extension relies on Bluesky page layout. If the layout changes, the extension may break*

# Installation

I may post it to Chrome marketplace later, but for now you'd need to install it locally.

1. Get folder with the extension. You can do it in several ways: 
    - copy `dist` folder or ZIP file from the source code
    - direct ZIP file download: https://github.com/mg-wzl/bsky-custom-hidden-reposts/blob/main/download/bsky-custom-hidden-reposts.zip -> "Code" button, then Download ZIP
2. Unzip the archive somewhere safe (don't delete the folder afterwards or the extension won't work)
3. In Chrome: install the extension using Developer Mode (see official Google instructions [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked))
    - open "Extensions" ( `chrome://extensions/` )
    - enable Developer Mode
    - press "Load unpacked", chose the unpacked folder
    - disable Developer Mode
4. It's installed!

![Screenshot](screenshot.png)


// Remove previous rules and add new ones when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // Match if the URL contains "medium" in the domain
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostContains: "medium" // Match both custom and standard Medium domains
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowAction()] // Show extension icon when on Medium pages
      }
    ]);
  });
});

// Create the context menu dynamically based on the tab content
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-in-freedium") {
    // Redirect the user to a simplified version of the Medium page
    chrome.tabs.create({ url: `https://freedium.site/${tab.url}` });
  }
});

// Listen for the page state change to dynamically create a context menu
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Only create a menu for Medium pages (including custom domains like danny.fyi)
    const urlPattern = /medium\.com/;
    if (urlPattern.test(tab.url)) {
      const menuId = `open-in-freedium-${tabId}`;

      // Create a context menu item dynamically for Medium pages
      chrome.contextMenus.create({
        id: menuId,
        title: "Open in Freedium",
        contexts: ["page"],
        documentUrlPatterns: [tab.url], // Only for this tab's URL
      });
    }
  }
});

// Remove the context menu when navigating away
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    const menuId = `open-in-freedium-${tabId}`;
    chrome.contextMenus.remove(menuId, () => {
      if (!chrome.runtime.lastError) {
        console.log(`Removed context menu for tab ${tabId}`);
      }
    });
  }
});

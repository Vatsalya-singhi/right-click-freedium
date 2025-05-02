// Listen for the page state change to dynamically create a context menu
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Skip restricted URLs like chrome:// or about://
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("about://")) {
      return;
    }

    // Inject a script to check for Medium-specific markers
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          // Check for Medium-specific meta tag
          const metaTag = document.querySelector('meta[property="og:site_name"]');
          return metaTag && metaTag.content === "Medium";
        },
      },
      (results) => {
        if (results && results[0]?.result) {
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
    );
  }
});

// Create the context menu dynamically based on the tab content
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.indexOf("open-in-freedium") !== -1) {
    // Redirect the user to a simplified version of the Medium page
    chrome.tabs.update({ url: `https://freedium.cfd/${tab.url}` });
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

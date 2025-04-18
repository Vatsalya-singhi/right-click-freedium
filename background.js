chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "redirect-menu",
      title: "Open in Freedium",
      contexts: ["page"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "redirect-menu" && tab && tab.url) {
      const currentUrl = tab.url;
  
      // Example: Redirect to a new domain with current path
      // You can modify this logic as per your need
      const newUrl = "https://freedium.cfd/" + encodeURIComponent(currentUrl);
  
      chrome.tabs.update(tab.id, { url: newUrl });
    }
  });
  
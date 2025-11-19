// Background service worker for eBay Photo Extractor

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('eBay Photo Extractor installed');
  
  // Create context menu for quick access
  chrome.contextMenus.create({
    id: 'extractEbayPhotos',
    title: 'Extract eBay Photos',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://*.ebay.com/*',
      'https://*.ebay.co.uk/*',
      'https://*.ebay.de/*',
      'https://*.ebay.fr/*',
      'https://*.ebay.it/*',
      'https://*.ebay.es/*',
      'https://*.ebay.ca/*',
      'https://*.ebay.com.au/*'
    ]
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'imageCountUpdated') {
    // Forward image count updates to popup if it's open
    chrome.runtime.sendMessage(request).catch(() => {
      // Popup might not be open, ignore error
    });
  }
  return true;
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'extractEbayPhotos') {
    // Open the popup - note: openPopup() only works in some contexts
    // The menu item itself will help users find the extension
    console.log('Context menu clicked - please use the extension icon to extract photos');
  }
});

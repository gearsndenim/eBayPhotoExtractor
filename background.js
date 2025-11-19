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

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command received:', command);
  
  if (command === 'extract-images') {
    console.log('Keyboard shortcut triggered: extract-images');
    
    // Set badge to show activity
    chrome.action.setBadgeText({ text: '...' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    console.log('Current tab URL:', tab.url);
    
    // Check if we're on an eBay page
    if (!tab.url || !tab.url.includes('ebay.')) {
      console.log('Not on an eBay page');
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'eBay Photo Extractor',
        message: 'Please navigate to an eBay listing page',
        priority: 1
      });
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 3000);
      return;
    }
    
    try {
      // Show starting notification
      const notifId = await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'eBay Photo Extractor',
        message: 'Starting download...',
        priority: 2
      });
      
      console.log('Notification created:', notifId);
      
      // Extract images from the page
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractImages' });
      
      if (!response || !response.images || response.images.length === 0) {
        console.log('No images found on this page');
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'eBay Photo Extractor',
          message: 'No images found on this page',
          priority: 1
        });
        return;
      }

      const images = response.images;
      console.log(`Found ${images.length} images to download`);
      
      // Get the listing title for filename
      let sanitizedTitle = 'eBay-Listing';
      try {
        const titleElement = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const selectors = [
              'h1.x-item-title__mainTitle',
              '.it-ttl',
              'h1[itemprop="name"]',
              '.vi-is1-titleH1',
              'h1'
            ];
            
            for (const selector of selectors) {
              const el = document.querySelector(selector);
              if (el && el.textContent.trim()) {
                return el.textContent.trim();
              }
            }
            return 'eBay-Listing';
          }
        });
        
        if (titleElement && titleElement[0] && titleElement[0].result) {
          sanitizedTitle = titleElement[0].result
            .substring(0, 50)
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
      } catch (e) {
        console.log('Could not get title, using default:', e);
      }
      
      // Create timestamp for each image
      const now = new Date();
      const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      // Download all images in order with timestamp and item name
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const urlParts = image.url.split('.');
        const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
        // Format: eBayPhotos/TIMESTAMP-ItemName-01.jpg
        const filename = `eBayPhotos/${timestamp}-${sanitizedTitle}-${String(i + 1).padStart(2, '0')}.${extension}`;
        
        try {
          await chrome.downloads.download({
            url: image.url,
            filename: filename,
            conflictAction: 'uniquify',
            saveAs: false
          });
        } catch (downloadError) {
          console.error('Download error for image:', image.url, downloadError);
        }
        
        // Random delay between downloads (250-500ms) to avoid triggering eBay bot protection
        const randomDelay = 250 + Math.random() * 250;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
      
      console.log(`Successfully downloaded ${images.length} images`);
      
      // Clear badge and show completion notification
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'eBay Photo Extractor',
        message: `✓ Successfully downloaded ${images.length} image${images.length === 1 ? '' : 's'}!`,
        priority: 2
      });
      
      // Show prominent overlay notification on the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (count) => {
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            text-align: center;
            animation: slideIn 0.3s ease-out;
          `;
          overlay.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
            <div>Download Complete!</div>
            <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">${count} image${count === 1 ? '' : 's'} downloaded</div>
          `;
          
          // Add animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideIn {
              from {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
          document.body.appendChild(overlay);
          
          setTimeout(() => {
            overlay.style.transition = 'opacity 0.3s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
          }, 3000);
        },
        args: [images.length]
      });
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error during extraction:', error);
      
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'eBay Photo Extractor',
        message: `Error: ${error.message}`,
        priority: 2
      });
      
      // Show error overlay on the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (errorMsg) => {
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            text-align: center;
            animation: slideIn 0.3s ease-out;
          `;
          overlay.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
            <div>Error</div>
            <div style="font-size: 16px; margin-top: 10px; opacity: 0.9;">${errorMsg}</div>
          `;
          
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideIn {
              from {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
          document.body.appendChild(overlay);
          
          setTimeout(() => {
            overlay.style.transition = 'opacity 0.3s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
          }, 3000);
        },
        args: [error.message]
      }).catch(err => console.error('Could not show error overlay:', err));
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 5000);
    }
  }
});

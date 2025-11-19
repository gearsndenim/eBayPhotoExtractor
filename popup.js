document.addEventListener('DOMContentLoaded', async () => {
  const extractBtn = document.getElementById('extractBtn');
  const statusDiv = document.getElementById('status');
  const countSpan = document.getElementById('count');
  const progressDiv = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');

  // Check if we're on an eBay page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url || !tab.url.includes('ebay.')) {
    statusDiv.innerHTML = '<p>⚠️ Please navigate to an eBay listing page</p>';
    statusDiv.style.background = '#fff3cd';
    statusDiv.style.borderColor = '#ffc107';
    extractBtn.disabled = true;
    return;
  }

  // Request image count from content script
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractImages' });
    if (response && response.images) {
      countSpan.textContent = response.images.length;
      if (response.images.length === 0) {
        statusDiv.innerHTML = '<p>⚠️ No images found on this page</p>';
        statusDiv.style.background = '#fff3cd';
        statusDiv.style.borderColor = '#ffc107';
      }
    }
  } catch (e) {
    console.log('Could not get initial count:', e);
  }

  extractBtn.addEventListener('click', async () => {
    try {
      extractBtn.disabled = true;
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';
      progressDiv.style.display = 'block';
      progressBar.style.width = '0%';
      progressText.textContent = 'Extracting images...';
      statusDiv.innerHTML = '<p>🔍 Scanning page for images...</p>';
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to extract images
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractImages' });
      
      if (!response || !response.images || response.images.length === 0) {
        throw new Error('No images found on this page');
      }

      const images = response.images;
      countSpan.textContent = images.length;
      
      statusDiv.innerHTML = `<p>✓ Found ${images.length} listing image(s)</p>`;
      statusDiv.style.background = '#e8f5e9';
      statusDiv.style.borderColor = '#4caf50';
      
      // Get the listing title for folder name
      let sanitizedTitle = 'eBay-Listing';
      try {
        // Get title from page
        const titleElement = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Try multiple selectors for the listing title
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
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
        }
      } catch (e) {
        console.log('Could not get title, using default:', e);
      }
      
      // Add timestamp to folder name (at the start)
      const now = new Date();
      const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      sanitizedTitle = `${timestamp}-${sanitizedTitle}`;
      
      progressText.textContent = 'Starting downloads...';
      
      // Small delay to show status
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Download all images IN ORDER (content script already sorted them correctly)
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const progress = Math.round(((i + 1) / images.length) * 100);
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Downloading ${i + 1} of ${images.length}...`;
        
        // Extract file extension from URL
        const urlParts = image.url.split('.');
        const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
        
        // Use padded numbers for proper file sorting (01, 02, 03, etc.)
        const filename = `${sanitizedTitle}/image-${String(i + 1).padStart(2, '0')}.${extension}`;
        
        try {
          await chrome.downloads.download({
            url: image.url,
            filename: filename,
            conflictAction: 'uniquify',
            saveAs: false  // Don't prompt, just download
          });
        } catch (downloadError) {
          console.error('Download error for image:', image.url, downloadError);
        }
        
        // Random delay between downloads (250-500ms) to avoid triggering eBay bot protection
        const randomDelay = 250 + Math.random() * 250;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
      
      // Show success message
      progressBar.style.width = '100%';
      progressText.textContent = 'Complete!';
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      progressDiv.style.display = 'none';
      successDiv.style.display = 'block';
      successDiv.textContent = `✓ Successfully downloaded ${images.length} listing image(s)!`;
      statusDiv.innerHTML = '<p>✓ All photos downloaded</p>';
      statusDiv.style.background = '#e8f5e9';
      statusDiv.style.borderColor = '#4caf50';
      extractBtn.disabled = false;
      
    } catch (error) {
      console.error('Error:', error);
      progressDiv.style.display = 'none';
      errorDiv.style.display = 'block';
      errorDiv.textContent = `Error: ${error.message}`;
      extractBtn.disabled = false;
    }
  });
});

// Listen for image count updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'imageCountUpdated') {
    const countSpan = document.getElementById('count');
    if (countSpan) {
      countSpan.textContent = request.count;
    }
  }
});

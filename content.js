// Content script to extract images from eBay listings

function extractImages() {
  const images = [];
  const imageSet = new Set(); // To avoid duplicates
  
  // Function to check if URL should be excluded
  function shouldExcludeImage(url) {
    const excludePatterns = [
      '/s-l64.',    // Store icons (64x64)
      '/s-l96.',    // Store icons (96x96)
      '/s-l140.',   // Small thumbnails
      '/s-l225.',   // Small thumbnails
      '/thumbs/',   // Thumbnail directories
      'ebaystatic', // eBay static assets (not listing photos)
      '/icon/',     // Icons
      '/logo/',     // Logos
      '/badge/',    // Badges
      '/sprite/',   // Sprite images
      's-l32',      // Very small icons
      's-l50',      // Small icons
    ];
    
    return excludePatterns.some(pattern => url.includes(pattern));
  }
  
  // Function to normalize and upgrade image URL to highest quality
  function normalizeImageUrl(url) {
    // Remove query parameters
    url = url.split('?')[0];
    
    // Upgrade to highest resolution
    url = url.replace(/s-l\d+/g, 's-l1600');
    
    // Upgrade $_XX.JPG to highest quality
    url = url.replace(/\$_\d+\.JPG/gi, '$_57.JPG');
    url = url.replace(/\$_\d+\.jpg/gi, '$_57.JPG');
    
    return url;
  }

  // Method 1: MOST RELIABLE - Look for the main image carousel/gallery specifically
  const prioritySelectors = [
    '.ux-image-carousel-item img',           // New eBay carousel
    '.ux-image-filmstrip-carousel-item img', // Filmstrip view
    '[data-testid="ux-image-carousel"] img', // Carousel with test ID
    '#icImg',                                 // Classic view main image
    '.vi-image-gallery img',                  // Classic gallery
  ];

  // Extract images using priority selectors first (most reliable)
  // We'll try each selector and stop when we find images
  for (const selector of prioritySelectors) {
    try {
      const imgs = document.querySelectorAll(selector);
      
      if (imgs.length > 0) {
        console.log(`Found ${imgs.length} images using selector: ${selector}`);
        
        // Process images IN ORDER as they appear in the DOM
        imgs.forEach((img, index) => {
          let src = img.src || img.dataset.src || img.dataset.zoom || img.dataset.highres;
          
          if (src && src.includes('ebayimg.com')) {
            // Skip excluded images (store icons, badges, etc.)
            if (shouldExcludeImage(src)) {
              console.log('Skipping excluded image:', src);
              return;
            }
            
            // Normalize URL
            src = normalizeImageUrl(src);
            
            if (!imageSet.has(src)) {
              imageSet.add(src);
              images.push({
                url: src,
                filename: `ebay-image-${images.length + 1}.jpg`,
                order: index  // Preserve order from carousel
              });
            }
          }
        });
        
        // If we found images with this selector, don't try other selectors
        // This ensures we get images from ONE consistent source
        if (images.length > 0) {
          console.log(`Using ${images.length} images from primary selector`);
          break;
        }
      }
    } catch (e) {
      console.error('Error with selector:', selector, e);
    }
  }

  // Method 2: JSON-LD data (only if we haven't found images from carousel)
  if (images.length === 0) {
    console.log('No images found in carousel, trying JSON-LD...');
    try {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data.image) {
            const imgs = Array.isArray(data.image) ? data.image : [data.image];
            imgs.forEach((imgUrl, index) => {
              if (typeof imgUrl === 'string' && imgUrl.includes('ebayimg.com')) {
                if (shouldExcludeImage(imgUrl)) {
                  return;
                }
                
                imgUrl = normalizeImageUrl(imgUrl);
                
                if (!imageSet.has(imgUrl)) {
                  imageSet.add(imgUrl);
                  images.push({
                    url: imgUrl,
                    filename: `ebay-image-${images.length + 1}.jpg`,
                    order: index
                  });
                }
              }
            });
          }
        } catch (e) {
          // Ignore parse errors
        }
      });
    } catch (e) {
      console.error('Error parsing JSON-LD:', e);
    }
  }

  // Method 3: Picture elements (only if we still haven't found images)
  if (images.length === 0) {
    console.log('No images found in JSON-LD, trying picture elements...');
    try {
      const sources = document.querySelectorAll('picture source[srcset*="ebayimg"]');
      sources.forEach((source, index) => {
        const srcset = source.srcset;
        if (srcset) {
          // Extract the largest image from srcset
          const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          urls.forEach(url => {
            if (url.includes('ebayimg.com')) {
              if (shouldExcludeImage(url)) {
                return;
              }
              
              url = normalizeImageUrl(url);
              
              if (!imageSet.has(url)) {
                imageSet.add(url);
                images.push({
                  url: url,
                  filename: `ebay-image-${images.length + 1}.jpg`,
                  order: index
                });
              }
            }
          });
        }
      });
    } catch (e) {
      console.error('Error extracting from picture elements:', e);
    }
  }

  // Sort images by their original order in the carousel/page
  images.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Update filenames to reflect correct order after sorting
  images.forEach((img, index) => {
    img.filename = `ebay-image-${String(index + 1).padStart(2, '0')}.jpg`;
  });
  
  // Log what we found for debugging
  console.log(`eBay Photo Extractor: Found ${images.length} listing images in correct order`);
  if (images.length > 0) {
    console.log('First image URL:', images[0].url);
    console.log('All images in order:', images.map((img, idx) => `${idx + 1}. ${img.url}`));
  }
  
  return images;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractImages') {
    console.log('eBay Photo Extractor: Extracting images...');
    const images = extractImages();
    console.log('eBay Photo Extractor: Returning', images.length, 'images');
    sendResponse({ images: images });
  }
  return true; // Keep the message channel open for async response
});

// Auto-detect and send initial image count when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const images = extractImages();
      chrome.runtime.sendMessage({ 
        action: 'imageCountUpdated', 
        count: images.length 
      });
    }, 1000);
  });
} else {
  setTimeout(() => {
    const images = extractImages();
    chrome.runtime.sendMessage({ 
      action: 'imageCountUpdated', 
      count: images.length 
    });
  }, 1000);
}

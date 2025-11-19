# 📸 eBay Photo Extractor

A Chrome extension that extracts and downloads all photos from eBay listings directly to your browser's download folder.

## Features

- ✨ **One-Click Download**: Extract all listing photos with a single click
- 🌍 **Multi-Site Support**: Works on eBay.com, eBay.co.uk, eBay.de, and other eBay international sites
- 📁 **Organized Downloads**: Images are saved in folders named after the listing
- 🖼️ **High Resolution**: Automatically fetches the highest quality images available
- 🎯 **Smart Detection**: Finds images from multiple sources including carousels, galleries, and metadata
- 💨 **Fast & Efficient**: Downloads all images quickly with progress tracking

## Installation

### Install from Source (Developer Mode)

1. **Download or Clone this Repository**
   ```bash
   git clone https://github.com/yourusername/eBayPhotoExtractor.git
   ```
   Or download as ZIP and extract it.

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the `eBayPhotoExtractor` folder
   - Select the folder and click "Select"

5. **Confirm Installation**
   - You should see the eBay Photo Extractor extension appear in your extensions list
   - Pin it to your toolbar for easy access (click the puzzle icon, then the pin next to eBay Photo Extractor)

## Usage

1. **Navigate to an eBay Listing**
   - Go to any eBay product listing page (e.g., ebay.com/itm/...)
   - Works on any international eBay site

2. **Open the Extension**
   - Click the eBay Photo Extractor icon in your Chrome toolbar
   - The popup will show how many images were detected

3. **Download Photos**
   - Click the "Extract & Download Photos" button
   - Watch the progress bar as images are downloaded
   - All images will be saved to your default Downloads folder

4. **Find Your Images**
   - Images are saved in a subfolder named after the listing
   - Location: `Downloads/eBay-Listing-Title/image-01.jpg`, `image-02.jpg`, etc.

## Supported Sites

- eBay.com (United States)
- eBay.co.uk (United Kingdom)
- eBay.de (Germany)
- eBay.fr (France)
- eBay.it (Italy)
- eBay.es (Spain)
- eBay.ca (Canada)
- eBay.com.au (Australia)

The extension works on any eBay domain variant!

## Technical Details

### Project Structure
```
eBayPhotoExtractor/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.css             # Popup styling
├── popup.js              # Popup logic
├── content.js            # Content script for image extraction
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### How It Works

1. **Content Script** (`content.js`): Injected into eBay pages to detect and extract image URLs
2. **Popup Interface** (`popup.html/js/css`): User interface for triggering downloads
3. **Background Worker** (`background.js`): Handles messaging and context menu integration
4. **Download API**: Uses Chrome's native downloads API to save images

### Image Detection Methods

The extension uses multiple strategies to find images:
- Main image carousel and galleries
- Filmstrip thumbnails
- JSON-LD metadata
- Picture elements with srcsets
- Direct eBay image CDN URLs

## Permissions Explained

- **activeTab**: Read the current eBay page to extract images
- **downloads**: Save images to your Downloads folder
- **scripting**: Inject the content script into eBay pages
- **host_permissions**: Access eBay domains to extract images

## Troubleshooting

### No Images Found
- Make sure you're on an eBay product listing page (not search results)
- Wait for the page to fully load before clicking the extension
- Try refreshing the page and opening the extension again

### Downloads Not Starting
- Check that Chrome has permission to download multiple files
- Go to Chrome Settings → Privacy and security → Site settings → Additional permissions → Automatic downloads
- Make sure downloads aren't blocked

### Images Missing or Low Quality
- Some sellers may only upload a few images
- The extension fetches the highest quality available from eBay
- If images appear low quality, that's what the seller uploaded

## Privacy & Security

- ✅ No data collection or tracking
- ✅ No external servers or API calls
- ✅ Only accesses eBay pages when you're viewing them
- ✅ All processing happens locally in your browser
- ✅ No images are uploaded or sent anywhere

## Development

### Requirements
- Google Chrome 88+ (Manifest V3 support)
- Basic knowledge of JavaScript, HTML, CSS

### Making Changes
1. Edit the source files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the eBay Photo Extractor card
4. Test your changes on an eBay listing

### Building Icons
If you want to customize the icons:
```bash
python3 generate_icons.py
```

Or create your own 16x16, 48x48, and 128x128 PNG images.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

MIT License - Feel free to use and modify as needed.

## Disclaimer

This extension is not affiliated with or endorsed by eBay Inc. It's an independent tool created to help users save images from listings they're viewing. Please respect copyright and only download images for personal use or with proper authorization.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Make sure you're using the latest version
3. Open an issue on GitHub with details about the problem

---

**Enjoy using eBay Photo Extractor!** 🎉

If you find this extension helpful, consider starring the repository on GitHub!

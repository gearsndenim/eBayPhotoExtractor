# Changelog

All notable changes to eBay Photo Extractor will be documented in this file.

## [1.0.4] - 2025-11-19

### Improved
- **New professional icon design** with eBay brand colors
  - eBay blue background (#0064D2)
  - Photo stack visual showing multiple images
  - Mountain landscape inside photo frame
  - Red download arrow badge
  - Color accents: eBay green (#86B817) and yellow (#F5AF02)
- More recognizable and professional appearance
- Better visibility in toolbar and extensions page

## [1.0.3] - 2025-11-19

### Fixed
- Images now download in the exact order they appear in the listing carousel
- File names use zero-padded numbers (01, 02, 03...) for proper sorting
- Extraction stops after finding images from primary source (no mixing of sources)

### Improved
- Better console logging to show extraction order
- Only tries fallback methods if primary carousel is empty
- Maintains consistent source for all images in a single extraction

### Technical
- Added order tracking to image objects
- Sort images by carousel position before returning
- Sequential download with proper delays to maintain order
- Enhanced logging to verify correct order

## [1.0.2] - 2025-11-19

### Added
- Timestamp in folder names (format: Listing-Title-YYYYMMDD-HHMMSS)
- Prevents overwriting previous downloads
- Better organization with chronological sorting

### Benefits
- Each extraction creates a unique folder
- Easy to track when images were downloaded
- Download from same listing multiple times without conflicts

## [1.0.1] - 2025-11-19

### Fixed
- Long delay before downloads started - now shows immediate feedback
- Wrong images being downloaded (unrelated items) - now only extracts carousel images
- Store icons being downloaded - added smart filtering to exclude icons/badges/logos

### Improved
- Immediate visual status updates ("Extracting images...", "Found X images")
- Better image filtering with exclusion patterns
- Enhanced console logging for debugging
- Color-coded success messages
- Smoother progress indication

### Technical
- Added `shouldExcludeImage()` function to filter unwanted images
- Added `normalizeImageUrl()` to upgrade to highest quality
- Prioritized carousel selectors for more reliable extraction
- Better title extraction from page

## [1.0.0] - 2025-11-18

### Added
- Initial release of eBay Photo Extractor
- One-click photo extraction from eBay listings
- Support for multiple eBay international sites (US, UK, DE, FR, IT, ES, CA, AU)
- Beautiful gradient UI with purple theme
- Real-time image counter
- Progress tracking during downloads
- Automatic high-resolution image fetching
- Organized downloads in folders named after listings
- Right-click context menu integration
- Multi-method image detection (carousels, JSON-LD, srcsets)
- Chrome Manifest V3 compliance
- Lightweight and privacy-focused (no tracking, no external servers)

### Features
- Extract all listing photos with one click
- Downloads saved to browser's Downloads folder
- Automatic folder organization by listing title
- Progress bar with download status
- Error handling and user notifications
- Works on all eBay domains
- High-resolution image prioritization

### Technical
- Manifest V3 service worker architecture
- Content script injection for image extraction
- Chrome Downloads API integration
- Message passing between popup and content script
- Context menu for quick access
- Efficient duplicate detection
- Support for various eBay page layouts

---

## Future Enhancements (Ideas)

### Possible v1.1.0 features:
- [ ] Settings page for download preferences
- [ ] ZIP archive option for bulk downloads
- [ ] Image preview before downloading
- [ ] Custom filename patterns
- [ ] Download location selection
- [ ] Image size filtering options

### Possible v1.2.0 features:
- [ ] Support for other marketplaces (Amazon, Etsy, etc.)
- [ ] Batch processing from multiple tabs
- [ ] Image format conversion
- [ ] Watermark removal tools
- [ ] CSV export of image URLs

### Possible v2.0.0 features:
- [ ] Cloud storage integration
- [ ] Image editing tools
- [ ] Automatic image enhancement
- [ ] Duplicate image detection across listings
- [ ] API for programmatic access

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

---

## Contributing

To suggest features or report bugs, please create an issue on GitHub!

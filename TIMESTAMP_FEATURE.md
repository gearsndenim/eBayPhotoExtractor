# Version 1.0.2 - Timestamp Feature

## ✨ New Feature: Timestamped Folders

### What Changed
Downloads are now saved in folders with timestamps to keep extractions organized and prevent overwriting.

### Folder Naming Format
```
Listing-Title-YYYYMMDD-HHMMSS/
```

### Examples
```
Mens-Sweater-Large-20251119-143025/
  ├── image-01.jpg
  ├── image-02.jpg
  └── image-03.jpg

Vintage-Jeans-Blue-20251119-151230/
  ├── image-01.jpg
  └── image-02.jpg
```

### Benefits
✅ **No overwriting** - Each extraction gets its own unique folder  
✅ **Time tracking** - Know exactly when you downloaded the images  
✅ **Better organization** - Easy to sort by date  
✅ **Multiple extractions** - Download from the same listing multiple times  

### Timestamp Format
- **YYYYMMDD** - Date (e.g., 20251119 = November 19, 2025)
- **HHMMSS** - Time in 24-hour format (e.g., 143025 = 2:30:25 PM)

### Example Timeline
If you download photos from the same listing three times:
```
Downloads/
  ├── Sweater-Green-20251119-140000/  ← First download (2:00 PM)
  ├── Sweater-Green-20251119-143000/  ← Second download (2:30 PM)
  └── Sweater-Green-20251119-150000/  ← Third download (3:00 PM)
```

## How to Use
Just use the extension as normal! The timestamp is added automatically.

1. Open any eBay listing
2. Click the extension icon
3. Click "Extract & Download Photos"
4. Images save to: `Downloads/Listing-Title-YYYYMMDD-HHMMSS/`

## Update Instructions
1. Go to `chrome://extensions/`
2. Find "eBay Photo Extractor"
3. Click the refresh icon 🔄
4. You're all set!

The timestamp feature is now active and will be used for all future downloads.

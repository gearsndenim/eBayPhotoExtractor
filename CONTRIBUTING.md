# Contributing to eBay Photo Extractor

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs 🐛

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser version and OS
- Screenshot if applicable

### Suggesting Features 💡

Have an idea? Open an issue with:
- Clear description of the feature
- Use case / why it would be helpful
- Any implementation ideas (optional)

### Pull Requests 🔧

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Test thoroughly on eBay listings
   - Update documentation if needed
4. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description"
   ```
5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/gearsndenim/eBayPhotoExtractor.git
   ```

2. Load in Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

3. Make changes and test
   - Edit code
   - Reload extension
   - Test on eBay listings

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and small
- Test on multiple eBay sites

## Testing Checklist

Before submitting a PR, please test:
- [ ] Works on ebay.com
- [ ] Works on ebay.co.uk (or other international site)
- [ ] Images download in correct order
- [ ] No console errors
- [ ] Filters out store icons/badges
- [ ] Progress indicator works
- [ ] Timestamps in folder names work

## Areas for Contribution

Some ideas if you want to help:

- **New features**: ZIP download, batch processing, image preview
- **Bug fixes**: Any issues you encounter
- **Documentation**: Improve guides, add translations
- **Testing**: Test on different eBay sites and layouts
- **Performance**: Optimize image detection
- **UI/UX**: Improve popup design and interactions

## Questions?

Feel free to open an issue for any questions about contributing!

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the issue, not the person
- Help maintain a positive community

Thank you for contributing! 🙏

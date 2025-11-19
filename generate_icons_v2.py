#!/usr/bin/env python3
"""
Professional icon generator for eBay Photo Extractor Chrome extension.
Creates modern, flat design icons with eBay-inspired colors.
"""

try:
    from PIL import Image, ImageDraw
    import os
    
    def create_icon(size, output_path):
        """Create a professional icon with photo gallery and download symbol"""
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Scale factor for different sizes
        scale = size / 128
        
        # Draw circular background with eBay blue
        center = size // 2
        radius = int(size * 0.46)
        draw.ellipse(
            [(center - radius, center - radius), 
             (center + radius, center + radius)],
            fill='#0064D2'  # eBay blue
        )
        
        # Draw photo stack (2 photos overlapping)
        photo_size = int(38 * scale)
        center_x = size // 2
        center_y = size // 2
        offset = int(5 * scale)
        
        # Back photo (lighter, offset)
        back_x1 = center_x - photo_size // 2 - offset
        back_y1 = center_y - photo_size // 2 - offset
        back_x2 = back_x1 + photo_size
        back_y2 = back_y1 + photo_size
        
        draw.rounded_rectangle(
            [(back_x1, back_y1), (back_x2, back_y2)],
            radius=max(2, int(3 * scale)),
            fill=(255, 255, 255, 100)  # Semi-transparent white
        )
        
        # Front photo (main white photo frame)
        front_x1 = center_x - photo_size // 2 + offset
        front_y1 = center_y - photo_size // 2 + offset  
        front_x2 = front_x1 + photo_size
        front_y2 = front_y1 + photo_size
        
        draw.rounded_rectangle(
            [(front_x1, front_y1), (front_x2, front_y2)],
            radius=max(2, int(3 * scale)),
            fill='white'
        )
        
        # Draw image icon inside (mountain landscape)
        mountain_base_y = front_y2 - int(8 * scale)
        
        # Left mountain (blue)
        draw.polygon([
            (front_x1 + int(photo_size * 0.1), mountain_base_y),
            (front_x1 + int(photo_size * 0.35), front_y1 + int(photo_size * 0.4)),
            (front_x1 + int(photo_size * 0.5), mountain_base_y)
        ], fill='#0064D2')
        
        # Right mountain (green accent)
        draw.polygon([
            (front_x1 + int(photo_size * 0.35), mountain_base_y),
            (front_x1 + int(photo_size * 0.6), front_y1 + int(photo_size * 0.5)),
            (front_x1 + int(photo_size * 0.8), mountain_base_y)
        ], fill='#86B817')  # eBay green
        
        # Sun (yellow circle)
        sun_x = front_x1 + int(photo_size * 0.75)
        sun_y = front_y1 + int(photo_size * 0.25)
        sun_r = max(2, int(5 * scale))
        draw.ellipse(
            [(sun_x - sun_r, sun_y - sun_r), (sun_x + sun_r, sun_y + sun_r)],
            fill='#F5AF02'  # eBay yellow
        )
        
        # Download arrow badge (bottom right corner)
        badge_x = front_x2 - int(6 * scale)
        badge_y = front_y2 - int(6 * scale)
        badge_r = max(4, int(9 * scale))
        
        # Red circle background
        draw.ellipse(
            [(badge_x - badge_r, badge_y - badge_r),
             (badge_x + badge_r, badge_y + badge_r)],
            fill='#E53238'  # eBay red
        )
        
        # White download arrow
        arrow_w = max(1, int(2 * scale))
        arrow_h = max(3, int(5 * scale))
        
        # Arrow shaft
        draw.rectangle(
            [(badge_x - arrow_w // 2, badge_y - arrow_h),
             (badge_x + arrow_w // 2, badge_y)],
            fill='white'
        )
        
        # Arrow head (triangle pointing down)
        arrow_head = max(2, int(3 * scale))
        draw.polygon([
            (badge_x - arrow_head, badge_y - arrow_head // 2),
            (badge_x, badge_y + arrow_head // 2),
            (badge_x + arrow_head, badge_y - arrow_head // 2)
        ], fill='white')
        
        # Save with high quality
        img.save(output_path, 'PNG', optimize=True)
        print(f"✓ Created {output_path}")
    
    # Create icons directory if it doesn't exist
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    print("🎨 Generating professional icons with eBay colors...")
    print()
    
    # Generate icons at different sizes
    create_icon(16, os.path.join(icons_dir, 'icon16.png'))
    create_icon(48, os.path.join(icons_dir, 'icon48.png'))
    create_icon(128, os.path.join(icons_dir, 'icon128.png'))
    
    print()
    print("✨ All icons created successfully!")
    print()
    print("Icon features:")
    print("  • eBay blue background (#0064D2)")
    print("  • Photo stack design (multiple images)")
    print("  • Mountain landscape inside photo")
    print("  • Download arrow badge (red)")
    print("  • eBay brand color accents (green, yellow)")
    print()
    print("The icons should now look more professional and recognizable!")
    
except ImportError:
    print("❌ PIL/Pillow not installed")
    print()
    print("To generate icons, install Pillow:")
    print("  pip3 install Pillow")
    print()
    print("Then run this script again:")
    print("  python3 generate_icons.py")
    print()
    print("Or create your own 16x16, 48x48, and 128x128 PNG icons")
    print("and save them in the icons/ folder.")

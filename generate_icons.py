#!/usr/bin/env python3
"""
Simple icon generator for the Chrome extension.
Creates basic PNG icons if you don't have design software.

You can either:
1. Use online tools to convert icon128.svg to PNG at different sizes
2. Use this script if you have PIL/Pillow installed: pip install Pillow
3. Create your own icons manually
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, output_path):
        """Create a simple icon with gradient background and camera symbol"""
        # Create image with gradient-like background
        img = Image.new('RGB', (size, size), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        # Draw a simple camera representation
        # Camera body
        body_size = int(size * 0.5)
        body_x = (size - body_size) // 2
        body_y = int(size * 0.35)
        draw.rounded_rectangle(
            [(body_x, body_y), (body_x + body_size, body_y + int(body_size * 0.7))],
            radius=int(size * 0.08),
            fill='white'
        )
        
        # Lens
        lens_center = (size // 2, int(size * 0.55))
        lens_radius = int(size * 0.15)
        draw.ellipse(
            [(lens_center[0] - lens_radius, lens_center[1] - lens_radius),
             (lens_center[0] + lens_radius, lens_center[1] + lens_radius)],
            fill='#667eea'
        )
        
        # Save
        img.save(output_path, 'PNG')
        print(f"Created {output_path}")
    
    # Create icons directory if it doesn't exist
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    # Generate icons at different sizes
    create_icon(16, os.path.join(icons_dir, 'icon16.png'))
    create_icon(48, os.path.join(icons_dir, 'icon48.png'))
    create_icon(128, os.path.join(icons_dir, 'icon128.png'))
    
    print("\n✓ All icons created successfully!")
    print("\nIf the icons don't look good, you can:")
    print("1. Edit them with any image editor")
    print("2. Use online tools like Canva or Figma")
    print("3. Convert the SVG file using: https://convertio.co/svg-png/")
    
except ImportError:
    print("PIL/Pillow not installed. To use this script, run:")
    print("  pip install Pillow")
    print("\nAlternatively, you can:")
    print("1. Convert icons/icon128.svg to PNG online at https://convertio.co/svg-png/")
    print("2. Create 16x16, 48x48, and 128x128 PNG versions")
    print("3. Save them as icon16.png, icon48.png, and icon128.png in the icons/ folder")
    print("4. Or use placeholder icons - the extension will still work!")

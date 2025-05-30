# WordPress Content Migration Guide

## Methods to Export Content from WordPress

### 1. WordPress Export Tool (Recommended for most content)
- Go to your WordPress admin: Tools → Export
- Choose "All content" or select specific post types
- Download the XML file containing all your content

### 2. WordPress REST API (For automated migration)
- Access your WordPress content via: `yoursite.com/wp-json/wp/v2/posts`
- Can programmatically fetch posts, pages, media, etc.

### 3. Database Export (For complete migration)
- Export your WordPress database via phpMyAdmin or hosting panel
- Extract content from wp_posts, wp_postmeta tables

## Content Mapping Strategy

### WordPress → Theatre Website Mapping
```
WordPress Posts/Pages → News Articles
- Title → title
- Content → content
- Excerpt → excerpt
- Date → date
- Categories → category

WordPress Custom Posts → Productions
- If you have production/show custom post types
- Map custom fields to our production schema

WordPress Media → Gallery Images
- Featured images and media library
- Download images and upload to our system

WordPress Pages → Static Pages
- About, Contact pages can be manually recreated
- Or content can be copied over
```

## Implementation Options

### Option 1: Manual Content Entry
- Copy/paste important content into our contact form
- Use our admin interface (when built)
- Best for small amounts of high-quality content

### Option 2: CSV Import Tool
- Export WordPress data to CSV
- Create import script for bulk content creation
- Good for medium amounts of structured content

### Option 3: Custom Migration Script
- Build a one-time script to read WordPress export
- Parse XML and create entries in our system
- Best for large amounts of content

## Next Steps

1. **Export your WordPress content** using the export tool
2. **Identify key content** you want to migrate:
   - News articles/blog posts
   - Show/production information
   - Cast member profiles
   - Image galleries
   - Contact information

3. **Choose migration method** based on content volume:
   - Small (< 50 items): Manual entry
   - Medium (50-200 items): CSV import
   - Large (200+ items): Custom script

Would you like me to create a specific migration tool for your content type?
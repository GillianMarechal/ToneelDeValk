# Toneelgroep De Valk - Static Export

This is a static export of the Toneelgroep De Valk website, ready for deployment to any web hosting service.

## 🚀 Quick Deploy

### Netlify
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag and drop this entire folder
3. Your site will be live in seconds!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

### GitHub Pages
1. Create a new repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source branch and save

### Traditional Web Hosting
1. Upload all files to your web server's public directory
2. Ensure your server supports .htaccess (Apache) or configure redirects manually

## 📁 File Structure

- `index.html` - Main application entry point
- `api/` - Static JSON data for all content
- `assets/` - Images and other static assets
- `_redirects` - Netlify routing configuration
- `.htaccess` - Apache routing configuration
- `vercel.json` - Vercel deployment configuration
- `404.html` - GitHub Pages SPA routing fallback

## 🎭 Content

The static export includes:
- 3 productions (Olifantman, Dwaasheid, Coo Coo)
- 3 news articles
- 4 cast members
- 6 gallery images across multiple categories
- Complete API endpoints for all content

## 🔧 Customization

To update content, modify the JSON files in the `api/` directory:
- `api/productions.json` - Theater productions
- `api/news.json` - News articles
- `api/cast.json` - Cast and crew
- `api/gallery.json` - Image gallery

## 📞 Support

For questions about this static export, contact the development team.

---
Generated on: 16/9/2025, 16:44:52

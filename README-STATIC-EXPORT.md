# Static Export for Toneelgroep De Valk

This document explains how to generate a static version of your theatre website for deployment to any web hosting service.

## Quick Start

Run the static export script:

```bash
./build-static.sh
```

This will:
1. Build the React application for static hosting
2. Export all your theatre data (productions, news, cast, gallery)
3. Create routing files for various hosting platforms
4. Generate a complete static site in the `static-export/` folder

## What Gets Exported

- **Productions**: All current and upcoming shows
- **News Articles**: Latest news and featured articles
- **Cast Members**: Actor profiles and featured performers
- **Gallery Images**: Production photos and backstage images
- **Hero Images**: Homepage carousel images

## Deployment Options

### Netlify (Recommended)
1. Drag the `static-export` folder to [netlify.com/drop](https://netlify.com/drop)
2. Your site will be live instantly with automatic SSL

### Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to `static-export` folder
3. Run: `vercel --prod`

### GitHub Pages
1. Create a new repository on GitHub
2. Upload contents of `static-export` to the repository
3. Enable GitHub Pages in repository settings

### Traditional Web Hosting
1. Upload contents of `static-export` to your web server's root directory
2. Ensure your server supports URL rewriting (`.htaccess` file included)

## File Structure

```
static-export/
├── index.html              # Main application
├── assets/                 # CSS, JS, and images
├── api/                    # Static JSON data files
│   ├── productions.json
│   ├── news.json
│   ├── cast.json
│   └── gallery.json
├── _redirects              # Netlify routing
├── .htaccess              # Apache routing
└── vercel.json            # Vercel routing
```

## Customizing Data

To update the static data:
1. Make changes in your admin panel or database
2. Run `./build-static.sh` again to regenerate the export

## WordPress Integration

The export automatically pulls data from your WordPress site if configured. Update your WordPress credentials in the environment variables to ensure fresh data export.

## Troubleshooting

**Build fails**: Ensure all dependencies are installed with `npm install`

**Missing data**: Check your WordPress credentials and database connection

**Routing issues**: Verify that your hosting platform supports SPA routing

## Performance Benefits

- **Fast Loading**: No server-side processing required
- **Global CDN**: Most hosting platforms provide automatic CDN
- **High Availability**: Static sites rarely go down
- **Cost Effective**: Many static hosting services are free
- **SEO Friendly**: All content is pre-rendered

## Updating the Site

Whenever you add new productions, news, or cast members:
1. Update through your admin panel
2. Run `./build-static.sh`
3. Deploy the new `static-export` folder

Your static site will always reflect the latest content from your database.
#!/bin/bash

echo "Building static export for Toneelgroep De Valk..."

# Build the client using the static config
echo "Building client assets..."
npx vite build --config vite.config.static.ts

# Export authentic data from your WordPress/database
echo "Exporting authentic theatre data..."
node scripts/export-data.js

# Create routing files for different hosting platforms
echo "🌐 Creating routing configuration..."

# For Netlify
cat > static-export/_redirects << 'EOF'
/*    /index.html   200
EOF

# For Apache servers
cat > static-export/.htaccess << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF

# For Vercel
cat > static-export/vercel.json << 'EOF'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF

echo "✅ Static export completed successfully!"
echo "📁 Static files generated in: ./static-export/"
echo ""
echo "📋 Deploy instructions:"
echo "  • Upload the static-export folder to any web server"
echo "  • For Netlify: Drag the folder to netlify.com/drop"
echo "  • For Vercel: Run 'vercel --prod' in the static-export folder"
echo "  • For GitHub Pages: Push the contents to gh-pages branch"
echo "  • For Apache/Nginx: Upload contents to your web root"
echo ""
echo "🔧 To customize data:"
echo "  • Edit the JSON files in static-export/api/"
echo "  • Replace placeholder images with real ones"
echo "  • Update meta tags in index.html"
#!/bin/bash

echo "🏗️  Building static export for Toneelgroep De Valk..."

# Build the client using the static config
echo "📦 Building client assets..."
npx vite build --config vite.config.static.ts

# Create static API data
echo "📊 Creating static API data..."
mkdir -p static-export/api

# Create sample data files (you can replace these with real data)
cat > static-export/api/productions.json << 'EOF'
[
  {
    "id": 1,
    "title": "Olifantman",
    "description": "Een ontroerende voorstelling over moed en vriendschap",
    "imageUrl": "/api/placeholder/400/300",
    "status": "current",
    "genre": "Drama",
    "duration": "2 uur 30 min",
    "dates": "December 2024 - Maart 2025"
  }
]
EOF

cat > static-export/api/news.json << 'EOF'
[
  {
    "id": 1,
    "title": "Olifantman première groot succes",
    "excerpt": "De première van onze nieuwste productie werd enthousiast ontvangen door publiek en pers.",
    "content": "De première van Olifantman was een groot succes...",
    "publishedAt": "2024-12-01T19:00:00.000Z",
    "featured": true,
    "imageUrl": "/api/placeholder/600/400"
  }
]
EOF

cat > static-export/api/news/featured.json << 'EOF'
[
  {
    "id": 1,
    "title": "Olifantman première groot succes",
    "excerpt": "De première van onze nieuwste productie werd enthousiast ontvangen door publiek en pers.",
    "content": "De première van Olifantman was een groot succes...",
    "publishedAt": "2024-12-01T19:00:00.000Z",
    "featured": true,
    "imageUrl": "/api/placeholder/600/400"
  }
]
EOF

mkdir -p static-export/api/news
mkdir -p static-export/api/cast

cat > static-export/api/cast.json << 'EOF'
[
  {
    "id": 1,
    "name": "Jan De Valk",
    "role": "Hoofdrolspeler",
    "bio": "Ervaren acteur met meer dan 20 jaar ervaring",
    "imageUrl": "/api/placeholder/300/400",
    "featured": true
  }
]
EOF

cat > static-export/api/cast/featured.json << 'EOF'
[
  {
    "id": 1,
    "name": "Jan De Valk",
    "role": "Hoofdrolspeler",
    "bio": "Ervaren acteur met meer dan 20 jaar ervaring",
    "imageUrl": "/api/placeholder/300/400",
    "featured": true
  }
]
EOF

cat > static-export/api/gallery.json << 'EOF'
[
  {
    "id": 1,
    "title": "Olifantman repetities",
    "imageUrl": "/api/placeholder/600/400",
    "category": "backstage",
    "description": "Achter de schermen bij Olifantman"
  }
]
EOF

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
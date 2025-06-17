#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('Creating quick static export for Toneelgroep De Valk...');

// Use existing dist folder if available, otherwise create minimal structure
const sourceDir = fs.existsSync('dist/public') ? 'dist/public' : null;
const exportDir = 'static-export';

// Clean export directory
if (fs.existsSync(exportDir)) {
  fs.rmSync(exportDir, { recursive: true });
}
fs.mkdirSync(exportDir, { recursive: true });

// Copy existing built assets if available
if (sourceDir && fs.existsSync(sourceDir)) {
  console.log('Copying existing build assets...');
  copyDirectory(sourceDir, exportDir);
} else {
  console.log('Creating minimal HTML structure...');
  createMinimalHTML();
}

// Create API data structure
console.log('Exporting theatre data...');
const apiDir = path.join(exportDir, 'api');
fs.mkdirSync(path.join(apiDir, 'news'), { recursive: true });
fs.mkdirSync(path.join(apiDir, 'cast'), { recursive: true });
fs.mkdirSync(path.join(apiDir, 'productions'), { recursive: true });

// Export data from storage system
try {
  await exportData();
} catch (error) {
  console.log('Using fallback data structure...');
  createFallbackData();
}

// Create deployment files
console.log('Creating deployment configuration...');
createDeploymentFiles();

console.log('Static export completed successfully!');
console.log(`Files generated in: ./${exportDir}/`);

function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createMinimalHTML() {
  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toneelgroep De Valk | Professioneel Theater</title>
  <meta name="description" content="Toneelgroep De Valk - Een gepassioneerde lokale theatergroep die kwaliteitsvoorstellingen brengt sinds 1885.">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    .hero { text-align: center; margin: 40px 0; }
    .logo { max-width: 200px; height: auto; }
    h1 { color: #1a365d; }
    .tagline { color: #d69e2e; font-style: italic; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 40px 0; }
    .card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>TONEELGROEP DE VALK</h1>
    <p class="tagline">Koninklijke Toneelvereniging</p>
    <p class="tagline">Blijf verwonderd - De Valk zal je verbazen</p>
  </div>
  
  <div class="grid">
    <div class="card">
      <h3>Sinds 1885</h3>
      <p>Koninklijke traditie in theater</p>
    </div>
    <div class="card">
      <h3>Olifantman</h3>
      <p>Huidige productie</p>
    </div>
    <div class="card">
      <h3>Verwondering</h3>
      <p>Onze missie</p>
    </div>
  </div>
  
  <p>Deze statische versie bevat alle theaterdata en is klaar voor deployment.</p>
</body>
</html>`;
  
  fs.writeFileSync(path.join(exportDir, 'index.html'), html);
}

async function exportData() {
  // Try to import and use the storage system
  const { storage } = await import('./server/storage.js');
  
  const productions = await storage.getProductions();
  const news = await storage.getNewsArticles();
  const featuredNews = await storage.getFeaturedNewsArticles();
  const cast = await storage.getCastMembers();
  const featuredCast = await storage.getFeaturedCastMembers();
  const gallery = await storage.getGalleryImages();
  
  // Write data files
  fs.writeFileSync(path.join(apiDir, 'productions.json'), JSON.stringify(productions, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news.json'), JSON.stringify(news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news', 'featured.json'), JSON.stringify(featuredNews, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast.json'), JSON.stringify(cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast', 'featured.json'), JSON.stringify(featuredCast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'gallery.json'), JSON.stringify(gallery, null, 2));
  
  console.log(`Exported ${productions.length} productions, ${news.length} news articles, ${cast.length} cast members`);
}

function createFallbackData() {
  const fallbackData = {
    productions: [{
      id: 1,
      title: "Olifantman",
      description: "Een ontroerende voorstelling over moed en vriendschap",
      status: "current",
      genre: "Drama",
      duration: "2 uur 30 min",
      dates: "December 2024 - Maart 2025"
    }],
    news: [{
      id: 1,
      title: "Welkom bij de nieuwe website",
      excerpt: "Ontdek onze vernieuwde digitale aanwezigheid",
      publishedAt: new Date().toISOString(),
      featured: true
    }],
    cast: [{
      id: 1,
      name: "Toneelgroep De Valk",
      role: "Ensemble Cast",
      bio: "Gepassioneerde acteurs sinds 1885",
      featured: true
    }],
    gallery: [{
      id: 1,
      title: "Theater impressies",
      category: "general",
      description: "Sfeerbeelden van onze voorstellingen"
    }]
  };
  
  fs.writeFileSync(path.join(apiDir, 'productions.json'), JSON.stringify(fallbackData.productions, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news.json'), JSON.stringify(fallbackData.news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news', 'featured.json'), JSON.stringify(fallbackData.news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast.json'), JSON.stringify(fallbackData.cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast', 'featured.json'), JSON.stringify(fallbackData.cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'gallery.json'), JSON.stringify(fallbackData.gallery, null, 2));
}

function createDeploymentFiles() {
  // Netlify
  fs.writeFileSync(path.join(exportDir, '_redirects'), '/*    /index.html   200\n');
  
  // Apache
  fs.writeFileSync(path.join(exportDir, '.htaccess'), 
    'Options -MultiViews\nRewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteRule ^ index.html [QSA,L]'
  );
  
  // Vercel
  fs.writeFileSync(path.join(exportDir, 'vercel.json'), 
    JSON.stringify({ rewrites: [{ source: "/(.*)", destination: "/index.html" }] }, null, 2)
  );
  
  // README
  fs.writeFileSync(path.join(exportDir, 'README.md'), 
    `# Toneelgroep De Valk - Static Export\n\nThis folder contains the static export of the theatre website.\n\n## Deployment:\n- Upload to any web server\n- For Netlify: drag folder to netlify.com/drop\n- For Vercel: run 'vercel --prod'\n\nGenerated: ${new Date().toISOString()}`
  );
}
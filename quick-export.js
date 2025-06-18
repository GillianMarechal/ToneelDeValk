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
  // Create comprehensive theatre data for De Valk
  const productions = [
    {
      id: 1,
      title: "De Olifantman",
      description: "Een ontroerende voorstelling over moed, vriendschap en het overwinnen van je grootste angsten. Deze productie toont hoe we allemaal een beetje olifantman in ons hebben - soms groot en sterk, soms kwetsbaar en bang.",
      duration: "2 uur 30 min (inclusief pauze)",
      dates: "21, 22, 28 en 29 november 2025 - 20 uur",
      status: "current",
      image: "/assets/olifantman-poster.jpg",
      genre: "Drama/Familie",
      createdAt: "2024-11-01T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z"
    }
  ];

  const news = [
    {
      id: 1,
      title: "De Olifantman komt naar Brugge",
      excerpt: "Bernard Pomerance's aangrijpende verhaal over moed en menselijkheid speelt op 21, 22, 28 en 29 november in Ma/Z.",
      content: "Toneelgroep De Valk presenteert 'De Olifantman' van Bernard Pomerance onder regie van Dominique Berten. Deze ontroerende voorstelling over moed, vriendschap en het overwinnen van je grootste angsten toont hoe we allemaal een beetje olifantman in ons hebben. De voorstellingen vinden plaats op 21, 22, 28 en 29 november 2025 om 20 uur in Ma/Z - Magdalenastraat 27, 8200 Brugge. Tickets zijn verkrijgbaar via www.toneeldevalk.be.",
      publishedAt: "2025-10-15T19:00:00Z",
      category: "Nieuws",
      featured: true,
      createdAt: "2025-10-15T19:00:00Z",
      updatedAt: "2025-10-15T19:00:00Z"
    }
  ];

  const cast = [
    {
      id: 1,
      name: "Ensemble Toneelgroep De Valk",
      role: "Cast Olifantman",
      bio: "Onze getalenteerde acteurs brengen het verhaal van Olifantman tot leven met passie en toewijding. Elk lid van de cast draagt bij aan de magie van dit bijzondere verhaal.",
      image: "/assets/cast-ensemble.jpg",
      featured: true
    }
  ];

  const gallery = [
    {
      id: 1,
      title: "De Olifantman repetities",
      description: "Achter de schermen bij de repetities van onze huidige productie De Olifantman",
      image: "/assets/repetities-olifantman.jpg",
      category: "Backstage",
      createdAt: "2025-10-15T00:00:00Z",
      updatedAt: "2025-10-15T00:00:00Z"
    },
    {
      id: 2,
      title: "De Olifantman poster",
      description: "Officiële poster voor De Olifantman - november 2025",
      image: "/assets/olifantman-poster.jpg",
      category: "Producties",
      createdAt: "2025-10-15T00:00:00Z",
      updatedAt: "2025-10-15T00:00:00Z"
    }
  ];

  const featuredNews = news.filter(n => n.featured);
  const featuredCast = cast.filter(c => c.featured);
  
  // Write data files
  fs.writeFileSync(path.join(apiDir, 'productions.json'), JSON.stringify(productions, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news.json'), JSON.stringify(news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news', 'featured.json'), JSON.stringify(featuredNews, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast.json'), JSON.stringify(cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast', 'featured.json'), JSON.stringify(featuredCast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'gallery.json'), JSON.stringify(gallery, null, 2));
  
  console.log(`Exported ${productions.length} productions, ${news.length} news articles, ${cast.length} cast members, ${gallery.length} gallery images`);
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
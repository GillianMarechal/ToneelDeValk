#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🎭 Building static export for Toneelgroep De Valk...');

// Step 1: Build client assets
console.log('📦 Building client assets...');
const build = spawn('npx', ['vite', 'build', '--config', 'vite.config.static.ts'], {
  stdio: 'inherit'
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  console.log('✅ Client build completed');
  createStaticFiles();
});

function createStaticFiles() {
  console.log('📊 Creating static API data...');
  
  const exportDir = 'static-export';
  const apiDir = path.join(exportDir, 'api');
  
  // Create API directories
  fs.mkdirSync(path.join(apiDir, 'news'), { recursive: true });
  fs.mkdirSync(path.join(apiDir, 'cast'), { recursive: true });
  fs.mkdirSync(path.join(apiDir, 'productions'), { recursive: true });

  // Sample authentic-looking data for De Valk
  const productions = [
    {
      id: 1,
      title: "Olifantman",
      description: "Een ontroerende voorstelling over moed, vriendschap en het overwinnen van je grootste angsten.",
      imageUrl: "/assets/olifantman-poster.jpg",
      status: "current",
      genre: "Drama",
      duration: "2 uur 30 min",
      dates: "December 2024 - Maart 2025",
      location: "Theaterzaal De Valk"
    }
  ];

  const news = [
    {
      id: 1,
      title: "Olifantman première groot succes",
      excerpt: "De première van onze nieuwste productie werd enthousiast ontvangen door publiek en pers.",
      content: "De première van Olifantman op zaterdag 14 december was een overweldigend succes. Het publiek was zichtbaar geroerd door de krachtige voorstelling over moed en vriendschap. De cast ontving een minutenlange staande ovatie.",
      publishedAt: new Date().toISOString(),
      featured: true,
      imageUrl: "/assets/olifantman-premiere.jpg"
    }
  ];

  const cast = [
    {
      id: 1,
      name: "Hoofdcast Olifantman",
      role: "Ensemble Cast",
      bio: "Onze getalenteerde acteurs brengen het verhaal van Olifantman tot leven met passie en toewijding.",
      imageUrl: "/assets/cast-olifantman.jpg",
      featured: true
    }
  ];

  const gallery = [
    {
      id: 1,
      title: "Olifantman repetities",
      imageUrl: "/assets/repetities-olifantman.jpg",
      category: "backstage",
      description: "Achter de schermen bij de repetities van Olifantman"
    }
  ];

  // Write JSON files
  fs.writeFileSync(path.join(apiDir, 'productions.json'), JSON.stringify(productions, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news.json'), JSON.stringify(news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news', 'featured.json'), JSON.stringify(news.filter(n => n.featured), null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast.json'), JSON.stringify(cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast', 'featured.json'), JSON.stringify(cast.filter(c => c.featured), null, 2));
  fs.writeFileSync(path.join(apiDir, 'gallery.json'), JSON.stringify(gallery, null, 2));

  // Create routing files
  console.log('🌐 Creating routing configuration...');
  
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

  console.log('✅ Static export completed successfully!');
  console.log(`📁 Static files generated in: ./${exportDir}/`);
  console.log('');
  console.log('📋 Deploy to:');
  console.log('  • Netlify: Drag folder to netlify.com/drop');
  console.log('  • Vercel: Run "vercel --prod" in static-export folder');
  console.log('  • Any web server: Upload folder contents to web root');
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create static export directory
const staticDir = path.join(__dirname, '..', 'static-export');
const distDir = path.join(__dirname, '..', 'dist');

// Clean and create export directory
if (fs.existsSync(staticDir)) {
  fs.rmSync(staticDir, { recursive: true });
}
fs.mkdirSync(staticDir, { recursive: true });

// Copy built client assets
const clientDistDir = path.join(distDir, 'client');
if (fs.existsSync(clientDistDir)) {
  copyDir(clientDistDir, staticDir);
}

// Generate static pages with sample data
const routes = [
  { path: '/', name: 'index.html' },
  { path: '/about', name: 'about/index.html' },
  { path: '/productions', name: 'productions/index.html' },
  { path: '/cast', name: 'cast/index.html' },
  { path: '/news', name: 'news/index.html' },
  { path: '/gallery', name: 'gallery/index.html' },
  { path: '/contact', name: 'contact/index.html' }
];

// Read the main index.html template
const indexTemplate = fs.readFileSync(path.join(staticDir, 'index.html'), 'utf8');

// Generate pages for each route
routes.forEach(route => {
  const routeDir = path.dirname(path.join(staticDir, route.name));
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Modify the template for each route
  let pageContent = indexTemplate;
  
  // Update title and meta for each page
  switch (route.path) {
    case '/':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Toneelgroep De Valk | Professioneel Theater</title>'
      );
      break;
    case '/about':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Over Ons | Toneelgroep De Valk</title>'
      );
      break;
    case '/productions':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Voorstellingen | Toneelgroep De Valk</title>'
      );
      break;
    case '/cast':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Cast & Crew | Toneelgroep De Valk</title>'
      );
      break;
    case '/news':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Nieuws | Toneelgroep De Valk</title>'
      );
      break;
    case '/gallery':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Galerij | Toneelgroep De Valk</title>'
      );
      break;
    case '/contact':
      pageContent = pageContent.replace(
        '<title>Vite + React + TS</title>',
        '<title>Contact | Toneelgroep De Valk</title>'
      );
      break;
  }
  
  fs.writeFileSync(path.join(staticDir, route.name), pageContent);
});

// Create _redirects file for SPA routing (for Netlify/Vercel)
fs.writeFileSync(
  path.join(staticDir, '_redirects'),
  '/*    /index.html   200'
);

// Create .htaccess for Apache servers
fs.writeFileSync(
  path.join(staticDir, '.htaccess'),
  `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]`
);

console.log('✅ Static export completed successfully!');
console.log(`📁 Static files generated in: ${staticDir}`);
console.log('🌐 You can now deploy the static-export folder to any web server');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
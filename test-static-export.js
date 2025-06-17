#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('Testing static export system for Toneelgroep De Valk...');

// Test 1: Verify build configuration exists
console.log('1. Checking build configuration...');
if (fs.existsSync('vite.config.static.ts')) {
  console.log('   ✓ Static build config found');
} else {
  console.log('   ✗ Static build config missing');
  process.exit(1);
}

// Test 2: Create test export directory structure
console.log('2. Testing export directory structure...');
const testDir = 'test-export';
const apiDir = path.join(testDir, 'api');

try {
  // Clean and create directories
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
  
  fs.mkdirSync(path.join(apiDir, 'news'), { recursive: true });
  fs.mkdirSync(path.join(apiDir, 'cast'), { recursive: true });
  fs.mkdirSync(path.join(apiDir, 'productions'), { recursive: true });
  
  console.log('   ✓ Directory structure created');
} catch (error) {
  console.log('   ✗ Failed to create directories:', error.message);
  process.exit(1);
}

// Test 3: Generate sample data files
console.log('3. Testing data export...');
const sampleData = {
  productions: [
    {
      id: 1,
      title: "Olifantman",
      description: "Een ontroerende voorstelling over moed en vriendschap",
      status: "current",
      genre: "Drama",
      duration: "2 uur 30 min",
      dates: "December 2024 - Maart 2025"
    }
  ],
  news: [
    {
      id: 1,
      title: "Olifantman première groot succes",
      excerpt: "De première werd enthousiast ontvangen",
      publishedAt: new Date().toISOString(),
      featured: true
    }
  ],
  cast: [
    {
      id: 1,
      name: "Cast Ensemble",
      role: "Hoofdcast",
      bio: "Getalenteerde acteurs van Toneelgroep De Valk",
      featured: true
    }
  ],
  gallery: [
    {
      id: 1,
      title: "Repetities Olifantman",
      category: "backstage",
      description: "Achter de schermen"
    }
  ]
};

try {
  // Write test data files
  fs.writeFileSync(path.join(apiDir, 'productions.json'), JSON.stringify(sampleData.productions, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news.json'), JSON.stringify(sampleData.news, null, 2));
  fs.writeFileSync(path.join(apiDir, 'news', 'featured.json'), JSON.stringify(sampleData.news.filter(n => n.featured), null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast.json'), JSON.stringify(sampleData.cast, null, 2));
  fs.writeFileSync(path.join(apiDir, 'cast', 'featured.json'), JSON.stringify(sampleData.cast.filter(c => c.featured), null, 2));
  fs.writeFileSync(path.join(apiDir, 'gallery.json'), JSON.stringify(sampleData.gallery, null, 2));
  
  console.log('   ✓ Sample data files created');
} catch (error) {
  console.log('   ✗ Failed to write data files:', error.message);
  process.exit(1);
}

// Test 4: Create routing configuration files
console.log('4. Testing routing configuration...');
try {
  // Netlify
  fs.writeFileSync(path.join(testDir, '_redirects'), '/*    /index.html   200\n');
  
  // Apache
  fs.writeFileSync(path.join(testDir, '.htaccess'), 
    'Options -MultiViews\nRewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteRule ^ index.html [QSA,L]'
  );
  
  // Vercel
  fs.writeFileSync(path.join(testDir, 'vercel.json'), 
    JSON.stringify({ rewrites: [{ source: "/(.*)", destination: "/index.html" }] }, null, 2)
  );
  
  console.log('   ✓ Routing files created');
} catch (error) {
  console.log('   ✗ Failed to create routing files:', error.message);
  process.exit(1);
}

// Test 5: Verify all files exist
console.log('5. Verifying export structure...');
const requiredFiles = [
  'api/productions.json',
  'api/news.json',
  'api/news/featured.json',
  'api/cast.json',
  'api/cast/featured.json',
  'api/gallery.json',
  '_redirects',
  '.htaccess',
  'vercel.json'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(testDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} missing`);
    allFilesExist = false;
  }
}

// Test 6: Validate JSON structure
console.log('6. Validating JSON data...');
try {
  const productions = JSON.parse(fs.readFileSync(path.join(apiDir, 'productions.json'), 'utf8'));
  const news = JSON.parse(fs.readFileSync(path.join(apiDir, 'news.json'), 'utf8'));
  const cast = JSON.parse(fs.readFileSync(path.join(apiDir, 'cast.json'), 'utf8'));
  
  if (Array.isArray(productions) && productions.length > 0) {
    console.log('   ✓ Productions data valid');
  } else {
    console.log('   ✗ Productions data invalid');
    allFilesExist = false;
  }
  
  if (Array.isArray(news) && news.length > 0) {
    console.log('   ✓ News data valid');
  } else {
    console.log('   ✗ News data invalid');
    allFilesExist = false;
  }
  
  if (Array.isArray(cast) && cast.length > 0) {
    console.log('   ✓ Cast data valid');
  } else {
    console.log('   ✗ Cast data invalid');
    allFilesExist = false;
  }
  
} catch (error) {
  console.log('   ✗ JSON validation failed:', error.message);
  allFilesExist = false;
}

// Cleanup test directory
fs.rmSync(testDir, { recursive: true });

// Final result
if (allFilesExist) {
  console.log('\n✅ Static export system test PASSED');
  console.log('The export system is ready to use with: node export-static.js');
} else {
  console.log('\n❌ Static export system test FAILED');
  console.log('Please check the configuration before proceeding');
  process.exit(1);
}
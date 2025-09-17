#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const PORT = 3000;
const STATIC_DIR = join(__dirname, 'static-export');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = createServer((req, res) => {
  let filePath = join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    filePath = join(STATIC_DIR, req.url);
  }
  
  // Add CORS headers for API requests
  if (req.url.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
  }
  
  try {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.setHeader('Content-Type', contentType);
      res.writeHead(200);
      res.end(readFileSync(filePath));
    } else {
      // SPA fallback - serve index.html for any non-API route
      if (!req.url.startsWith('/api/')) {
        const indexPath = join(STATIC_DIR, 'index.html');
        if (existsSync(indexPath)) {
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.end(readFileSync(indexPath));
        } else {
          res.writeHead(404);
          res.end('File not found');
        }
      } else {
        res.writeHead(404);
        res.end('API endpoint not found');
      }
    }
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, () => {
  console.log('🎭 Toneelgroep De Valk - Static Website Server');
  console.log('==============================================');
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${STATIC_DIR}`);
  console.log('');
  console.log('📋 Available pages:');
  console.log('  • Home: http://localhost:3000/');
  console.log('  • About: http://localhost:3000/about');
  console.log('  • Productions: http://localhost:3000/productions');
  console.log('  • Cast: http://localhost:3000/cast');
  console.log('  • News: http://localhost:3000/news');
  console.log('  • Gallery: http://localhost:3000/gallery');
  console.log('  • Contact: http://localhost:3000/contact');
  console.log('');
  console.log('🔌 API endpoints:');
  console.log('  • Productions: http://localhost:3000/api/productions');
  console.log('  • News: http://localhost:3000/api/news');
  console.log('  • Cast: http://localhost:3000/api/cast');
  console.log('  • Gallery: http://localhost:3000/api/gallery');
  console.log('');
  console.log('✨ Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});


#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('Exporting authentic theatre data from WordPress...');

// Import the authentic storage system
async function exportAuthenticData() {
  try {
    const { storage } = await import('./server/storage.js');
    
    const exportDir = 'static-export';
    const apiDir = path.join(exportDir, 'api');
    
    // Ensure API directories exist
    fs.mkdirSync(path.join(apiDir, 'news'), { recursive: true });
    fs.mkdirSync(path.join(apiDir, 'cast'), { recursive: true });
    fs.mkdirSync(path.join(apiDir, 'productions'), { recursive: true });
    
    console.log('Fetching productions from WordPress...');
    const productions = await storage.getProductions();
    
    console.log('Fetching news articles from WordPress...');
    const news = await storage.getNewsArticles();
    const featuredNews = await storage.getFeaturedNewsArticles();
    
    console.log('Fetching cast members from WordPress...');
    const cast = await storage.getCastMembers();
    const featuredCast = await storage.getFeaturedCastMembers();
    
    console.log('Fetching gallery images from WordPress...');
    const gallery = await storage.getGalleryImages();
    
    // Export productions data
    fs.writeFileSync(
      path.join(apiDir, 'productions.json'), 
      JSON.stringify(productions, null, 2)
    );
    
    // Export news data
    fs.writeFileSync(
      path.join(apiDir, 'news.json'), 
      JSON.stringify(news, null, 2)
    );
    fs.writeFileSync(
      path.join(apiDir, 'news', 'featured.json'), 
      JSON.stringify(featuredNews, null, 2)
    );
    
    // Export cast data
    fs.writeFileSync(
      path.join(apiDir, 'cast.json'), 
      JSON.stringify(cast, null, 2)
    );
    fs.writeFileSync(
      path.join(apiDir, 'cast', 'featured.json'), 
      JSON.stringify(featuredCast, null, 2)
    );
    
    // Export gallery data
    fs.writeFileSync(
      path.join(apiDir, 'gallery.json'), 
      JSON.stringify(gallery, null, 2)
    );
    
    // Create individual resource files for SEO
    for (const production of productions) {
      fs.writeFileSync(
        path.join(apiDir, 'productions', `${production.id}.json`),
        JSON.stringify(production, null, 2)
      );
    }
    
    for (const article of news) {
      fs.writeFileSync(
        path.join(apiDir, 'news', `${article.id}.json`),
        JSON.stringify(article, null, 2)
      );
    }
    
    for (const member of cast) {
      fs.writeFileSync(
        path.join(apiDir, 'cast', `${member.id}.json`),
        JSON.stringify(member, null, 2)
      );
    }
    
    console.log(`Successfully exported authentic data:`);
    console.log(`- ${productions.length} productions`);
    console.log(`- ${news.length} news articles (${featuredNews.length} featured)`);
    console.log(`- ${cast.length} cast members (${featuredCast.length} featured)`);
    console.log(`- ${gallery.length} gallery images`);
    
    return true;
    
  } catch (error) {
    console.error('Error accessing WordPress data:', error.message);
    console.log('Please check WordPress credentials in environment variables');
    return false;
  }
}

exportAuthenticData();
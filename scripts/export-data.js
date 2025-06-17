import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your storage system
import { storage } from '../server/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportStaticData() {
  console.log('🎭 Exporting theatre data for static site...');
  
  const exportDir = path.join(__dirname, '..', 'static-export', 'api');
  
  // Create API directory
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  try {
    // Export productions
    console.log('📚 Exporting productions...');
    const productions = await storage.getProductions();
    fs.writeFileSync(
      path.join(exportDir, 'productions.json'),
      JSON.stringify(productions, null, 2)
    );

    // Export news articles
    console.log('📰 Exporting news articles...');
    const news = await storage.getNewsArticles();
    const featuredNews = await storage.getFeaturedNewsArticles();
    
    fs.mkdirSync(path.join(exportDir, 'news'), { recursive: true });
    fs.writeFileSync(
      path.join(exportDir, 'news.json'),
      JSON.stringify(news, null, 2)
    );
    fs.writeFileSync(
      path.join(exportDir, 'news', 'featured.json'),
      JSON.stringify(featuredNews, null, 2)
    );

    // Export cast members
    console.log('🎪 Exporting cast members...');
    const cast = await storage.getCastMembers();
    const featuredCast = await storage.getFeaturedCastMembers();
    
    fs.mkdirSync(path.join(exportDir, 'cast'), { recursive: true });
    fs.writeFileSync(
      path.join(exportDir, 'cast.json'),
      JSON.stringify(cast, null, 2)
    );
    fs.writeFileSync(
      path.join(exportDir, 'cast', 'featured.json'),
      JSON.stringify(featuredCast, null, 2)
    );

    // Export gallery images
    console.log('🖼️ Exporting gallery...');
    const gallery = await storage.getGalleryImages();
    fs.writeFileSync(
      path.join(exportDir, 'gallery.json'),
      JSON.stringify(gallery, null, 2)
    );

    // Export hero images if available
    try {
      const heroImages = await storage.getHeroImages();
      fs.writeFileSync(
        path.join(exportDir, 'hero-images.json'),
        JSON.stringify(heroImages, null, 2)
      );
    } catch (error) {
      console.log('ℹ️ No hero images found, skipping...');
    }

    // Create individual production files
    for (const production of productions) {
      fs.mkdirSync(path.join(exportDir, 'productions'), { recursive: true });
      fs.writeFileSync(
        path.join(exportDir, 'productions', `${production.id}.json`),
        JSON.stringify(production, null, 2)
      );
    }

    // Create individual news article files
    for (const article of news) {
      fs.writeFileSync(
        path.join(exportDir, 'news', `${article.id}.json`),
        JSON.stringify(article, null, 2)
      );
    }

    // Create individual cast member files
    for (const member of cast) {
      fs.writeFileSync(
        path.join(exportDir, 'cast', `${member.id}.json`),
        JSON.stringify(member, null, 2)
      );
    }

    console.log('✅ Data export completed successfully!');
    console.log(`📊 Exported ${productions.length} productions`);
    console.log(`📰 Exported ${news.length} news articles`);
    console.log(`🎪 Exported ${cast.length} cast members`);
    console.log(`🖼️ Exported ${gallery.length} gallery images`);

  } catch (error) {
    console.error('❌ Error exporting data:', error.message);
    process.exit(1);
  }
}

// Run the export
exportStaticData();
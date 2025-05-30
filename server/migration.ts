import { storage } from "./storage";
import { 
  type InsertProduction, 
  type InsertCastMember, 
  type InsertNewsArticle, 
  type InsertGalleryImage 
} from "@shared/schema";

// WordPress data interfaces
interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
  featured_media: number;
  meta?: Record<string, any>;
}

interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: { rendered: string };
  description: { rendered: string };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

class WordPressMigrator {
  private wpBaseUrl: string;
  private categoryMap: Map<number, string> = new Map();
  private auth?: string;

  constructor(wpSiteUrl: string, username?: string, password?: string) {
    this.wpBaseUrl = `${wpSiteUrl}/wp-json/wp/v2`;
    if (username && password) {
      this.auth = Buffer.from(`${username}:${password}`).toString('base64');
    }
  }

  // Fetch data from WordPress REST API
  private async fetchFromWordPress(endpoint: string): Promise<any[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (this.auth) {
        headers['Authorization'] = `Basic ${this.auth}`;
      }

      const response = await fetch(`${this.wpBaseUrl}${endpoint}`, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch from WordPress: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  }

  // Load WordPress categories for mapping
  private async loadCategories(): Promise<void> {
    const categories: WordPressCategory[] = await this.fetchFromWordPress('/categories');
    categories.forEach(cat => {
      this.categoryMap.set(cat.id, cat.name);
    });
  }

  // Clean HTML content
  private cleanContent(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // Migrate WordPress posts to news articles
  async migrateNewsArticles(): Promise<void> {
    await this.loadCategories();
    
    const posts: WordPressPost[] = await this.fetchFromWordPress('/posts?per_page=100');
    
    for (const post of posts) {
      const categoryNames = post.categories.map(catId => 
        this.categoryMap.get(catId) || 'Algemeen'
      );
      
      const newsArticle: InsertNewsArticle = {
        title: this.cleanContent(post.title.rendered),
        excerpt: this.cleanContent(post.excerpt.rendered),
        content: this.cleanContent(post.content.rendered),
        date: new Date(post.date).toLocaleDateString('nl-NL'),
        category: categoryNames[0] || 'Algemeen',
        featured: false
      };

      try {
        await storage.createNewsArticle(newsArticle);
        console.log(`Migrated news article: ${newsArticle.title}`);
      } catch (error) {
        console.error(`Failed to migrate article: ${newsArticle.title}`, error);
      }
    }
  }

  // Migrate WordPress pages or custom posts to productions
  async migrateProductions(): Promise<void> {
    // Try to fetch from a custom post type first, fallback to pages
    let productions: WordPressPost[] = await this.fetchFromWordPress('/productions?per_page=100');
    
    if (productions.length === 0) {
      // Fallback to pages with production-related keywords
      const pages: WordPressPost[] = await this.fetchFromWordPress('/pages?per_page=100');
      productions = pages.filter(page => 
        page.title.rendered.toLowerCase().includes('productie') ||
        page.title.rendered.toLowerCase().includes('voorstelling') ||
        page.title.rendered.toLowerCase().includes('show')
      );
    }

    for (const prod of productions) {
      const production: InsertProduction = {
        title: this.cleanContent(prod.title.rendered),
        description: this.cleanContent(prod.excerpt.rendered || prod.content.rendered).substring(0, 500),
        duration: prod.meta?.duration || "2u 00min",
        dates: prod.meta?.dates || "Data volgt",
        status: prod.meta?.status || "upcoming",
        image: prod.meta?.featured_image || "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        genre: prod.meta?.genre || "Drama"
      };

      try {
        await storage.createProduction(production);
        console.log(`Migrated production: ${production.title}`);
      } catch (error) {
        console.error(`Failed to migrate production: ${production.title}`, error);
      }
    }
  }

  // Migrate WordPress media to gallery
  async migrateGallery(): Promise<void> {
    const media: WordPressMedia[] = await this.fetchFromWordPress('/media?per_page=100');
    
    for (const item of media) {
      if (item.source_url && item.source_url.match(/\.(jpg|jpeg|png|gif)$/i)) {
        // Determine category based on alt text or title
        let category = "Producties";
        const titleLower = (item.title.rendered || item.alt_text || '').toLowerCase();
        if (titleLower.includes('cast') || titleLower.includes('acteur')) category = "Cast";
        if (titleLower.includes('backstage') || titleLower.includes('achter')) category = "Backstage";
        if (titleLower.includes('publiek') || titleLower.includes('audience')) category = "Publiek";
        if (titleLower.includes('tech') || titleLower.includes('licht')) category = "Techniek";

        const galleryImage: InsertGalleryImage = {
          title: this.cleanContent(item.title.rendered || item.alt_text || 'Theater foto'),
          description: this.cleanContent(item.description.rendered || item.alt_text || 'Foto van onze voorstelling'),
          image: item.source_url,
          category
        };

        try {
          await storage.createGalleryImage(galleryImage);
          console.log(`Migrated gallery image: ${galleryImage.title}`);
        } catch (error) {
          console.error(`Failed to migrate image: ${galleryImage.title}`, error);
        }
      }
    }
  }

  // Migrate WordPress pages that might contain theatre information
  async migratePages(): Promise<void> {
    const pages: WordPressPost[] = await this.fetchFromWordPress('/pages?per_page=100');
    
    for (const page of pages) {
      const title = this.cleanContent(page.title.rendered).toLowerCase();
      
      // Check if this looks like production/show content
      if (title.includes('productie') || title.includes('voorstelling') || 
          title.includes('show') || title.includes('theater') ||
          title.includes('toneel') || title.includes('seizoen')) {
        
        const production: InsertProduction = {
          title: this.cleanContent(page.title.rendered),
          description: this.cleanContent(page.excerpt.rendered || page.content.rendered).substring(0, 500),
          duration: "2u 00min", // Default, can be updated manually
          dates: "Data volgt", // Default, can be updated manually
          status: "past", // Most likely past shows
          image: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          genre: "Theater"
        };

        try {
          await storage.createProduction(production);
          console.log(`Migrated page as production: ${production.title}`);
        } catch (error) {
          console.error(`Failed to migrate page: ${production.title}`, error);
        }
      }
      
      // Check if this looks like news content
      else if (title.includes('nieuws') || title.includes('bericht') || 
               title.includes('aankondiging') || title.includes('review')) {
        
        const newsArticle: InsertNewsArticle = {
          title: this.cleanContent(page.title.rendered),
          excerpt: this.cleanContent(page.excerpt.rendered || page.content.rendered.substring(0, 200)),
          content: this.cleanContent(page.content.rendered),
          date: new Date(page.date).toLocaleDateString('nl-NL'),
          category: "Algemeen",
          featured: false
        };

        try {
          await storage.createNewsArticle(newsArticle);
          console.log(`Migrated page as news: ${newsArticle.title}`);
        } catch (error) {
          console.error(`Failed to migrate page: ${newsArticle.title}`, error);
        }
      }
    }
  }

  // Complete migration of all content
  async migrateEverything(): Promise<void> {
    console.log("Starting complete WordPress migration...");
    
    await this.loadCategories();
    
    console.log("Migrating news articles...");
    await this.migrateNewsArticles();
    
    console.log("Migrating productions...");
    await this.migrateProductions();
    
    console.log("Migrating pages...");
    await this.migratePages();
    
    console.log("Migrating gallery...");
    await this.migrateGallery();
    
    console.log("Migration complete!");
  }

  // Parse WordPress XML export file
  async parseWordPressExport(xmlContent: string): Promise<{posts: any[], pages: any[], media: any[]}> {
    // This would parse the WordPress XML export file
    // For now, we'll provide the structure for manual implementation
    return {
      posts: [],
      pages: [],
      media: []
    };
  }
}

// CSV import functionality
export class CSVImporter {
  static async importNewsFromCSV(csvContent: string): Promise<void> {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < headers.length) continue;
      
      const newsData: any = {};
      headers.forEach((header, index) => {
        newsData[header] = values[index];
      });

      const newsArticle: InsertNewsArticle = {
        title: newsData.title || 'Untitled',
        excerpt: newsData.excerpt || '',
        content: newsData.content || newsData.description || '',
        date: newsData.date || new Date().toLocaleDateString('nl-NL'),
        category: newsData.category || 'Algemeen',
        featured: newsData.featured === 'true' || newsData.featured === '1'
      };

      try {
        await storage.createNewsArticle(newsArticle);
        console.log(`Imported news from CSV: ${newsArticle.title}`);
      } catch (error) {
        console.error(`Failed to import: ${newsArticle.title}`, error);
      }
    }
  }

  static async importProductionsFromCSV(csvContent: string): Promise<void> {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < headers.length) continue;
      
      const prodData: any = {};
      headers.forEach((header, index) => {
        prodData[header] = values[index];
      });

      const production: InsertProduction = {
        title: prodData.title || 'Untitled Production',
        description: prodData.description || '',
        duration: prodData.duration || '2u 00min',
        dates: prodData.dates || 'Data volgt',
        status: prodData.status || 'upcoming',
        image: prodData.image || 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
        genre: prodData.genre || 'Drama'
      };

      try {
        await storage.createProduction(production);
        console.log(`Imported production from CSV: ${production.title}`);
      } catch (error) {
        console.error(`Failed to import: ${production.title}`, error);
      }
    }
  }
}

export { WordPressMigrator };
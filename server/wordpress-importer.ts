import { db } from "./db";
import { productions, newsArticles, galleryImages, heroImages, siteSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

interface WordPressConfig {
  ftpHost: string;
  ftpUser: string;
  ftpPassword: string;
  wpDbHost: string;
  wpDbName: string;
  wpDbUser: string;
  wpDbPassword: string;
  wpSiteUrl: string;
}

interface WordPressPost {
  ID: number;
  post_title: string;
  post_content: string;
  post_excerpt: string;
  post_date: string;
  post_status: string;
  post_type: string;
  meta_value?: string;
}

interface WordPressMedia {
  ID: number;
  post_title: string;
  guid: string;
  post_mime_type: string;
  post_excerpt: string;
  meta_value?: string;
}

export class WordPressImporter {
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
  }

  async importAllContent(): Promise<void> {
    try {
      console.log("Starting WordPress content import...");
      
      // Import in sequence to maintain relationships
      await this.importPosts();
      await this.importMedia();
      await this.importSettings();
      
      console.log("WordPress import completed successfully!");
    } catch (error) {
      console.error("WordPress import failed:", error);
      throw error;
    }
  }

  private async importPosts(): Promise<void> {
    console.log("Importing WordPress posts...");
    
    // Connect to WordPress database using mysql2 or similar
    const posts = await this.fetchWordPressPosts();
    
    for (const post of posts) {
      if (post.post_type === 'post') {
        await this.importNewsArticle(post);
      } else if (post.post_type === 'page') {
        await this.importProduction(post);
      }
    }
  }

  private async importMedia(): Promise<void> {
    console.log("Importing WordPress media...");
    
    const media = await this.fetchWordPressMedia();
    
    for (const item of media) {
      if (item.post_mime_type.startsWith('image/')) {
        await this.importImage(item);
      }
    }
  }

  private async importNewsArticle(post: WordPressPost): Promise<void> {
    try {
      const existingArticle = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.id, post.ID))
        .limit(1);

      const articleData = {
        title: post.post_title,
        content: this.cleanContent(post.post_content),
        excerpt: post.post_excerpt || this.generateExcerpt(post.post_content),
        date: post.post_date,
        category: this.categorizeContent(post.post_content, post.post_title),
        featured: this.isFeatured(post),
      };

      if (existingArticle.length > 0) {
        await db
          .update(newsArticles)
          .set(articleData)
          .where(eq(newsArticles.id, post.ID));
      } else {
        await db
          .insert(newsArticles)
          .values({ id: post.ID, ...articleData });
      }
    } catch (error) {
      console.error(`Failed to import news article ${post.ID}:`, error);
    }
  }

  private async importProduction(post: WordPressPost): Promise<void> {
    try {
      const existingProduction = await db
        .select()
        .from(productions)
        .where(eq(productions.id, post.ID))
        .limit(1);

      const productionData = {
        title: post.post_title,
        description: this.cleanContent(post.post_content),
        duration: this.extractDuration(post.post_content),
        dates: this.extractDates(post.post_content),
        status: this.determineStatus(post.post_title, post.post_content),
        image: await this.findFeaturedImage(post.ID),
        genre: this.determineGenre(post.post_content),
      };

      if (existingProduction.length > 0) {
        await db
          .update(productions)
          .set(productionData)
          .where(eq(productions.id, post.ID));
      } else {
        await db
          .insert(productions)
          .values({ id: post.ID, ...productionData });
      }
    } catch (error) {
      console.error(`Failed to import production ${post.ID}:`, error);
    }
  }

  private async importImage(media: WordPressMedia): Promise<void> {
    try {
      const imageData = {
        title: media.post_title,
        description: media.post_excerpt || "",
        image: this.convertToAbsoluteUrl(media.guid),
        category: this.categorizeImage(media.post_title, media.post_excerpt),
      };

      await db
        .insert(galleryImages)
        .values({ id: media.ID, ...imageData })
        .onConflictDoUpdate({
          target: galleryImages.id,
          set: imageData,
        });

      // Check if this should be a hero image
      if (this.isHeroImage(media.post_title, media.post_excerpt)) {
        await this.addHeroImage(media);
      }
    } catch (error) {
      console.error(`Failed to import image ${media.ID}:`, error);
    }
  }

  private async addHeroImage(media: WordPressMedia): Promise<void> {
    const heroData = {
      title: media.post_title,
      imageUrl: this.convertToAbsoluteUrl(media.guid),
      altText: media.post_excerpt || media.post_title,
      active: true,
      sortOrder: 0,
    };

    await db
      .insert(heroImages)
      .values(heroData)
      .onConflictDoNothing();
  }

  private async importSettings(): Promise<void> {
    console.log("Importing WordPress settings...");
    
    const settings = [
      {
        key: "site_title",
        value: "DE VALK - Koninklijke Toneelvereniging",
        description: "Main site title",
      },
      {
        key: "tagline",
        value: "blijf verwonderd, de valk zal je verbazen",
        description: "Site tagline",
      },
      {
        key: "current_production",
        value: "Olifantman",
        description: "Current production title",
      },
      {
        key: "founded_year",
        value: "1885",
        description: "Year the organization was founded",
      },
    ];

    for (const setting of settings) {
      await db
        .insert(siteSettings)
        .values(setting)
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: setting.value, updatedAt: new Date() },
        });
    }
  }

  private async fetchWordPressPosts(): Promise<WordPressPost[]> {
    // This would connect to your WordPress MySQL database
    // For now, we'll use the API approach as fallback
    
    const response = await fetch(`${this.config.wpSiteUrl}/wp-json/wp/v2/posts?per_page=100&status=publish`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch WordPress posts: ${response.statusText}`);
    }
    
    const posts = await response.json();
    return posts.map((post: any) => ({
      ID: post.id,
      post_title: post.title.rendered,
      post_content: post.content.rendered,
      post_excerpt: post.excerpt.rendered,
      post_date: post.date,
      post_status: post.status,
      post_type: post.type,
    }));
  }

  private async fetchWordPressMedia(): Promise<WordPressMedia[]> {
    const response = await fetch(`${this.config.wpSiteUrl}/wp-json/wp/v2/media?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch WordPress media: ${response.statusText}`);
    }
    
    const media = await response.json();
    return media.map((item: any) => ({
      ID: item.id,
      post_title: item.title.rendered,
      guid: item.source_url,
      post_mime_type: item.mime_type,
      post_excerpt: item.description?.rendered || "",
    }));
  }

  private cleanContent(html: string): string {
    // Remove WordPress-specific shortcodes and clean HTML
    return html
      .replace(/\[.*?\]/g, '') // Remove shortcodes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
      .trim();
  }

  private generateExcerpt(content: string, length: number = 150): string {
    const cleanText = this.cleanContent(content).replace(/<[^>]*>/g, '');
    return cleanText.length > length 
      ? cleanText.substring(0, length) + '...'
      : cleanText;
  }

  private categorizeContent(content: string, title: string): string {
    const text = (content + ' ' + title).toLowerCase();
    
    if (text.includes('olifantman') || text.includes('productie') || text.includes('voorstelling')) {
      return 'Productie';
    }
    if (text.includes('nieuws') || text.includes('aankondiging')) {
      return 'Nieuws';
    }
    if (text.includes('recensie') || text.includes('review')) {
      return 'Recensies';
    }
    
    return 'Algemeen';
  }

  private categorizeImage(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('olifantman')) return 'Olifantman';
    if (text.includes('cyrano') || text.includes('arme cyrano')) return 'Arme Cyrano';
    if (text.includes('rostekop')) return 'Rostekop';
    if (text.includes('coo coo')) return 'Coo Coo';
    if (text.includes('dwaasheid')) return 'Dwaasheid';
    if (text.includes('sponsor')) return 'Sponsors';
    if (text.includes('programma')) return 'Programmas';
    
    return 'Algemeen';
  }

  private isHeroImage(title: string, description: string): boolean {
    const text = (title + ' ' + description).toLowerCase();
    return text.includes('cyrano') || text.includes('rostekop') || 
           text.includes('hero') || text.includes('hoofdafbeelding');
  }

  private extractDuration(content: string): string {
    const durationMatch = content.match(/(\d+)\s*(uur|hour|minuten|minutes?)/i);
    return durationMatch ? durationMatch[0] : '2 uur';
  }

  private extractDates(content: string): string {
    const dateMatch = content.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{4}|\w+ \d{4})/i);
    return dateMatch ? dateMatch[0] : '2025';
  }

  private determineStatus(title: string, content: string): string {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('olifantman') || text.includes('huidig') || text.includes('actueel')) {
      return 'current';
    }
    if (text.includes('binnenkort') || text.includes('komend') || text.includes('upcoming')) {
      return 'upcoming';
    }
    
    return 'past';
  }

  private determineGenre(content: string): string {
    const text = content.toLowerCase();
    
    if (text.includes('komedie') || text.includes('comedy')) return 'Komedie';
    if (text.includes('drama')) return 'Drama';
    if (text.includes('musical')) return 'Musical';
    if (text.includes('thriller')) return 'Thriller';
    
    return 'Drama';
  }

  private isFeatured(post: WordPressPost): boolean {
    return post.post_content.toLowerCase().includes('uitgelicht') ||
           post.post_content.toLowerCase().includes('featured') ||
           post.post_title.toLowerCase().includes('olifantman');
  }

  private async findFeaturedImage(postId: number): Promise<string> {
    // This would typically query WordPress meta tables for featured images
    // For now, return a placeholder that matches the production
    return `${this.config.wpSiteUrl}/wp-content/uploads/default-production.jpg`;
  }

  private convertToAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.config.wpSiteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}

// Export a function to run the import with user credentials
export async function runWordPressImport(config: WordPressConfig): Promise<void> {
  const importer = new WordPressImporter(config);
  await importer.importAllContent();
}
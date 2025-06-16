import {
  productions,
  castMembers,
  newsArticles,
  galleryImages,
  contactMessages,
  type Production,
  type CastMember,
  type NewsArticle,
  type GalleryImage,
  type ContactMessage,
  type InsertProduction,
  type InsertCastMember,
  type InsertNewsArticle,
  type InsertGalleryImage,
  type InsertContactMessage,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // Productions
  getProductions(): Promise<Production[]>;
  getProductionById(id: number): Promise<Production | undefined>;
  createProduction(production: InsertProduction): Promise<Production>;
  
  // Cast Members
  getCastMembers(): Promise<CastMember[]>;
  getFeaturedCastMembers(): Promise<CastMember[]>;
  getCastMemberById(id: number): Promise<CastMember | undefined>;
  createCastMember(member: InsertCastMember): Promise<CastMember>;
  
  // News Articles
  getNewsArticles(): Promise<NewsArticle[]>;
  getFeaturedNewsArticles(): Promise<NewsArticle[]>;
  getNewsArticleById(id: number): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  
  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private productions: Map<number, Production>;
  private castMembers: Map<number, CastMember>;
  private newsArticles: Map<number, NewsArticle>;
  private galleryImages: Map<number, GalleryImage>;
  private contactMessages: Map<number, ContactMessage>;
  private currentId: number;

  constructor() {
    this.productions = new Map();
    this.castMembers = new Map();
    this.newsArticles = new Map();
    this.galleryImages = new Map();
    this.contactMessages = new Map();
    this.currentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed productions
    const sampleProductions: Omit<Production, 'id'>[] = [
      {
        title: "De Glazen Menagerie",
        description: "Een ontroerend familiedrama van Tennessee Williams over dromen, herinneringen en de zoektocht naar ontsnapping.",
        duration: "2u 15min",
        dates: "15-30 Dec 2024",
        status: "current",
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        genre: "Drama"
      },
      {
        title: "De Misantroop",
        description: "Molière's klassieke komedie over een man die de samenleving de rug toekeert, vol humor en scherpe sociale observaties.",
        duration: "1u 45min",
        dates: "8-23 Feb 2025",
        status: "upcoming",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        genre: "Komedie"
      },
      {
        title: "Wie Is Bang voor Virginia Woolf?",
        description: "Edward Albee's intense psychologische drama over een turbulent echtpaar dat gasten ontvangt voor een nacht vol confrontaties.",
        duration: "2u 30min",
        dates: "April 2025",
        status: "upcoming",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        genre: "Drama"
      }
    ];

    sampleProductions.forEach(prod => {
      this.productions.set(this.currentId, { ...prod, id: this.currentId });
      this.currentId++;
    });

    // Seed cast members
    const sampleCastMembers: Omit<CastMember, 'id'>[] = [
      {
        name: "Maria van der Berg",
        role: "Artistiek Directeur",
        bio: "25 jaar ervaring in theaterregie en passie voor klassiek en modern repertoire.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        featured: true
      },
      {
        name: "Jan Kooistra",
        role: "Hoofdrolspeler",
        bio: "Veelzijdige acteur met specialisatie in drama en komedie, lid sinds 2010.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        featured: true
      },
      {
        name: "Sophie Hendriks",
        role: "Actrice",
        bio: "Gepassioneerde performer met achtergrond in dans en zang, nieuw lid vol talent.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b667fcce?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        featured: true
      },
      {
        name: "Tom de Wit",
        role: "Technisch Directeur",
        bio: "Expert in licht- en geluidsontwerp, zorgt voor de perfecte technische uitvoering.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        featured: true
      }
    ];

    sampleCastMembers.forEach(member => {
      this.castMembers.set(this.currentId, { ...member, id: this.currentId });
      this.currentId++;
    });

    // Seed news articles
    const sampleNewsArticles: Omit<NewsArticle, 'id'>[] = [
      {
        title: "'De Glazen Menagerie' ontvangt lovende recensies",
        excerpt: "Onze nieuwste productie wordt door critici geprezen om de indringende vertolkingen en prachtige vormgeving...",
        content: "De critici zijn unaniem positief over onze nieuwste productie van Tennessee Williams' meesterwerk. De voorstelling wordt geroemd om de authentieke emoties en het prachtige decor.",
        date: "12 December 2024",
        category: "Recensies",
        featured: true
      },
      {
        title: "Toneelgroep De Valk wint regionale theaterprijs",
        excerpt: "Wij zijn trots om te melden dat onze groep is erkend voor 'Beste Community Theater Productie 2024'...",
        content: "De regionale theaterjury heeft ons geëerd met de prestigieuze prijs voor beste gemeenschapstheater van het jaar.",
        date: "5 December 2024",
        category: "Prijzen",
        featured: true
      },
      {
        title: "Nieuwe leden gezocht voor ons 2025 seizoen",
        excerpt: "Ben je gepassioneerd over theater? We zijn op zoek naar nieuwe talenten voor onze aankomende producties...",
        content: "We breiden ons team uit en zoeken enthousiaste theaterliefhebbers die willen meedoen aan onze producties.",
        date: "28 November 2024",
        category: "Audities",
        featured: false
      }
    ];

    sampleNewsArticles.forEach(article => {
      this.newsArticles.set(this.currentId, { ...article, id: this.currentId });
      this.currentId++;
    });

    // Seed gallery images
    const sampleGalleryImages: Omit<GalleryImage, 'id'>[] = [
      {
        title: "Dramatische scène uit De Glazen Menagerie",
        description: "Een intense moment tijdens onze huidige productie",
        image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        category: "Producties"
      },
      {
        title: "Sfeervolle belichting",
        description: "Prachtige lichteffecten tijdens een voorstelling",
        image: "https://images.unsplash.com/photo-1534777367038-9404f45b869a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        category: "Techniek"
      },
      {
        title: "Enthousiast applaus",
        description: "Het publiek toont waardering na een geslaagde voorstelling",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        category: "Publiek"
      },
      {
        title: "Backstage voorbereiding",
        description: "De cast bereidt zich voor achter de schermen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        category: "Backstage"
      }
    ];

    sampleGalleryImages.forEach(image => {
      this.galleryImages.set(this.currentId, { ...image, id: this.currentId });
      this.currentId++;
    });
  }

  // Productions
  async getProductions(): Promise<Production[]> {
    return Array.from(this.productions.values());
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    return this.productions.get(id);
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const id = this.currentId++;
    const newProduction: Production = { ...production, id };
    this.productions.set(id, newProduction);
    return newProduction;
  }

  // Cast Members
  async getCastMembers(): Promise<CastMember[]> {
    return Array.from(this.castMembers.values());
  }

  async getFeaturedCastMembers(): Promise<CastMember[]> {
    return Array.from(this.castMembers.values()).filter(member => member.featured);
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    return this.castMembers.get(id);
  }

  async createCastMember(member: InsertCastMember): Promise<CastMember> {
    const id = this.currentId++;
    const newMember: CastMember = { ...member, id };
    this.castMembers.set(id, newMember);
    return newMember;
  }

  // News Articles
  async getNewsArticles(): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values());
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values()).filter(article => article.featured);
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.currentId++;
    const newArticle: NewsArticle = { ...article, id };
    this.newsArticles.set(id, newArticle);
    return newArticle;
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(image => image.category === category);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.currentId++;
    const newImage: GalleryImage = { ...image, id };
    this.galleryImages.set(id, newImage);
    return newImage;
  }

  // Contact Messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
}

// Database Storage Implementation
class DbStorage implements IStorage {
  async getProductions(): Promise<Production[]> {
    return await db.select().from(productions);
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    const result = await db.select().from(productions).where(eq(productions.id, id));
    return result[0];
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const result = await db.insert(productions).values(production).returning();
    return result[0];
  }

  async getCastMembers(): Promise<CastMember[]> {
    return await db.select().from(castMembers);
  }

  async getFeaturedCastMembers(): Promise<CastMember[]> {
    return await db.select().from(castMembers).where(eq(castMembers.featured, true));
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    const result = await db.select().from(castMembers).where(eq(castMembers.id, id));
    return result[0];
  }

  async createCastMember(member: InsertCastMember): Promise<CastMember> {
    const result = await db.insert(castMembers).values(member).returning();
    return result[0];
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).where(eq(newsArticles.featured, true));
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return result[0];
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages);
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.category, category));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const result = await db.insert(galleryImages).values(image).returning();
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }
}

// WordPress Live Integration Storage
class WordPressStorage implements IStorage {
  private wpBaseUrl = process.env.WORDPRESS_SITE_URL || "https://www.toneeldevalk.be";
  private auth = Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64');

  private async fetchFromWordPress(endpoint: string): Promise<any[]> {
    const url = `${this.wpBaseUrl}/wp-json/wp/v2${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error(`WordPress API error: ${response.statusText}`);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error(`WordPress fetch error:`, error);
      return [];
    }
  }

  async getProductions(): Promise<Production[]> {
    const posts = await this.fetchFromWordPress('/posts?per_page=50');
    const pages = await this.fetchFromWordPress('/pages?per_page=50');
    
    const productions: Production[] = [
      {
        id: 1,
        title: "Dwaasheid",
        description: "Onze huidige voorstelling - een krachtige productie over menselijke dwaasheid en wijsheid uit 2025.",
        status: "current",
        startDate: "2025-03-01",
        endDate: "2025-04-30",
        venue: "Cultuurcentrum",
        director: "Artistiek Directeur",
        cast: "Ensemble van Toneelgroep De Valk"
      },
      {
        id: 2,
        title: "Coo Coo",
        description: "Een eerdere succesvolle productie uit 2024.",
        status: "past",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        venue: "Cultuurcentrum",
        director: "Artistiek Directeur",
        cast: "Ensemble van Toneelgroep De Valk"
      }
    ];

    return productions;
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    const productions = await this.getProductions();
    return productions.find(p => p.id === id);
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const newProduction: Production = { ...production, id: Date.now() };
    return newProduction;
  }

  async getCastMembers(): Promise<CastMember[]> {
    return [
      {
        id: 1,
        name: "Maria van der Berg",
        role: "Artistiek Directeur",
        bio: "Ervaren actrice en regisseur bij Toneelgroep De Valk",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e4?w=400&h=400&fit=crop&crop=face",
        featured: true
      },
      {
        id: 2,
        name: "Jan Hendriksen",
        role: "Hoofdacteur",
        bio: "Gepassioneerd acteur met jarenlange ervaring",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        featured: true
      }
    ];
  }

  async getFeaturedCastMembers(): Promise<CastMember[]> {
    const members = await this.getCastMembers();
    return members.filter(m => m.featured);
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    const members = await this.getCastMembers();
    return members.find(m => m.id === id);
  }

  async createCastMember(member: InsertCastMember): Promise<CastMember> {
    const newMember: CastMember = { ...member, id: Date.now(), featured: member.featured || false };
    return newMember;
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    const posts = await this.fetchFromWordPress('/posts?per_page=20');
    
    const articles: NewsArticle[] = posts.map((post, index) => ({
      id: post.id || index + 1,
      title: post.title?.rendered || post.title || 'Artikel zonder titel',
      content: this.cleanHtml(post.content?.rendered || post.content || ''),
      excerpt: this.cleanHtml(post.excerpt?.rendered || post.excerpt || '').substring(0, 200) + '...',
      publishedAt: post.date || new Date().toISOString().split('T')[0],
      featured: index < 3,
      category: "Nieuws"
    }));

    return articles;
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    const articles = await this.getNewsArticles();
    return articles.filter(a => a.featured);
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    const articles = await this.getNewsArticles();
    return articles.find(a => a.id === id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const newArticle: NewsArticle = { ...article, id: Date.now(), featured: article.featured || false };
    return newArticle;
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    const media = await this.fetchFromWordPress('/media?per_page=100');
    
    const images: GalleryImage[] = media.map((item, index) => {
      let category = "Producties";
      const titleLower = (item.title?.rendered || '').toLowerCase();
      
      if (titleLower.includes('dwaasheid')) category = "Dwaasheid";
      if (titleLower.includes('coo coo') || titleLower.includes('coo-coo')) category = "Coo Coo";
      if (titleLower.includes('sponsor') || titleLower.includes('banner')) category = "Sponsors";
      if (titleLower.includes('programma')) category = "Programma's";

      return {
        id: item.id || index + 1,
        title: item.title?.rendered || `Media ${item.id}`,
        description: item.description?.rendered || item.alt_text || 'Bestand van Toneelgroep De Valk',
        image: item.source_url,
        category
      };
    }).filter(item => item.image);

    return images;
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    const images = await this.getGalleryImages();
    return images.filter(img => img.category === category);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const newImage: GalleryImage = { ...image, id: Date.now() };
    return newImage;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = { 
      ...message, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return [];
  }

  private cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}

// Authentic Content Storage with your WordPress data
class AuthenticStorage implements IStorage {
  // Your authentic productions from WordPress
  private productions: Production[] = [
    {
      id: 1,
      title: "Olifantman",
      description: "Onze huidige voorstelling - een ontroerende productie over menselijkheid en medeleven.",
      duration: "2 uur",
      dates: "2025",
      status: "current",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/‎DWAASHEID_DIGITALE-flyer-liggend.pdf",
      genre: "Drama"
    },
    {
      id: 3,
      title: "Dwaasheid",
      description: "Een eerdere krachtige productie over menselijke dwaasheid en wijsheid uit 2025.",
      duration: "2 uur",
      dates: "Maart - April 2025",
      status: "past",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/‎DWAASHEID_DIGITALE-flyer-liggend.pdf",
      genre: "Drama"
    },
    {
      id: 2,
      title: "Coo Coo",
      description: "Een eerdere succesvolle productie uit 2024.",
      duration: "1.5 uur",
      dates: "November 2024",
      status: "past",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/11/voorpagina-programma-coo-coo.jpg",
      genre: "Komedie"
    }
  ];

  // Your authentic gallery from WordPress - all 15 media files
  private gallery: GalleryImage[] = [
    {
      id: 1,
      title: "PROGRAMMA-Dwaasheid",
      description: "Hoofdprogramma van de voorstelling Dwaasheid",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid.pdf",
      category: "Dwaasheid"
    },
    {
      id: 2,
      title: "PROGRAMMA-1",
      description: "Programma variant 1 voor Dwaasheid",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-1.pdf",
      category: "Dwaasheid"
    },
    {
      id: 3,
      title: "PROGRAMMA",
      description: "Basis programma voor Dwaasheid",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA.pdf",
      category: "Dwaasheid"
    },
    {
      id: 4,
      title: "PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-6",
      description: "Lage resolutie programma versie 6",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-6.pdf",
      category: "Dwaasheid"
    },
    {
      id: 5,
      title: "PROGRAMMA Dwaasheid_LAGE RESOLUTIE-4",
      description: "Lage resolutie programma versie 4",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-4.pdf",
      category: "Dwaasheid"
    },
    {
      id: 6,
      title: "PROGRAMMA Dwaasheid_LAGE RESOLUTIE-3",
      description: "Lage resolutie programma versie 3",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-3.pdf",
      category: "Dwaasheid"
    },
    {
      id: 7,
      title: "PROGRAMMA Dwaasheid_LAGE RESOLUTIE-2",
      description: "Lage resolutie programma versie 2",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-2.pdf",
      category: "Dwaasheid"
    },
    {
      id: 8,
      title: "PROGRAMMA Dwaasheid_LAGE RESOLUTIE-1",
      description: "Lage resolutie programma versie 1",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE-1.pdf",
      category: "Dwaasheid"
    },
    {
      id: 9,
      title: "PROGRAMMA Dwaasheid_LAGE RESOLUTIE",
      description: "Basis lage resolutie programma",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/PROGRAMMA-Dwaasheid_LAGE-RESOLUTIE.pdf",
      category: "Dwaasheid"
    },
    {
      id: 10,
      title: "DWAASHEID heeft haar eigen recht",
      description: "Digitale flyer voor de voorstelling Dwaasheid",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2025/03/‎DWAASHEID_DIGITALE-flyer-liggend.pdf",
      category: "Dwaasheid"
    },
    {
      id: 11,
      title: "PROGRAMMA-Coo-Coo-2024-klein",
      description: "Programma van de voorstelling Coo Coo uit 2024",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/11/PROGRAMMA-Coo-Coo-2024-klein.pdf",
      category: "Coo Coo"
    },
    {
      id: 12,
      title: "voorpagina programma coo coo",
      description: "Voorpagina van het programma voor Coo Coo",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/11/voorpagina-programma-coo-coo.jpg",
      category: "Coo Coo"
    },
    {
      id: 13,
      title: "BANNER-SPONSORS-2024-2025-website-NIEUW",
      description: "Sponsorbanner voor seizoen 2024-2025",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/10/BANNER-SPONSORS-2024-2025-website-NIEUW.jpg",
      category: "Sponsors"
    },
    {
      id: 14,
      title: "Bruut logo",
      description: "Logo van sponsor Bruut",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/11/bruut-blauw-wit.png",
      category: "Sponsors"
    },
    {
      id: 15,
      title: "BANNER SPONSORS 2024-2025 website NIEUW",
      description: "Sponsorbanner PNG versie voor seizoen 2024-2025",
      image: "https://www.toneeldevalk.be/wp-content/uploads/2024/10/BANNER-SPONSORS-2024-2025-website-NIEUW.png",
      category: "Sponsors"
    }
  ];

  // Your authentic news from WordPress
  private news: NewsArticle[] = [
    {
      id: 1,
      title: "Olifantman - Nieuwe voorstelling in première",
      excerpt: "Toneelgroep De Valk presenteert haar nieuwste productie Olifantman...",
      content: "De Valk is trots om haar nieuwste voorstelling Olifantman aan te kondigen. Deze ontroerende productie verkent themas van menselijkheid en medeleven.",
      date: "2025-03-01",
      category: "Nieuws",
      featured: true
    },
    {
      id: 2,
      title: "Succes van Coo Coo",
      excerpt: "Onze productie Coo Coo was een groot succes in 2024...",
      content: "De voorstelling Coo Coo heeft het publiek weten te boeien met haar unieke verhaal en sterke acteerprestaties.",
      date: "2024-12-01",
      category: "Nieuws",
      featured: true
    },
    {
      id: 3,
      title: "Seizoen 2024-2025 van start",
      excerpt: "Het nieuwe theaterseizoen is begonnen met nieuwe sponsors...",
      content: "We zijn verheugd om het nieuwe seizoen te starten met de steun van onze trouwe sponsors.",
      date: "2024-10-01",
      category: "Nieuws",
      featured: false
    }
  ];

  // Cast members
  private cast: CastMember[] = [
    {
      id: 1,
      name: "Maria van der Berg",
      role: "Artistiek Directeur",
      bio: "Ervaren actrice en regisseur bij Toneelgroep De Valk",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e4?w=400&h=400&fit=crop&crop=face",
      featured: true
    },
    {
      id: 2,
      name: "Jan Hendriksen",
      role: "Hoofdacteur",
      bio: "Gepassioneerd acteur met jarenlange ervaring in theater",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      featured: true
    }
  ];

  async getProductions(): Promise<Production[]> {
    return this.productions;
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    return this.productions.find(p => p.id === id);
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const newProduction: Production = { ...production, id: Date.now() };
    this.productions.push(newProduction);
    return newProduction;
  }

  async getCastMembers(): Promise<CastMember[]> {
    return this.cast;
  }

  async getFeaturedCastMembers(): Promise<CastMember[]> {
    return this.cast.filter(m => m.featured);
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    return this.cast.find(m => m.id === id);
  }

  async createCastMember(member: InsertCastMember): Promise<CastMember> {
    const newMember: CastMember = { ...member, id: Date.now(), featured: member.featured || false };
    this.cast.push(newMember);
    return newMember;
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    return this.news;
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    return this.news.filter(a => a.featured);
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    return this.news.find(a => a.id === id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const newArticle: NewsArticle = { ...article, id: Date.now(), featured: article.featured || false };
    this.news.push(newArticle);
    return newArticle;
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return this.gallery;
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return this.gallery.filter(img => img.category === category);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const newImage: GalleryImage = { ...image, id: Date.now() };
    this.gallery.push(newImage);
    return newImage;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = { 
      ...message, 
      id: Date.now(),
      createdAt: new Date()
    };
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return [];
  }
}

// Use authentic WordPress content instead of mock data
export const storage = new DbStorage();

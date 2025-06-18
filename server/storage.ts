import {
  productions,
  castMembers,
  newsArticles,
  galleryImages,
  contactMessages,
  heroImages,
  type Production,
  type CastMember,
  type NewsArticle,
  type GalleryImage,
  type ContactMessage,
  type HeroImage,
  type InsertProduction,
  type InsertCastMember,
  type InsertNewsArticle,
  type InsertGalleryImage,
  type InsertContactMessage,
  type InsertHeroImage,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Productions
  getProductions(): Promise<Production[]>;
  getProductionById(id: number): Promise<Production | undefined>;
  createProduction(production: InsertProduction): Promise<Production>;
  updateProduction(id: number, data: Partial<InsertProduction>): Promise<void>;
  deleteProduction(id: number): Promise<void>;
  
  // Cast Members
  getCastMembers(): Promise<CastMember[]>;
  getFeaturedCastMembers(): Promise<CastMember[]>;
  getCastMemberById(id: number): Promise<CastMember | undefined>;
  createCastMember(member: InsertCastMember): Promise<CastMember>;
  updateCastMember(id: number, data: Partial<InsertCastMember>): Promise<void>;
  deleteCastMember(id: number): Promise<void>;
  
  // News Articles
  getNewsArticles(): Promise<NewsArticle[]>;
  getFeaturedNewsArticles(): Promise<NewsArticle[]>;
  getNewsArticleById(id: number): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: number, data: Partial<InsertNewsArticle>): Promise<void>;
  deleteNewsArticle(id: number): Promise<void>;
  
  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<void>;
  deleteGalleryImage(id: number): Promise<void>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<void>;
  
  // Hero Images
  getHeroImages(): Promise<HeroImage[]>;
  createHeroImage(image: InsertHeroImage): Promise<HeroImage>;
  updateHeroImage(id: number, data: Partial<InsertHeroImage>): Promise<void>;
  deleteHeroImage(id: number): Promise<void>;
}

// Memory Storage Implementation
class MemStorage implements IStorage {
  private productions: Production[] = [
    {
      id: 1,
      title: "De Olifantman",
      description: "Een ontroerend verhaal over moed, waardigheid en menselijkheid. Gebaseerd op het waargebeurde verhaal van Joseph Merrick, een man die ondanks zijn fysieke afwijkingen zijn innerlijke schoonheid behoudt. Een krachtige voorstelling over acceptatie en het vinden van je plaats in de wereld.",
      genre: "Drama",
      dates: "21, 22, 28 & 29 november 2025",
      duration: "120 min",
      status: "current",
      image: "/attached_assets/olifantenman.png",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private productions_counter = 2;

  async getProductions(): Promise<Production[]> {
    return [...this.productions].sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    return this.productions.find(p => p.id === id);
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const newProduction: Production = {
      id: this.productions_counter++,
      ...production,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.productions.push(newProduction);
    return newProduction;
  }

  async updateProduction(id: number, data: Partial<InsertProduction>): Promise<void> {
    const index = this.productions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productions[index] = { ...this.productions[index], ...data, updatedAt: new Date() };
    }
  }

  async deleteProduction(id: number): Promise<void> {
    this.productions = this.productions.filter(p => p.id !== id);
  }

  private castMembers: CastMember[] = [];
  private castMembers_counter = 1;

  async getCastMembers(): Promise<CastMember[]> {
    return [...this.castMembers].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFeaturedCastMembers(): Promise<CastMember[]> {
    return this.castMembers.filter(member => member.featured);
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    return this.castMembers.find(member => member.id === id);
  }

  async createCastMember(member: InsertCastMember): Promise<CastMember> {
    const newMember: CastMember = {
      id: this.castMembers_counter++,
      ...member,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.castMembers.push(newMember);
    return newMember;
  }

  async updateCastMember(id: number, data: Partial<InsertCastMember>): Promise<void> {
    const index = this.castMembers.findIndex(member => member.id === id);
    if (index !== -1) {
      this.castMembers[index] = { ...this.castMembers[index], ...data, updatedAt: new Date() };
    }
  }

  async deleteCastMember(id: number): Promise<void> {
    this.castMembers = this.castMembers.filter(member => member.id !== id);
  }

  private newsArticles: NewsArticle[] = [];
  private newsArticles_counter = 1;

  async getNewsArticles(): Promise<NewsArticle[]> {
    return [...this.newsArticles].sort((a, b) => 
      (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
    );
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    return this.newsArticles.filter(article => article.featured);
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    return this.newsArticles.find(article => article.id === id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const newArticle: NewsArticle = {
      id: this.newsArticles_counter++,
      ...article,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.newsArticles.push(newArticle);
    return newArticle;
  }

  async updateNewsArticle(id: number, data: Partial<InsertNewsArticle>): Promise<void> {
    const index = this.newsArticles.findIndex(article => article.id === id);
    if (index !== -1) {
      this.newsArticles[index] = { ...this.newsArticles[index], ...data, updatedAt: new Date() };
    }
  }

  async deleteNewsArticle(id: number): Promise<void> {
    this.newsArticles = this.newsArticles.filter(article => article.id !== id);
  }

  private galleryImages: GalleryImage[] = [];
  private galleryImages_counter = 1;

  async getGalleryImages(): Promise<GalleryImage[]> {
    return [...this.galleryImages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return this.galleryImages.filter(image => image.category === category);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const newImage: GalleryImage = {
      id: this.galleryImages_counter++,
      ...image,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.galleryImages.push(newImage);
    return newImage;
  }

  async updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<void> {
    const index = this.galleryImages.findIndex(image => image.id === id);
    if (index !== -1) {
      this.galleryImages[index] = { ...this.galleryImages[index], ...data, updatedAt: new Date() };
    }
  }

  async deleteGalleryImage(id: number): Promise<void> {
    this.galleryImages = this.galleryImages.filter(image => image.id !== id);
  }

  private contactMessages: ContactMessage[] = [];
  private contactMessages_counter = 1;

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: this.contactMessages_counter++,
      ...message,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return [...this.contactMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteContactMessage(id: number): Promise<void> {
    this.contactMessages = this.contactMessages.filter(message => message.id !== id);
  }

  private heroImages: HeroImage[] = [];
  private heroImages_counter = 1;

  async getHeroImages(): Promise<HeroImage[]> {
    return [...this.heroImages].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createHeroImage(image: InsertHeroImage): Promise<HeroImage> {
    const newImage: HeroImage = {
      id: this.heroImages_counter++,
      ...image,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.heroImages.push(newImage);
    return newImage;
  }

  async updateHeroImage(id: number, data: Partial<InsertHeroImage>): Promise<void> {
    const index = this.heroImages.findIndex(image => image.id === id);
    if (index !== -1) {
      this.heroImages[index] = { ...this.heroImages[index], ...data, updatedAt: new Date() };
    }
  }

  async deleteHeroImage(id: number): Promise<void> {
    this.heroImages = this.heroImages.filter(image => image.id !== id);
  }
}

// Use Memory Storage as primary storage
export const storage = new MemStorage();
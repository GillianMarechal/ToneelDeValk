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
import { db } from "./db";
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

// Database Storage Implementation
class DbStorage implements IStorage {
  async getProductions(): Promise<Production[]> {
    return await db.select().from(productions).orderBy(desc(productions.createdAt));
  }

  async getProductionById(id: number): Promise<Production | undefined> {
    const result = await db.select().from(productions).where(eq(productions.id, id));
    return result[0];
  }

  async createProduction(production: InsertProduction): Promise<Production> {
    const result = await db.insert(productions).values(production).returning();
    return result[0];
  }

  async updateProduction(id: number, data: Partial<InsertProduction>): Promise<void> {
    await db.update(productions).set(data).where(eq(productions.id, id));
  }

  async deleteProduction(id: number): Promise<void> {
    await db.delete(productions).where(eq(productions.id, id));
  }

  async getCastMembers(): Promise<CastMember[]> {
    return await db.select().from(castMembers).orderBy(castMembers.name);
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

  async updateCastMember(id: number, data: Partial<InsertCastMember>): Promise<void> {
    await db.update(castMembers).set(data).where(eq(castMembers.id, id));
  }

  async deleteCastMember(id: number): Promise<void> {
    await db.delete(castMembers).where(eq(castMembers.id, id));
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
  }

  async getFeaturedNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).where(eq(newsArticles.featured, true)).orderBy(desc(newsArticles.publishedAt));
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return result[0];
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }

  async updateNewsArticle(id: number, data: Partial<InsertNewsArticle>): Promise<void> {
    await db.update(newsArticles).set(data).where(eq(newsArticles.id, id));
  }

  async deleteNewsArticle(id: number): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.category, category));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const result = await db.insert(galleryImages).values(image).returning();
    return result[0];
  }

  async updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<void> {
    await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async getHeroImages(): Promise<HeroImage[]> {
    return await db.select().from(heroImages).orderBy(heroImages.sortOrder);
  }

  async createHeroImage(image: InsertHeroImage): Promise<HeroImage> {
    const result = await db.insert(heroImages).values(image).returning();
    return result[0];
  }

  async updateHeroImage(id: number, data: Partial<InsertHeroImage>): Promise<void> {
    await db.update(heroImages).set(data).where(eq(heroImages.id, id));
  }

  async deleteHeroImage(id: number): Promise<void> {
    await db.delete(heroImages).where(eq(heroImages.id, id));
  }
}

// Use Database Storage as primary storage
export const storage = new DbStorage();
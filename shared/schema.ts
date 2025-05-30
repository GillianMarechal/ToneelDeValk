import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productions = pgTable("productions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  dates: text("dates").notNull(),
  status: text("status").notNull(), // "current", "upcoming", "past"
  image: text("image").notNull(),
  genre: text("genre").notNull(),
});

export const castMembers = pgTable("cast_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").default(false),
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductionSchema = createInsertSchema(productions).omit({
  id: true,
});

export const insertCastMemberSchema = createInsertSchema(castMembers).omit({
  id: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertProduction = z.infer<typeof insertProductionSchema>;
export type Production = typeof productions.$inferSelect;

export type InsertCastMember = z.infer<typeof insertCastMemberSchema>;
export type CastMember = typeof castMembers.$inferSelect;

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

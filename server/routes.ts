import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Productions routes
  app.get("/api/productions", async (_req, res) => {
    try {
      const productions = await storage.getProductions();
      res.json(productions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch productions" });
    }
  });

  app.get("/api/productions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const production = await storage.getProductionById(id);
      if (!production) {
        return res.status(404).json({ message: "Production not found" });
      }
      res.json(production);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production" });
    }
  });

  // Cast members routes
  app.get("/api/cast", async (_req, res) => {
    try {
      const castMembers = await storage.getCastMembers();
      res.json(castMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cast members" });
    }
  });

  app.get("/api/cast/featured", async (_req, res) => {
    try {
      const featuredMembers = await storage.getFeaturedCastMembers();
      res.json(featuredMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured cast members" });
    }
  });

  app.get("/api/cast/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getCastMemberById(id);
      if (!member) {
        return res.status(404).json({ message: "Cast member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cast member" });
    }
  });

  // News articles routes
  app.get("/api/news", async (_req, res) => {
    try {
      const articles = await storage.getNewsArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news/featured", async (_req, res) => {
    try {
      const featuredArticles = await storage.getFeaturedNewsArticles();
      res.json(featuredArticles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured news articles" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNewsArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (_req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const images = await storage.getGalleryImagesByCategory(category);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery images by category" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validation = insertContactMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid contact form data",
          errors: validation.error.errors
        });
      }

      const message = await storage.createContactMessage(validation.data);
      res.status(201).json({ 
        message: "Contact message sent successfully",
        id: message.id
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to send contact message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

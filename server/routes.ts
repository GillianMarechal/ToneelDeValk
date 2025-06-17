import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema,
  insertProductionSchema,
  insertCastMemberSchema,
  insertNewsArticleSchema,
  insertGalleryImageSchema,
  insertHeroImageSchema
} from "@shared/schema";
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

  // Migration routes
  app.post("/api/migrate/wordpress", async (req, res) => {
    try {
      const { wpSiteUrl, contentType, username, password } = req.body;
      
      if (!wpSiteUrl) {
        return res.status(400).json({ message: "WordPress site URL is required" });
      }

      const migrator = new WordPressMigrator(wpSiteUrl, username, password);
      
      switch (contentType) {
        case "news":
          await migrator.migrateNewsArticles();
          break;
        case "productions":
          await migrator.migrateProductions();
          break;
        case "gallery":
          await migrator.migrateGallery();
          break;
        case "all":
          await migrator.migrateEverything();
          break;
        case "comprehensive":
          await migrator.migrateComprehensive();
          break;
        case "pages":
          await migrator.migratePages();
          break;
        default:
          return res.status(400).json({ message: "Invalid content type" });
      }

      res.json({ message: `Successfully migrated ${contentType} from WordPress` });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ message: "Migration failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // WordPress XML export parser
  app.post("/api/import/wordpress-xml", async (req, res) => {
    try {
      const { xmlContent } = req.body;
      
      if (!xmlContent) {
        return res.status(400).json({ message: "WordPress XML content is required" });
      }

      console.log("Parsing WordPress XML export...");
      
      const migrator = new WordPressMigrator("", "", "");
      const parsedContent = await migrator.parseWordPressExport(xmlContent);
      
      // Import parsed content
      let imported = 0;
      
      // Import posts as news
      for (const post of parsedContent.posts) {
        try {
          await storage.createNewsArticle({
            title: post.title || 'Untitled',
            excerpt: post.excerpt || post.content?.substring(0, 200) + '...' || '',
            content: post.content || '',
            date: post.date || new Date().toISOString().split('T')[0],
            category: 'Nieuws',
            featured: false
          });
          imported++;
        } catch (error) {
          console.error(`Failed to import post: ${post.title}`, error);
        }
      }
      
      // Import media as gallery items
      for (const media of parsedContent.media) {
        try {
          await storage.createGalleryImage({
            title: media.title || 'Media Item',
            description: media.description || 'Imported from WordPress',
            image: media.url || '',
            category: media.category || 'Producties'
          });
          imported++;
        } catch (error) {
          console.error(`Failed to import media: ${media.title}`, error);
        }
      }

      res.json({ 
        message: `Successfully imported ${imported} items from WordPress XML`,
        details: {
          posts: parsedContent.posts.length,
          pages: parsedContent.pages.length,
          media: parsedContent.media.length
        }
      });
    } catch (error) {
      console.error("WordPress XML import error:", error);
      res.status(500).json({ message: "WordPress XML import failed" });
    }
  });

  app.post("/api/migrate/csv", async (req, res) => {
    try {
      const { csvContent, contentType } = req.body;
      
      if (!csvContent) {
        return res.status(400).json({ message: "CSV content is required" });
      }

      switch (contentType) {
        case "news":
          await CSVImporter.importNewsFromCSV(csvContent);
          break;
        case "productions":
          await CSVImporter.importProductionsFromCSV(csvContent);
          break;
        default:
          return res.status(400).json({ message: "Invalid content type for CSV import" });
      }

      res.json({ message: `Successfully imported ${contentType} from CSV` });
    } catch (error) {
      console.error("CSV import error:", error);
      res.status(500).json({ message: "CSV import failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

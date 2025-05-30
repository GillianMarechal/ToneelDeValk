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

export const storage = new MemStorage();

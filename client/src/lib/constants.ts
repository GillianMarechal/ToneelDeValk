export const SITE_CONFIG = {
  name: "Toneelgroep De Valk",
  tagline: "Blijf Verwonderd",
  description: "Een gepassioneerde lokale theatergroep die kwaliteitsvoorstellingen brengt sinds 1885",
  founded: 1885,
  email: "devalkbrugge@gmail.com",
  phone: "",
  address: {
    street: "Pastoriestraat 276",
    city: "8200 Brugge/Sint-Andries",
    postal: "8000 Brugge",
    country: ""
  },
  venue: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: ""
  }
} as const;

export const STATS = {
  yearsActive: new Date().getFullYear() - SITE_CONFIG.founded,
  totalProductions: 200,
  audienceReached: 75000,
  activeMembers: 15
} as const;

export const OPENING_HOURS = {
  weekdays: "Maandag - Vrijdag: 19:00 - 21:00",
  weekend: "Weekend: 1 uur voor voorstelling",
  note: "Of op afspraak"
} as const;

export const NAVIGATION = [
  { name: "Home", href: "/" },
  { name: "Over Ons", href: "/about" },
  { name: "Producties", href: "/productions" },
  { name: "Cast & Crew", href: "/cast" },
  { name: "Nieuws", href: "/news" },
  { name: "Galerij", href: "/gallery" },
  { name: "Contact", href: "/contact" },
] as const;

export const PRODUCTION_STATUSES = {
  current: {
    label: "Nu Speelt",
    color: "bg-theatre-red text-white",
    action: "Reserveer"
  },
  upcoming: {
    label: "Binnenkort", 
    color: "bg-theatre-gold text-theatre-navy",
    action: "Informeer Mij"
  },
  past: {
    label: "Gespeeld",
    color: "bg-theatre-charcoal text-white", 
    action: "Bekijk Details"
  }
} as const;

export const CONTACT_SUBJECTS = [
  { value: "tickets", label: "Kaartreservering" },
  { value: "membership", label: "Lid worden" },
  { value: "general", label: "Algemene vraag" },
  { value: "press", label: "Pers & Media" },
  { value: "auditions", label: "Audities" },
  { value: "technical", label: "Technische ondersteuning" }
] as const;

export const GALLERY_CATEGORIES = [
  "Producties",
  "Backstage", 
  "Techniek",
  "Publiek",
  "Cast",
  "Evenementen"
] as const;

export const NEWS_CATEGORIES = [
  "Recensies",
  "Audities",
  "Prijzen", 
  "Aankondigingen",
  "Backstage",
  "Pers"
] as const;

// Theatre-specific colors in HSL format
export const THEATRE_COLORS = {
  navy: "210 31% 15%", // #1a2332
  gold: "48 84% 52%",  // #d4af37
  red: "348 70% 44%",  // #c41e3a
  charcoal: "0 0% 20%" // #333333
} as const;

export const META_DEFAULTS = {
  siteName: SITE_CONFIG.name,
  author: SITE_CONFIG.name,
  language: "nl",
  locale: "nl_NL",
  type: "website",
  robots: "index, follow",
  themeColor: "#1a2332" // theatre-navy
} as const;

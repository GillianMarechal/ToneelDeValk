import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords = "", 
  image = "",
  url = ""
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set favicon
    const setFavicon = (href: string) => {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        document.head.appendChild(favicon);
      }
      favicon.href = href;

      // Also set apple-touch-icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      appleTouchIcon.href = href;
    };

    // Set De Valk logo as favicon
    setFavicon('/attached_assets/logodevalk_1750106393368.png');

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, property?: string) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Set basic meta tags
    setMetaTag('description', description);
    if (keywords) setMetaTag('keywords', keywords);
    setMetaTag('author', 'Toneelgroep De Valk');
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Set Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', 'Toneelgroep De Valk', true);
    
    if (url) setMetaTag('og:url', url, true);
    if (image) setMetaTag('og:image', image, true);

    // Set Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    if (image) setMetaTag('twitter:image', image);

    // Set additional SEO tags
    setMetaTag('theme-color', '#1a2332'); // theatre-navy color
    setMetaTag('msapplication-TileColor', '#1a2332');

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // We don't actually remove the tags to avoid flashing,
      // they'll be updated by the next page
    };
  }, [title, description, keywords, image, url]);

  // Add structured data for better SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TheaterGroup",
      "name": "Toneelgroep De Valk",
      "description": description,
      "url": url || window.location.href,
      "email": "info@toneelgroepdevalk.nl",
      "foundingDate": "1885",
      "sameAs": [
        "https://www.facebook.com/toneelgroepdevalk",
        "https://www.instagram.com/toneelgroepdevalk"
      ]
    };

    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }
    
    scriptElement.textContent = JSON.stringify(structuredData);
  }, [description, url]);

  return null; // This component doesn't render anything visible
}

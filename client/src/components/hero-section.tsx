import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import cyranoBluePath from "@assets/DeValk1_1750105696284.jpg";
import rostekopSepiaPath from "@assets/devalk2_1750105696285.jpg";
import logoPath from "@assets/logodevalk_1750106393368.png";

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);

  const images = [
    {
      src: cyranoBluePath,
      alt: "Arme Cyrano - Groep acteurs kijken verwonderd naar de maan",
      title: "Arme Cyrano"
    },
    {
      src: rostekopSepiaPath,
      alt: "Rostekop - Acteur toont verwondering",
      title: "Rostekop"
    }
  ];

  const taglines = [
    "blijf verwonderd, de valk zal je verbazen",
    "blijf verwonderd, samen met De Valk",
    "blijf verwonderd, de valk blijft verbazen"
  ];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    // Cycle through images every 8 seconds
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);

    // Animate tagline every 4 seconds
    const taglineInterval = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setTaglineVisible(true);
      }, 300);
    }, 4000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(taglineInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Main Logo and Title */}
          <div className="mb-8">
            {/* De Valk Logo */}
            <div className="mb-6 flex justify-center">
              <img 
                src={logoPath} 
                alt="De Valk Logo" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-2xl"
              />
            </div>
            
            <h1 className="text-7xl md:text-9xl font-playfair font-bold mb-4 leading-tight">
              <span className="inline-block text-theatre-gold animate-shimmer">DE VALK</span>
            </h1>
            <p className="text-2xl md:text-3xl text-theatre-cream font-light tracking-wide">
              Koninklijke Toneelvereniging
            </p>
          </div>

          {/* Dynamic Tagline */}
          <div className="mb-12 h-16 flex items-center justify-center">
            <p className={`text-xl md:text-2xl font-medium text-theatre-gold transition-all duration-300 ${
              taglineVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              {taglines[currentTagline]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/productions">
              <Button 
                size="lg" 
                className="bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ontdek Voorstellingen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-theatre-navy px-8 py-4 rounded-full transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Contact
              </Button>
            </Link>
          </div>

          {/* Theatre Legacy Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="animate-count-up">
              <div className="text-3xl md:text-4xl font-bold text-theatre-gold mb-2">Sinds 1885</div>
              <div className="text-theatre-cream font-light">Koninklijke Traditie</div>
            </div>
            <div className="animate-count-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-theatre-gold mb-2">Olifantman</div>
              <div className="text-theatre-cream font-light">Huidige Productie</div>
            </div>
            <div className="animate-count-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl md:text-4xl font-bold text-theatre-gold mb-2">Verwondering</div>
              <div className="text-theatre-cream font-light">Onze Missie</div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Attribution */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm">
        {images[currentImage].title}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-theatre-cream rounded-full flex justify-center">
          <div className="w-1 h-3 bg-theatre-cream rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
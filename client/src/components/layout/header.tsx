import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Ticket } from "lucide-react";
import logoPath from "@assets/logodevalk_1750106393368.png";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Over Ons", href: "/about" },
    { name: "Producties", href: "/productions" },
    { name: "Cast & Crew", href: "/cast" },
    { name: "Nieuws", href: "/news" },
    { name: "Galerij", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/98 backdrop-blur-sm shadow-lg" 
          : "bg-white/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <h1 className="text-2xl font-playfair font-bold text-theatre-navy group-hover:text-theatre-red transition-colors">
                  DE VALK
                </h1>
                <img 
                  src={logoPath} 
                  alt="De Valk Logo" 
                  className="w-8 h-8 object-contain filter brightness-0 group-hover:brightness-100 transition-all duration-300"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a 
                  className={`text-theatre-charcoal hover:text-theatre-red transition-colors font-medium ${
                    isActive(item.href) ? "text-theatre-red" : ""
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            
            {/* Buy Tickets Button */}
            <a 
              href="https://www.toneeldevalk.be" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button 
                className="bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Tickets De Olifantman
              </Button>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-theatre-navy"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a 
                    className={`block px-3 py-2 text-theatre-charcoal hover:text-theatre-red transition-colors font-medium ${
                      isActive(item.href) ? "text-theatre-red bg-gray-50" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
              
              {/* Mobile Buy Tickets Button */}
              <div className="px-3 py-2">
                <a 
                  href="https://www.toneeldevalk.be" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Tickets De Olifantman
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

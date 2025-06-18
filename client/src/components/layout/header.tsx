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
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group">
                <h1 className="text-xl sm:text-2xl font-playfair font-bold text-theatre-navy group-hover:text-theatre-red transition-colors">
                  DE VALK
                </h1>
                <img 
                  src={logoPath} 
                  alt="De Valk Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain filter brightness-0 group-hover:brightness-100 transition-all duration-300"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-theatre-charcoal hover:text-theatre-red transition-colors font-medium text-sm xl:text-base ${
                  isActive(item.href) ? "text-theatre-red" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Buy Tickets Button */}
            <a 
              href="https://www.toneeldevalk.be" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block ml-4"
            >
              <Button 
                className="bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold px-4 lg:px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm lg:text-base"
              >
                <Ticket className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden xl:inline">Tickets De Olifantman</span>
                <span className="xl:hidden">Tickets</span>
              </Button>
            </a>
          </div>
          
          {/* Medium screen navigation without tickets button */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-theatre-charcoal hover:text-theatre-red transition-colors font-medium text-sm ${
                  isActive(item.href) ? "text-theatre-red" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button and Ticket Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Ticket Button */}
            <a 
              href="https://www.toneeldevalk.be" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button 
                size="sm"
                className="bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold px-3 py-1.5 rounded-full transition-all duration-300 text-xs"
              >
                <Ticket className="h-3 w-3" />
              </Button>
            </a>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-theatre-navy"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 lg:top-20 left-0 right-0 bg-white shadow-lg border-t z-50">
            <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`block px-3 py-3 text-theatre-charcoal hover:text-theatre-red transition-colors font-medium rounded-lg hover:bg-gray-50 ${
                    isActive(item.href) ? "text-theatre-red bg-gray-50" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Buy Tickets Button */}
              <div className="px-3 py-2 border-t border-gray-100 mt-4 pt-4">
                <a 
                  href="https://www.toneeldevalk.be" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-3 rounded-lg transition-all duration-300 shadow-sm"
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

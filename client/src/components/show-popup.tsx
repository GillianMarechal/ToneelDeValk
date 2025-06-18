import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import ProductionPopup from "./production-popup";
import { useQuery } from "@tanstack/react-query";

interface ShowPopupProps {
  show: {
    title: string;
    description: string;
    dates: string;
    genre: string;
    image?: string;
  };
}

export default function ShowPopup({ show }: ShowPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProductionPopup, setShowProductionPopup] = useState(false);

  // Fetch productions to get the specific production data
  const { data: productions } = useQuery({
    queryKey: ["/api/productions"],
  });

  // Find the current production (De Olifantman) or create fallback
  const currentProduction = Array.isArray(productions) 
    ? productions.find((p: any) => p.status === "current")
    : {
        id: 1,
        title: "De Olifantman",
        description: "Een ontroerend verhaal over moed, waardigheid en menselijkheid. Gebaseerd op het waargebeurde verhaal van Joseph Merrick, een man die ondanks zijn fysieke afwijkingen zijn innerlijke schoonheid behoudt. Een krachtige voorstelling over acceptatie en het vinden van je plaats in de wereld.",
        genre: "Drama",
        dates: "21, 22, 28 & 29 november 2025",
        duration: "120 min",
        status: "current",
        image: "/attached_assets/olifantenman.png",
        createdAt: new Date(),
        updatedAt: new Date()
      };

  useEffect(() => {
    // Always show popup on page load for testing
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('showPopupShown', 'true');
    }, 300);
  };

  const handleTicketClick = () => {
    sessionStorage.setItem('showPopupShown', 'true');
    handleClose();
  };

  const handleMoreInfo = () => {
    sessionStorage.setItem('showPopupShown', 'true');
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setShowProductionPopup(true);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`pointer-events-auto relative bg-white backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 border border-theatre-navy/10 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="w-4 h-4 text-theatre-charcoal" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-theatre-gold/20 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-theatre-gold" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-theatre-navy mb-2">
                Nu Speelt
              </h2>
              <div className="w-12 h-px bg-theatre-gold mx-auto"></div>
            </div>

            {/* Show Details */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-playfair font-bold text-theatre-navy mb-3">
                {show.title}
              </h3>
              <p className="text-theatre-charcoal/80 text-sm mb-4 leading-relaxed">
                {show.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-center items-center gap-2">
                  <Calendar className="w-4 h-4 text-theatre-gold" />
                  <span className="text-theatre-charcoal font-medium">{show.dates}</span>
                </div>
                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a 
                href="https://be.ticketgang.eu/orgFrameSaleNew.php?org=204637&event=150489"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTicketClick}
              >
                <Button 
                  className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  size="lg"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Tickets Reserveren
                </Button>
              </a>
              
              <Link href="/productions/olifantenman" onClick={handleTicketClick}>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-theatre-navy/20 text-theatre-navy hover:bg-theatre-navy hover:text-white py-3 rounded-xl transition-all duration-300"
                  size="lg"
                >
                  Meer Informatie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-6 border-t border-theatre-navy/10">
              <p className="text-xs text-theatre-charcoal/60">
                Blijf Verwonderd met Toneelgroep De Valk
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-theatre-gold rounded-full"></div>
          </div>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-[rgba(230, 196, 70, 0)]"></div>
          </div>
        </div>
      </div>

      {/* Production Details Popup */}
      {currentProduction && (
        <ProductionPopup 
          production={currentProduction}
          open={showProductionPopup}
          onClose={() => setShowProductionPopup(false)}
        />
      )}
    </div>
  );
}
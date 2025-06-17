import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";

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

  useEffect(() => {
    // Check if popup was already shown this session
    const popupShown = sessionStorage.getItem('showPopupShown');
    
    if (!popupShown) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      // Remember that popup was shown this session
      sessionStorage.setItem('showPopupShown', 'true');
    }, 300);
  };

  const handleTicketClick = () => {
    // Track ticket interest
    sessionStorage.setItem('showPopupShown', 'true');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
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
                <div className="inline-block bg-theatre-navy/10 text-theatre-navy px-3 py-1 rounded-full text-xs font-medium">
                  {show.genre}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/contact" onClick={handleTicketClick}>
                <Button 
                  className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  size="lg"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Tickets Reserveren
                </Button>
              </Link>
              
              <Link href="/productions" onClick={handleTicketClick}>
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
            <div className="w-2 h-2 bg-theatre-red rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
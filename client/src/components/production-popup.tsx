import { type Production } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, X, Ticket } from "lucide-react";

interface ProductionPopupProps {
  production: Production | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductionPopup({ production, open, onClose }: ProductionPopupProps) {
  if (!production) return null;

  const getTicketButton = () => {
    if (production.status === "current") {
      return (
        <a 
          href="https://be.ticketgang.eu/orgFrameSaleNew.php?org=204637&event=150489"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button 
            className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            size="lg"
          >
            <Ticket className="mr-2 h-5 w-5" />
            Tickets Reserveren
          </Button>
        </a>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Poster Section */}
            <div className="relative bg-theatre-navy">
              <img 
                src={production.image} 
                alt={`Poster van ${production.title}`}
                className="w-full h-full object-cover min-h-[400px] md:min-h-[600px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Details Section */}
            <div className="p-8 bg-white">
              <DialogHeader className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-3xl font-playfair font-bold text-theatre-navy">
                    {production.title}
                  </DialogTitle>
                  <span className="bg-theatre-red text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Nu Speelt
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-theatre-charcoal">
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-theatre-gold" />
                    {production.genre}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-theatre-gold" />
                    {production.duration}
                  </span>
                </div>
              </DialogHeader>

              {/* Show Dates */}
              <div className="mb-6 p-4 bg-theatre-gold/10 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-theatre-gold" />
                  <span className="font-semibold text-theatre-navy">Speeldata</span>
                </div>
                <p className="text-theatre-charcoal font-medium">{production.dates}</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-theatre-navy mb-3">Over deze voorstelling</h3>
                <p className="text-theatre-charcoal leading-relaxed text-base">
                  {production.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                {getTicketButton()}
                
                <div className="text-center pt-4 border-t border-theatre-navy/10">
                  <p className="text-sm text-theatre-charcoal/60">
                    Blijf Verwonderd met Toneelgroep De Valk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
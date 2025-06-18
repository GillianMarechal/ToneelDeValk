import { type Production } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag } from "lucide-react";
import { useState } from "react";
import ProductionPopup from "./production-popup";

import olifantenman_Final from "@assets/olifantenman_Final.png";

interface ProductionCardProps {
  production: Production;
}

export default function ProductionCard({ production }: ProductionCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const getStatusBadge = () => {
    switch (production.status) {
      case "current":
        return <span className="bg-theatre-red text-white px-3 py-1 rounded-full text-sm font-semibold">Nu Speelt</span>;
      case "upcoming":
        return <span className="bg-theatre-gold text-theatre-navy px-3 py-1 rounded-full text-sm font-semibold">Binnenkort</span>;
      case "past":
        return <span className="bg-theatre-charcoal text-white px-3 py-1 rounded-full text-sm font-semibold">Gespeeld</span>;
      default:
        return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Status Onbekend</span>;
    }
  };

  const getActionButton = () => {
    switch (production.status) {
      case "current":
        return (
          <a 
            href="https://be.ticketgang.eu/orgFrameSaleNew.php?org=204637&event=150489"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="text-theatre-red hover:text-theatre-gold font-semibold bg-transparent p-0 h-auto">
              Reserveer →
            </Button>
          </a>
        );
      case "upcoming":
        return (
          <a href="/contact">
            <Button className="text-theatre-red hover:text-theatre-gold font-semibold bg-transparent p-0 h-auto">
              Informeer Mij →
            </Button>
          </a>
        );
      case "past":
        return (
          <Button className="text-theatre-red hover:text-theatre-gold font-semibold bg-transparent p-0 h-auto">
            Bekijk Details →
          </Button>
        );
      default:
        return (
          <Button className="text-theatre-red hover:text-theatre-gold font-semibold bg-transparent p-0 h-auto">
            Meer Info →
          </Button>
        );
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        <div className="relative">
          <img 
            src="/attached_assets/olifantenman_Final.png" 
            alt={`Poster van ${production.title}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute top-4 left-4">
            {getStatusBadge()}
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {production.duration}
            </span>
          </div>
          
          {/* Click indicator overlay */}
          <div className="absolute inset-0 bg-theatre-navy/0 group-hover:bg-theatre-navy/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full px-4 py-2">
              <span className="text-theatre-navy font-semibold text-sm">Klik voor details</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-theatre-gold font-semibold text-sm flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              {production.genre}
            </span>
          </div>
          
          <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-2 group-hover:text-theatre-red transition-colors">
            {production.title}
          </h3>
          
          <p className="text-theatre-charcoal mb-4 text-sm leading-relaxed line-clamp-3">
            {production.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-theatre-charcoal flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {production.dates}
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              {getActionButton()}
            </div>
          </div>
        </div>
      </div>
      <ProductionPopup 
        production={production}
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}

import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowLeft, Ticket } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";
import olifantenman_Final from "@assets/olifantenman_Final.png";

export default function ProductionDetail() {
  const { slug } = useParams();
  
  const { data: productions, isLoading } = useQuery({
    queryKey: ["/api/productions"],
  });

  // Find the specific production by slug or title
  const production = Array.isArray(productions) 
    ? productions.find((p: any) => 
        p.title.toLowerCase().replace(/\s+/g, '') === slug?.replace('-', '') ||
        p.title.toLowerCase().includes(slug?.replace('-', ' ') || '')
      )
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theatre-red mx-auto"></div>
          <p className="mt-4 text-theatre-charcoal">Laden...</p>
        </div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-theatre-navy mb-4">Voorstelling niet gevonden</h1>
          <p className="text-theatre-charcoal mb-6">De gevraagde voorstelling bestaat niet of is niet meer beschikbaar.</p>
          <Link href="/productions">
            <Button className="bg-theatre-red hover:bg-theatre-red/90 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar Voorstellingen
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            className="w-full bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            size="lg"
          >
            <Ticket className="mr-3 h-6 w-6" />
            Tickets Reserveren
          </Button>
        </a>
      );
    } else if (production.status === "upcoming") {
      return (
        <Link href="/contact" className="w-full">
          <Button 
            variant="outline"
            className="w-full border-2 border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white py-4 px-8 text-lg rounded-xl transition-all duration-300"
            size="lg"
          >
            Informeer Mij
          </Button>
        </Link>
      );
    }
    return null;
  };

  const getStatusBadge = () => {
    switch (production.status) {
      case "current":
        return <span className="bg-theatre-red text-white px-4 py-2 rounded-full text-lg font-semibold">Nu Speelt</span>;
      case "upcoming":
        return <span className="bg-theatre-gold text-theatre-navy px-4 py-2 rounded-full text-lg font-semibold">Binnenkort</span>;
      case "past":
        return <span className="bg-theatre-charcoal text-white px-4 py-2 rounded-full text-lg font-semibold">Gespeeld</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead 
        title={`${production.title} - Toneelgroep De Valk`}
        description={production.description}
        keywords={`${production.title}, ${production.genre}, theater, toneel, Brugge, De Valk`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-theatre-cream to-white">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/productions">
            <Button variant="ghost" className="text-theatre-navy hover:text-theatre-red mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar Voorstellingen
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Poster */}
            <div className="relative">
              <div className="relative bg-theatre-navy rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={production.title === "De Olifantman" ? olifantenman_Final : production.image}
                  alt={`Poster van ${production.title}`}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-theatre-navy">
                    {production.title}
                  </h1>
                  {getStatusBadge()}
                </div>
                
                <div className="flex items-center gap-6 text-theatre-charcoal flex-wrap">
                  <span className="flex items-center text-lg">
                    <Tag className="w-5 h-5 mr-2 text-theatre-gold" />
                    {production.genre}
                  </span>
                  <span className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-theatre-gold" />
                    {production.duration}
                  </span>
                </div>
              </div>

              {/* Show Dates */}
              <div className="p-6 bg-theatre-gold/10 rounded-xl border-l-4 border-theatre-gold">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 mr-3 text-theatre-gold" />
                  <span className="font-semibold text-theatre-navy text-xl">Speeldata</span>
                </div>
                <p className="text-theatre-charcoal font-medium text-lg">{production.dates}</p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-theatre-navy">Over deze voorstelling</h2>
                <p className="text-theatre-charcoal leading-relaxed text-lg">
                  {production.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="space-y-6 pt-4">
                {getTicketButton()}
                
                <div className="text-center pt-6 border-t border-theatre-navy/10">
                  <p className="text-theatre-charcoal/60">
                    Blijf Verwonderd met Toneelgroep De Valk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
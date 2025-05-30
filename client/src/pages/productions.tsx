import { useQuery } from "@tanstack/react-query";
import { type Production } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import ProductionCard from "@/components/production-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Productions() {
  const [filter, setFilter] = useState<string>("all");
  
  const { data: productions, isLoading } = useQuery<Production[]>({
    queryKey: ["/api/productions"],
  });

  const filteredProductions = productions?.filter(production => {
    if (filter === "all") return true;
    return production.status === filter;
  }) || [];

  const currentProductions = productions?.filter(p => p.status === "current") || [];
  const upcomingProductions = productions?.filter(p => p.status === "upcoming") || [];
  const pastProductions = productions?.filter(p => p.status === "past") || [];

  return (
    <>
      <SEOHead 
        title="Producties | Toneelgroep De Valk"
        description="Ontdek alle huidige, komende en eerdere producties van Toneelgroep De Valk. Reserveer uw plaatsen voor onze nieuwste voorstellingen."
        keywords="theater producties, voorstellingen, kaartverkoop, theater programma, De Valk shows"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Onze Producties
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            Van klassieke meesterwerken tot hedendaagse verhalen - ontdek ons diverse repertoire
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              className={filter === "all" ? "bg-theatre-navy text-white" : "border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white"}
            >
              Alle Producties
            </Button>
            <Button
              onClick={() => setFilter("current")}
              variant={filter === "current" ? "default" : "outline"}
              className={filter === "current" ? "bg-theatre-red text-white" : "border-theatre-red text-theatre-red hover:bg-theatre-red hover:text-white"}
            >
              Nu Speelt ({currentProductions.length})
            </Button>
            <Button
              onClick={() => setFilter("upcoming")}
              variant={filter === "upcoming" ? "default" : "outline"}
              className={filter === "upcoming" ? "bg-theatre-gold text-theatre-navy" : "border-theatre-gold text-theatre-gold hover:bg-theatre-gold hover:text-theatre-navy"}
            >
              Binnenkort ({upcomingProductions.length})
            </Button>
            <Button
              onClick={() => setFilter("past")}
              variant={filter === "past" ? "default" : "outline"}
              className={filter === "past" ? "bg-theatre-charcoal text-white" : "border-theatre-charcoal text-theatre-charcoal hover:bg-theatre-charcoal hover:text-white"}
            >
              Eerdere Shows ({pastProductions.length})
            </Button>
          </div>
        </div>
      </section>

      {/* Productions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProductions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProductions.map((production) => (
                <ProductionCard key={production.id} production={production} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-playfair font-bold text-theatre-navy mb-4">
                Geen producties gevonden
              </h3>
              <p className="text-theatre-charcoal">
                Er zijn momenteel geen producties in deze categorie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-theatre-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Mis Geen Enkele Voorstelling
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Abonneer u op onze nieuwsbrief om als eerste te horen over nieuwe producties en kaartverkoop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy">
              Nieuwsbrief Aanmelden
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-theatre-navy">
              Contact Opnemen
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

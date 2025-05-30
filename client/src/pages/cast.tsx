import { useQuery } from "@tanstack/react-query";
import { type CastMember } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import CastMemberCard from "@/components/cast-member";
import { Button } from "@/components/ui/button";
import { Users, Star, Award } from "lucide-react";

export default function Cast() {
  const { data: castMembers, isLoading } = useQuery<CastMember[]>({
    queryKey: ["/api/cast"],
  });

  const featuredMembers = castMembers?.filter(member => member.featured) || [];
  const otherMembers = castMembers?.filter(member => !member.featured) || [];

  return (
    <>
      <SEOHead 
        title="Cast & Crew | Toneelgroep De Valk"
        description="Maak kennis met het getalenteerde team van Toneelgroep De Valk. Ontmoet onze acteurs, regisseurs en crew leden die onze voorstellingen tot leven brengen."
        keywords="theater cast, acteurs, crew, theater team, regisseurs, De Valk spelers"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Ons Getalenteerde Team
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            De passionevolle kunstenaars die onze verhalen tot leven brengen
          </p>
        </div>
      </section>

      {/* Featured Cast Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-theatre-gold mr-3" />
              <h2 className="text-4xl font-playfair font-bold text-theatre-navy">
                Onze Kernleden
              </h2>
            </div>
            <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
              De ervaren professionals die de artistieke koers van onze groep bepalen
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-48 h-48 rounded-full mx-auto mb-4 bg-gray-300"></div>
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredMembers.map((member) => (
                <CastMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Cast Members */}
      {otherMembers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-theatre-red mr-3" />
                <h2 className="text-4xl font-playfair font-bold text-theatre-navy">
                  Onze Volledige Cast & Crew
                </h2>
              </div>
              <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
                Alle talentvolle mensen die bijdragen aan het succes van onze producties
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {otherMembers.map((member) => (
                <CastMemberCard key={member.id} member={member} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-theatre-navy mb-6">
                Achter de Schermen
              </h2>
              <p className="text-lg text-theatre-charcoal mb-6 leading-relaxed">
                Onze groep bestaat niet alleen uit de acteurs die u op het podium ziet. 
                Achter elke succesvolle productie staat een toegewijd team van regisseurs, 
                technici, kostuumontwerpers, en vele andere specialisten die hun expertise 
                en passie inzetten voor het theater.
              </p>
              <p className="text-lg text-theatre-charcoal mb-8 leading-relaxed">
                Van lichtontwerp tot grimering, van decorbouw tot geluidsregie - 
                elk teamlid draagt bij aan de magie die ontstaat wanneer het doek opgaat. 
                Samen vormen we een hechte gemeenschap van theaterliefhebbers die elkaar 
                inspireren en steunen.
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-theatre-gold">{castMembers?.length || 0}+</div>
                  <div className="text-sm text-theatre-charcoal">Teamleden</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-theatre-gold">15+</div>
                  <div className="text-sm text-theatre-charcoal">Specialisaties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-theatre-gold">35+</div>
                  <div className="text-sm text-theatre-charcoal">Jaar Ervaring</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Behind the scenes teamwork during production preparation" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-theatre-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-theatre-gold mr-4" />
            <h2 className="text-4xl font-playfair font-bold">
              Word Deel van Ons Team
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Of je nu ervaring hebt of gewoon gepassioneerd bent over theater, 
            we zijn altijd op zoek naar nieuwe talenten om ons team te versterken.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy">
              Audities Informatie
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

import { useQuery } from "@tanstack/react-query";
import { type Production, type CastMember, type NewsArticle } from "@shared/schema";
import HeroSection from "@/components/hero-section";
import ProductionCard from "@/components/production-card";
import CastMember from "@/components/cast-member";
import NewsArticle from "@/components/news-article";
import SEOHead from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Users, Award } from "lucide-react";

export default function Home() {
  const { data: productions, isLoading: productionsLoading } = useQuery<Production[]>({
    queryKey: ["/api/productions"],
  });

  const { data: featuredCast, isLoading: castLoading } = useQuery<CastMember[]>({
    queryKey: ["/api/cast/featured"],
  });

  const { data: featuredNews, isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news/featured"],
  });

  const currentProductions = productions?.filter(p => p.status === "current") || [];
  const upcomingProductions = productions?.filter(p => p.status === "upcoming").slice(0, 2) || [];

  return (
    <>
      <SEOHead 
        title="Toneelgroep De Valk | Professioneel Theater"
        description="Toneelgroep De Valk - Een gepassioneerde lokale theatergroep die kwaliteitsvoorstellingen brengt sinds 1985. Ontdek onze huidige producties en toekomstige shows."
        keywords="theater, toneelgroep, voorstellingen, toneel, cultuur, kunst, De Valk"
      />

      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-theatre-navy mb-6">
                Over Toneelgroep De Valk
              </h2>
              <p className="text-lg text-theatre-charcoal mb-6 leading-relaxed">
                Sinds 1985 brengt Toneelgroep De Valk kwaliteitsvoorstellingen naar onze gemeenschap. 
                Met passie voor verhalen en een toewijding aan artistieke excellentie, creëren we 
                onvergetelijke theaterervaringen die het publiek raken en inspireren.
              </p>
              <p className="text-lg text-theatre-charcoal mb-8 leading-relaxed">
                Onze groep bestaat uit getalenteerde acteurs, regisseurs en technici die allemaal 
                één doel delen: het brengen van meeslepend theater dat zowel vermaakt als tot 
                nadenken stemt.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-theatre-gold">35+</div>
                  <div className="text-sm text-theatre-charcoal">Jaar Ervaring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-theatre-gold">150+</div>
                  <div className="text-sm text-theatre-charcoal">Producties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-theatre-gold">50K+</div>
                  <div className="text-sm text-theatre-charcoal">Bezoekers</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Beautiful theatre interior with ornate architecture" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
              
              <div className="absolute -bottom-6 -left-6 bg-theatre-red text-white p-6 rounded-lg shadow-xl max-w-xs">
                <h3 className="font-playfair font-bold text-lg mb-2">Onze Missie</h3>
                <p className="text-sm">Theater toegankelijk maken voor iedereen door kwaliteitsvoorstellingen en een warme, inclusieve gemeenschap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Productions */}
      <section id="productions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-theatre-navy mb-4">
              Huidige & Komende Producties
            </h2>
            <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
              Ontdek onze nieuwste voorstellingen en reserveer uw plaatsen voor een onvergetelijke theaterervaring
            </p>
          </div>

          {productionsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentProductions.map((production) => (
                <ProductionCard key={production.id} production={production} />
              ))}
              {upcomingProductions.map((production) => (
                <ProductionCard key={production.id} production={production} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/productions">
              <Button size="lg" className="bg-theatre-navy hover:bg-theatre-charcoal text-white">
                Bekijk Alle Producties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cast & Crew Spotlight */}
      <section id="cast" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-theatre-navy mb-4">
              Onze Getalenteerde Cast & Crew
            </h2>
            <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
              Maak kennis met de passionevolle kunstenaars die onze voorstellingen tot leven brengen
            </p>
          </div>

          {castLoading ? (
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
              {featuredCast?.map((member) => (
                <CastMember key={member.id} member={member} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/cast">
              <Button variant="outline" size="lg" className="border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white">
                Ontmoet Heel Ons Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section id="news" className="py-20 bg-theatre-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Laatste Nieuws & Updates
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Blijf op de hoogte van onze nieuwste ontwikkelingen, recensies en backstage verhalen
            </p>
          </div>

          {newsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/20 rounded mb-3"></div>
                  <div className="h-6 bg-white/20 rounded mb-3"></div>
                  <div className="h-16 bg-white/20 rounded mb-4"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews?.map((article) => (
                <NewsArticle key={article.id} article={article} variant="dark" />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/news">
              <Button size="lg" className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy">
                Bekijk Alle Nieuws
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-theatre-navy mb-4">
              Impressies van Onze Voorstellingen
            </h2>
            <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
              Een visuele reis door onze meest memorabele momenten op het podium
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Dramatic close-up of actor in character with theatrical makeup"
              },
              {
                src: "https://images.unsplash.com/photo-1534777367038-9404f45b869a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Beautiful stage lighting creating dramatic atmospheric mood"
              },
              {
                src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Enthusiastic audience giving standing ovation and applause"
              },
              {
                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Backstage preparation with period costumes and theatrical props"
              },
              {
                src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Ensemble cast performing dramatic group scene on stage"
              },
              {
                src: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Historic theatre building with classic architecture"
              },
              {
                src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Vibrant colorful stage lighting effects during performance"
              },
              {
                src: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
                alt: "Cast taking final bow after successful performance"
              }
            ].map((image, index) => (
              <img 
                key={index}
                src={image.src}
                alt={image.alt}
                className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer w-full h-48 object-cover card-hover" 
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white">
                Bekijk Volledige Galerij
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
